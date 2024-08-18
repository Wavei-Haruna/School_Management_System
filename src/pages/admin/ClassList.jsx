import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ClassList = ({ classes, onEdit, onDelete, onOpenModal }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Existing Classes</h3>
      {classes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-primary rounded-lg shadow-lg">
            <thead>
              <tr className="text-left text-white bg-accent">
                <th className="py-4 px-6">Class Name</th>
                <th className="py-4 px-6">Number of Students</th>
                <th className="py-4 px-6">Courses</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-secondary transition duration-300">
                  <td className="py-4 px-6 text-accent font-bold">{cls.className}</td>
                  <td className="py-4 px-6 text-white">{cls.numberOfStudents}</td>
                  <td className="py-4 px-6 text-white">{cls.courses.join(', ')}</td>
                  <td className="py-4 px-6 flex space-x-3">
                    <button
                      onClick={() => onEdit(cls)}
                      aria-label="Edit Class"
                    >
                      <FaEdit className='text-white'/>
                    </button>
                    <button
                      onClick={() => onDelete(cls.id)}
                      aria-label="Delete Class"
                    >
                      <FaTrash  className='text-red-600'/>
                    </button>
                    <button
                      onClick={() => onOpenModal(cls)}
                      className="bg-blue-500 w-32 text-white p-2 rounded-full shadow hover:bg-blue-600 transition duration-300"
                      aria-label="Enter Marks"
                    >
                      Enter Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-white">No classes available.</p>
      )}
    </div>
  );
};

export default ClassList;
