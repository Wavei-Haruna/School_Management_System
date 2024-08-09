import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ClassList = ({ classes, onEdit, onDelete, onOpenModal }) => {
  return (
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
              <button onClick={() => onEdit(cls)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                <FaEdit />
              </button>
              <button onClick={() => onDelete(cls.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                <FaTrash />
              </button>
              <button onClick={() => onOpenModal(cls)} className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition duration-300">
                Enter Marks
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
