import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', classes: [] });
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const q = collection(db, 'students');
      const querySnapshot = await getDocs(q);
      const studentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        const studentRef = doc(db, `students/${formData.id}`);
        await updateDoc(studentRef, {
          name: formData.name,
          email: formData.email,
          classes: formData.classes,
        });
        fetchStudents();
        toast.success('Student updated successfully');
      } else {
        await addDoc(collection(db, 'students'), {
          name: formData.name,
          email: formData.email,
          classes: formData.classes,
        });
        fetchStudents();
        toast.success('Student added successfully');
      }
      setFormData({ id: '', name: '', email: '', classes: [] });
    } catch (error) {
      console.error('Error adding or updating student:', error);
      toast.error('Failed to add or update student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    setFormData({
      id: student.id,
      name: student.name,
      email: student.email,
      classes: student.classes,
    });
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteDoc(doc(db, `students/${studentId}`));
      setStudents(students.filter(student => student.id !== studentId));
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Students</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Existing Students</h3>
        <ul className="grid md:grid-cols-3 gap-10">
          {students.map((student) => (
            <li key={student.id} className="mb-2 p-4 rounded bg-primary shadow flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-accent">{student.name}</h4>
                <p className="text-white">Email: {student.email}</p>
                <p className="text-white font-body my-3">Classes: {student.classes.join(', ')}</p>
              </div>
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleEditStudent(student)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteStudent(student.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Add/Edit Student</h3>
        <form onSubmit={handleAddOrUpdateStudent} className="bg-primary p-6 rounded shadow-lg flex flex-col space-y-4">
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
            <label className="block text-white">Classes (comma-separated)</label>
            <input
              type="text"
              name="classes"
              value={formData.classes}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-300">
            {loading ? 'Saving...' : formData.id ? 'Update Student' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Students;
