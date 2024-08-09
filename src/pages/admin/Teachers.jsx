import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', subjects: [] });
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    try {
      const q = collection(db, 'teachers');
      const querySnapshot = await getDocs(q);
      const teachersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        const teacherRef = doc(db, `teachers/${formData.id}`);
        await updateDoc(teacherRef, {
          name: formData.name,
          email: formData.email,
          subjects: formData.subjects,
        });
        fetchTeachers();
        toast.success('Teacher updated successfully');
      } else {
        await addDoc(collection(db, 'teachers'), {
          name: formData.name,
          email: formData.email,
          subjects: formData.subjects,
        });
        fetchTeachers();
        toast.success('Teacher added successfully');
      }
      setFormData({ id: '', name: '', email: '', subjects: [] });
    } catch (error) {
      console.error('Error adding or updating teacher:', error);
      toast.error('Failed to add or update teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = (teacher) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      subjects: teacher.subjects,
    });
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await deleteDoc(doc(db, `teachers/${teacherId}`));
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
      toast.success('Teacher deleted successfully');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  };

  return (
    <div className="p-4 h-screen overflow-scroll">
      <h2 className="font-header text-2xl font-bold  md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Teachers</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Existing Teachers ({teachers?.length})</h3>
        <ul className="grid md:grid-cols-3 gap-10">
          {teachers.map((teacher) => (
            <li key={teacher.id} className="mb-2 p-4 rounded bg-primary shadow flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-accent">{teacher.name}</h4>
                <p className="text-white">Email: {teacher.email}</p>
                {/* <p className="text-white font-body my-3">Subjects: {teacher.classes.courses?.join(', ')}</p> */}
              </div>
              <div className="flex flex-col space-y-4">
                {/* <button onClick={() => handleEditTeacher(teacher)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                  <FaEdit />
                </button> */}
                <button onClick={() => handleDeleteTeacher(teacher.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Add/Edit Teacher</h3>
        <form onSubmit={handleAddOrUpdateTeacher} className="bg-primary p-6 rounded shadow-lg flex flex-col space-y-4">
          <div>
            <label className="block text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white">Subjects (comma-separated)</label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-300">
            {loading ? 'Saving...' : formData.id ? 'Update Teacher' : 'Add Teacher'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Teachers;
