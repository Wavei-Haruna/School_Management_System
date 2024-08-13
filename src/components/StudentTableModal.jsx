import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import StudentRow from './StudentRow';
import { useAuth } from '../AuthContext'; // Importing useAuth to access current user's role

const StudentTableModal = ({ classData, onClose }) => {
  const { currentUser } = useAuth(); // Get current user from auth context
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState(classData?.semester || '');
  const [year, setYear] = useState(classData?.year || '');
  const [isLocked, setIsLocked] = useState(classData?.isLocked || false); // Track if marks submission is locked

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
          Swal.fire('Error', 'Failed to fetch students', 'error');
        }
      };
      fetchStudents();
    }
  }, [classData?.id]);

  const handleMarkChange = (index, courseId, type, value) => {
    if (isLocked) {
      Swal.fire('Locked', 'You cannot edit marks after sending to admin.', 'error');
      return;
    }

    const updatedStudents = [...students];
    const student = updatedStudents[index];

    if (!student.marks) {
      student.marks = {};
    }

    if (!student.marks[courseId]) {
      student.marks[courseId] = {};
    }

    student.marks[courseId][type] = value;

    setStudents(updatedStudents);
  };

  const calculateTotalMarks = (marks) => {
    return calculateWeightedMark(marks.exercise, 'Exercise') +
           calculateWeightedMark(marks.midsem, 'MidSem') +
           calculateWeightedMark(marks.exam, 'End of Sem');
  };

  const calculateWeightedMark = (mark, type) => {
    if (typeof mark !== 'number' || isNaN(mark)) {
      return 0;
    }
    if (type === 'MidSem') {
      return (mark / 100) * 25; // Convert to 25%
    } else if (type === 'Exercise') {
      return (mark / 100) * 15; // Convert to 15%
    } else if (type === 'End of Sem') {
      return (mark / 100) * 60; // Convert to 60%
    }
    return 0;
  };

  const calculateRanks = (studentsList) => {
    const rankedStudents = [...studentsList]
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .map((student, index) => ({ ...student, rank: index + 1 }));

    return rankedStudents;
  };

  const handleSaveMarks = async () => {
    if (currentUser.uid !== classData.teacherId) {
      Swal.fire('Permission Denied', 'You do not have permission to save marks.', 'error');
      return;
    }

    setLoading(true);
    try {
      const rankedStudents = calculateRanks(students);

      for (const student of rankedStudents) {
        const studentMarks = student.marks || {};
        const coursesArray = classData?.courses || [];

        const totalMarks = coursesArray.reduce((total, course) => {
          const courseMarks = studentMarks[course] || { exercise: 0, midsem: 0, exam: 0 };
          return total + calculateTotalMarks(courseMarks);
        }, 0);

        const averageMarks = coursesArray.length ? totalMarks / coursesArray.length : 0;

        const hasNonZeroMark = coursesArray.some(course => {
          const courseMarks = studentMarks[course] || { exercise: 0, midsem: 0, exam: 0 };
          return Object.values(courseMarks).some(mark => mark > 0);
        });

        let grade;
        if (hasNonZeroMark) {
          if (averageMarks >= 90) grade = 'A+';
          else if (averageMarks >= 80) grade = 'A';
          else if (averageMarks >= 70) grade = 'B';
          else if (averageMarks >= 60) grade = 'C';
          else grade = 'F';
        } else {
          grade = 'N/A';
        }

        const studentRef = doc(db, `classes/${classData.id}/students/${student.id}`);
        await updateDoc(studentRef, {
          marks: studentMarks,
          totalMarks: totalMarks || 0,
          averageMarks: averageMarks || 0,
          grade: grade || 'F',
          rank: student.rank || 0,
          semester: semester || '',
          year: year || '',
        });
      }
      Swal.fire('Success', 'Marks saved successfully', 'success');
      onClose();
    } catch (error) {
      console.error('Error saving marks:', error);
      Swal.fire('Error', 'Failed to save marks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAdmin = async () => {
    if (currentUser.uid !== classData.teacherId) {
      Swal.fire('Permission Denied', 'You do not have permission to send marks to admin.', 'error');
      return;
    }

    setLoading(true);
    try {
      const classRef = doc(db, `classes/${classData.id}`);
      await updateDoc(classRef, {
        isLocked: true,
        status: 'Submitted to Admin',
      });

      Swal.fire('Success', 'Marks sent to admin and locked.', 'success');
      setIsLocked(true);
    } catch (error) {
      console.error('Error sending marks to admin:', error);
      Swal.fire('Error', 'Failed to send marks to admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{classData?.className || 'Class'} - Students Marks</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition duration-300">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Semester:</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder={classData?.semester || 'Enter semester'}
            className="w-full p-2 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
            disabled={isLocked} // Disable if locked
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Year:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={classData?.year || 'Enter year'}
            className="w-full p-2 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
            disabled={isLocked} // Disable if locked
          />
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
                courses={classData?.courses}
                onMarkChange={(course, type, value) => handleMarkChange(index, course, type, value)}
              />
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleSaveMarks}
            disabled={loading || isLocked}
            className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300"
          >
            {loading ? 'Saving...' : 'Save Marks'}
          </button>
          <button
            onClick={handleSendToAdmin}
            disabled={loading || isLocked}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300"
          >
            {loading ? 'Sending...' : 'Send to Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTableModal;