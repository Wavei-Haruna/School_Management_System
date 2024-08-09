import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../AuthContext';
import { FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Classes = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const q = collection(db, 'classes');
      const querySnapshot = await getDocs(q);
      const classesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const assignedClasses = classesData.filter(cls => cls.teacherId === currentUser.uid);
      setClasses(assignedClasses);
      toast.success('Classes loaded successfully');
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchClasses();
    }
  }, [currentUser]);

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Classes</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Assigned Classes</h3>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="spinner-border animate-spin text-blue-500" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ul className="grid md:grid-cols-3 gap-10">
            {classes.length > 0 ? (
              classes.map((cls) => (
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
                  </div>
                </li>
              ))
            ) : (
              <p className="text-white">No classes assigned.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Classes;
