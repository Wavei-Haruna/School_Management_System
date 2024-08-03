import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', teacher: '', students: [] });
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    try {
      const q = collection(db, 'classes');
      const querySnapshot = await getDocs(q);
      const classesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        const classRef = doc(db, `classes/${formData.id}`);
        await updateDoc(classRef, {
          name: formData.name,
          teacher: formData.teacher,
          students: formData.students,
        });
        fetchClasses();
        toast.success('Class updated successfully');
      } else {
        await addDoc(collection(db, 'classes'), {
          name: formData.name,
          teacher: formData.teacher,
          students: formData.students,
        });
        fetchClasses();
        toast.success('Class added successfully');
      }
      setFormData({ id: '', name: '', teacher: '', students: [] });
    } catch (error) {
      console.error('Error adding or updating class:', error);
      toast.error('Failed to add or update class');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = (classData) => {
    setFormData({
      id: classData.id,
      name: classData.name,
      teacher: classData.teacher,
      students: classData.students,
    });
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteDoc(doc(db, `classes/${classId}`));
      setClasses(classes.filter(classData => classData.id !== classId));
      toast.success('Class deleted successfully');
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Classes</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Existing Classes</h3>
        <ul className="grid md:grid-cols-3 gap-10">
          {classes.map((classData) => (
            <li key={classData.id} className="mb-2 p-4 rounded bg-primary shadow flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-accent">{classData.name}</h4>
                <p className="text-white">Teacher: {classData.teacher}</p>
                <p className="text-white font-body my-3">Students: {classData.students.join(', ')}</p>
              </div>
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleEditClass(classData)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteClass(classData.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Add/Edit Class</h3>
        <form onSubmit={handleAddOrUpdateClass} className="bg-primary p-6 rounded shadow-lg flex flex-col space-y-4">
          <div>
            <label className="block text-white">Class Name</label>
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
            <label className="block text-white">Teacher</label>
            <input
              type="text"
              name="teacher"
              value={formData.teacher}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white">Students (comma-separated)</label>
            <input
              type="text"
              name="students"
              value={formData.students}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-300">
            {loading ? 'Saving...' : formData.id ? 'Update Class' : 'Add Class'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Classes;
