import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';
import StudentRow from './StudentRow';

const StudentTableModal = ({ classData, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classData?.id) {
      const fetchStudents = async () => {
        try {
          const q = collection(db, `classes/${classData.id}/students`);
          const querySnapshot = await getDocs(q);
          const studentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsData);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };
      fetchStudents();
    }
  }, [classData?.id]);

  const handleMarkChange = (index, courseId, value) => {
    const updatedStudents = [...students];
    updatedStudents[index].marks = { ...updatedStudents[index].marks, [courseId]: Number(value) };
    setStudents(updatedStudents);
  };

  const handleSaveMarks = async () => {
    setLoading(true);
    try {
      for (const student of students) {
        const studentRef = doc(db, `classes/${classData.id}/students/${student.id}`);
        await updateDoc(studentRef, { marks: student.marks });
      }
      toast.success('Marks saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const calculateRanks = () => {
      const studentsWithRanks = [...students].sort((a, b) => {
        const totalMarksA = Object.values(a.marks || {}).reduce((sum, mark) => sum + mark, 0);
        const totalMarksB = Object.values(b.marks || {}).reduce((sum, mark) => sum + mark, 0);
        return totalMarksB - totalMarksA;
      }).map((student, index) => ({ ...student, rank: index + 1 }));
      setStudents(studentsWithRanks);
    };

    if (students.length > 0) {
      calculateRanks();
    }
  }, [students]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{classData?.className || 'Class'} - Students Marks</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition duration-300">
            <FaTimes size={20} />
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Index Number</th>
              {classData?.courses?.map((course) => (
                <th key={course} className="border p-2">{course}</th>
              ))}
              <th className="border p-2">Total</th>
              <th className="border p-2">Average</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Rank</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <StudentRow
                key={student.id}
                student={student}
                courses={classData?.courses || []}
                onMarkChange={(courseId, value) => handleMarkChange(index, courseId, value)}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveMarks}
            disabled={loading}
            className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-full shadow-sm focus:outline-none transition duration-300"
          >
            {loading ? 'Saving...' : 'Save Marks'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTableModal;
