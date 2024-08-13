import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase'; // Adjust the path as needed
import { FaPlus } from 'react-icons/fa'; // For the 'Add Marks' button icon
import StudentTableModal from './StudentTableModal'; // Adjust the path as needed

const AssignedClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        const teacherId = auth.currentUser?.uid; // Get the current user's ID
        if (!teacherId) return;

        const q = query(collection(db, 'classes'), where('teacherId', '==', teacherId));
        const querySnapshot = await getDocs(q);
        const classesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching assigned classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedClasses();
  }, []);

  const handleAddMarks = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
    setShowModal(false);
  };

  if (loading) return <p>Loading classes...</p>;

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-3xl font-semibold mb-6'>Assigned Classes</h2>
      <ul className='space-y-4'>
        {classes.length > 0 ? (
          classes.map(cls => (
            <li key={cls.id} className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-bold'>{cls.className}</h3>
              <p className='text-gray-600'>Number of Students: {cls.numberOfStudents}</p>
              <p className='text-gray-600'>Courses: {cls.courses.join(', ')}</p>
              <button
                onClick={() => handleAddMarks(cls)}
                className='mt-4 flex items-center text-primary font-medium hover:text-primary-dark'
              >
                <FaPlus className='mr-2' /> Add Marks
              </button>
            </li>
          ))
        ) : (
          <p>No classes assigned.</p>
        )}
      </ul>

      {showModal && (
        <StudentTableModal classData={selectedClass} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AssignedClasses;
