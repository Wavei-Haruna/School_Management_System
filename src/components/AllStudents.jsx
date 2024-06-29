import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../AuthContext';
import { FaPlusCircle, FaSpinner, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import calculateGradeAndRemarks from '../utils/calculateGradeAndRemarks';
import { toast } from 'react-toastify';

const AllStudents = () => {
  const { currentUser } = useAuth();
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        if (currentUser) {
          const allStudentsData = [];
          // Fetch all classes of the current user
          const classesRef = collection(db, `teachers/${currentUser.uid}/classes`);
          const classesSnapshot = await getDocs(classesRef);

          for (const classDoc of classesSnapshot.docs) {
            const classId = classDoc.id;
            const className = classDoc.data().className;

            // Fetch students of each class
            const studentsRef = collection(db, `teachers/${currentUser.uid}/classes/${classId}/students`);
            const studentsSnapshot = await getDocs(studentsRef);
            
            studentsSnapshot.forEach(studentDoc => {
              const studentData = studentDoc.data();
              const studentId = studentDoc.id;

              // Calculate total marks
              const totalMarks = Object.values(studentData.grades).reduce((acc, { grade }) => acc + parseInt(grade), 0);
              const numberOfCourses = Object.values(studentData.grades).length;

              // Calculate average marks
              const averageMarks = totalMarks / numberOfCourses;

              // Calculate remarks
              const { remark } = calculateGradeAndRemarks(averageMarks);

              // Push student data with additional fields
              allStudentsData.push({
                id: studentId,
                name: studentData.name,
                classId: classId,
                className: className,
                grades: studentData.grades,
                totalMarks: totalMarks,
                averageMarks: averageMarks.toFixed(2), // Round to 2 decimal places
                remark: remark,
              });
            });
          }

          // Sort all students by average marks descending
          allStudentsData.sort((a, b) => b.averageMarks - a.averageMarks);

          // Assign positions
          allStudentsData.forEach((student, index) => {
            student.position = index + 1;
          });

          setAllStudents(allStudentsData);
        } else {
          console.error('Current user is undefined.');
        }
      } catch (error) {
        console.error('Error fetching all students:', error);
      }
    };

    fetchAllStudents();
  }, [currentUser]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">All Students</h2>
      <div className="mt-6">
        <div ref={printRef}>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4">Position</th>
                <th className="p-4">Name</th>
                <th className="p-4">Class Name</th>
                <th className="p-4">Average Marks</th>
                <th className="p-4">Remarks</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allStudents.map((student, index) => (
                <tr key={student.id} className="bg-gray-700 text-white">
                  <td className="p-4">{student.position}</td>
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.className}</td>
                  <td className="p-4">{student.averageMarks}</td>
                  <td className="p-4">{student.remark}</td>
                  <td className="p-4 flex space-x-2">
                    {/* Add edit and delete buttons here if needed */}
                    <button onClick={() => handlePrint} className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition duration-300">
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
