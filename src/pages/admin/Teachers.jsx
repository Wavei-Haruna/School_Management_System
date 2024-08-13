import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FaTrash, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate  } from 'react-router-dom';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeachers(teachersData);
      console.log(teachers)
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await deleteDoc(doc(db, `teachers/${teacherId}`));
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
      toast.success('Teacher deleted successfully');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  };

  const handleClassButtonClick = (className) => {
    // history.push(`/classes/${className}`);

    navigate('`/classes/${className}`')
  };

  return (
    <div className="p-6 h-screen overflow-auto bg-gray-900">
      <h2 className="text-4xl font-bold text-center text-white mb-8">Teachers</h2>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500" role="status"></div>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Subjects</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Class</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-100 transition duration-300">
                <td className="text-left py-3 px-4">{teacher.name}</td>
                <td className="text-left py-3 px-4">{teacher.email}</td>
                <td className="text-left py-3 px-4">{teacher.subject}</td>
                <td className="text-left py-3 px-4">
                  <button
                    onClick={() => handleClassButtonClick(teacher.className)}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    {teacher.className}
                    <FaArrowRight className="ml-2" />
                  </button>
                </td>
                <td className="text-center py-3 px-4">
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Teachers;
