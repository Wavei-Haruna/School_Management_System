// src/components/FetchStudentData.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import ReportCardGenerator from './ReportCardGenerator';
import Loader from '../../components/Loader'; // Ensure Loader component is available

const FetchStudentData = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClsName, setSelectedClsName] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const q = collection(db, 'classes');
        const querySnapshot = await getDocs(q);
        const classesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0].id);
          setSelectedClsName(classesData[0].className);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        try {
          setLoading(true);
          const q = collection(db, `classes/${selectedClass}/students`);
          const querySnapshot = await getDocs(q);
          const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsData);
          console.log(students)
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [selectedClass]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prevState => {
      console.log(studentId)
      if (prevState.includes(studentId)) {
        return prevState.filter(id => id !== studentId);
      }
      return [...prevState, studentId];
    });
  };

  const handleGenerateReport = () => {
    const selectedData = students.filter(student => selectedStudents.includes(student.id));
    if (selectedData.length > 0) {
      // Handle ReportCardGenerator here
    } else {
      alert('Please select at least one student');
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-4 container mx-auto">
            <label htmlFor="class-select" className="block text-lg font-semibold mb-2">
              Select Class:
            </label>
            <select
              id="class-select"
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-2 border rounded w-full bg-primary"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id} className='text-white'>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
          {students.length > 0 && (
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Select Students:</label>
              <ul className="space-y-2">
                {students.map(student => (
                  <li key={student.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelection(student.id)}
                      className="form-checkbox"
                    />
                    <label htmlFor={`student-${student.id}`} className="ml-2">
                      {student.name} - {student.indexNumber}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handleGenerateReport}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Report Card
          </button>
          {selectedStudents.length > 0 && (
            <ReportCardGenerator 
              students={students.filter(student => selectedStudents.includes(student.id))}
              studClass={selectedClsName || null}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FetchStudentData;
