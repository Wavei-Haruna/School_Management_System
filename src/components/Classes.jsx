import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../AuthContext';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const Classes = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({ id: '', className: '', courses: [], numberOfStudents: 0 });
  const [loading, setLoading] = useState(false);

 
  const fetchClasses = async () => {
    try {
      const q = collection(db, `teachers/${currentUser.uid}/classes`);
      const querySnapshot = await getDocs(q);
      const classesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchClasses();
    }
  }, [currentUser]);

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
        const classRef = doc(db, `teachers/${currentUser.uid}/classes/${formData.id}`);
        await updateDoc(classRef, {
          className: formData.className,
          courses: formData.courses,
          numberOfStudents: formData.numberOfStudents,
        });
        fetchClasses();
        toast.success('Class updated successfully');
      } else {
        await addDoc(collection(db, `teachers/${currentUser.uid}/classes`), {
          className: formData.className,
          courses: formData.courses,
          numberOfStudents: formData.numberOfStudents,
        });
        fetchClasses();
        toast.success('Class added successfully');
      }
      setFormData({ id: '', className: '', courses: [], numberOfStudents: 0 });
    } catch (error) {
      console.error('Error adding or updating class:', error);
      toast.error('Failed to add or update class');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = (cls) => {
    setFormData({
      id: cls.id,
      className: cls.className,
      courses: cls.courses,
      numberOfStudents: cls.numberOfStudents,
    });
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteDoc(doc(db, `teachers/${currentUser.uid}/classes/${classId}`));
      setClasses(classes.filter(cls => cls.id !== classId));
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
          {classes.map((cls) => (
            <li key={cls.id} className="mb-2 p-4 rounded bg-primary shadow flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-accent">{cls.className}</h4>
                <p className="text-white">Number of Students: {cls.numberOfStudents}</p>
                <p className="text-white font-body my-3">Courses: {cls.courses.join(', ')}</p>
              </div>
              <div className="flex flex-col space-y-4">
                <Link to={`/class/${cls.id}/students`} className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition duration-300">
                  <FaUserPlus className="text-xl" />
                </Link>
                <button onClick={() => handleEditClass(cls)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteClass(cls.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Add/Edit Class</h3>
        <form onSubmit={handleAddOrUpdateClass} className="max-w-3xl mx-auto">
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              className="w-full p-3 text-sm border rounded-full shadow-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter class name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="courses">Courses (comma-separated)</label>
            <input
              type="text"
              id="courses"
              name="courses"
              value={formData.courses.join(',')}
              onChange={(e) => setFormData({ ...formData, courses: e.target.value.split(',') })}
              className="w-full p-3 text-sm border rounded-full shadow-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter courses"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="numberOfStudents">Number of Students</label>
            <input
              type="number"
              id="numberOfStudents"
              name="numberOfStudents"
              value={formData.numberOfStudents}
              onChange={handleInputChange}
              className="w-full p-3 text-sm border rounded-full shadow-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter number of students"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-full shadow hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Saving...' : formData.id ? 'Update Class' : 'Add Class'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Classes;
