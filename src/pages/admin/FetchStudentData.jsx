import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import ReportCardGenerator from './ReportCardGenerator';
import Loader from '../../components/Loader'; // Ensure Loader component is available

const FetchStudentData = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [selectedStudents, setSelectedStudents] = useState([]); // To keep track of selected students
  const [selectedClassName, setSelectedClassName] = useState(''); // To store the selected class name

  // Fetch classes from the database
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true); // Set loading to true when starting fetch
        const q = collection(db, 'classes');
        const querySnapshot = await getDocs(q);
        const classesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0].id); // Set the first class as default selection
          setSelectedClassName(classesData[0].className); // Set the first class name as default
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch is done
      }
    };

    fetchClasses();
  }, []);

  // Fetch students from the selected class
  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        try {
          setLoading(true); // Set loading to true when starting fetch
          const q = collection(db, `classes/${selectedClass}/students`);
          const querySnapshot = await getDocs(q);
          const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsData);

          // Update the selected class name
          const selectedClassData = classes.find(cls => cls.id === selectedClass);
          setSelectedClassName(selectedClassData ? selectedClassData.className : '');
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(false); // Set loading to false after fetch is done
        }
      };

      fetchStudents();
    }
  }, [selectedClass, classes]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prevState => {
      if (prevState.includes(studentId)) {
        return prevState.filter(id => id !== studentId);
      }
      return [...prevState, studentId];
    });
  };

  const handleGenerateReport = () => {
    const selectedData = students.filter(student => selectedStudents.includes(student.id));
    if (selectedData.length > 0) {
      // Update the ReportCardGenerator to handle selectedData
    } else {
      alert('Please select at least one student');
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <Loader /> // Display loader while fetching data
      ) : (
        <>
          <div className="mb-4 container mx-auto">
            <label htmlFor="class-select text-gray-700" className="block text-lg font-semibold mb-2">
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
              studClass={selectedClassName} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default FetchStudentData;
