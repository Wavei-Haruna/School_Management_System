import React, { useEffect, useState } from 'react';

const ClassForm = ({ formData, setFormData, students, setStudents, teachers, loading, handleAddOrUpdateClass }) => {

  useEffect(() => {
    console.log("Form Data: ", formData);
    console.log("Students: ", students);
  }, [formData, students]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = value;
    setFormData(prevData => ({
      ...prevData,
      courses: updatedCourses,
    }));
  };

  const handleAddCourseField = () => {
    setFormData(prevData => ({
      ...prevData,
      courses: [...prevData.courses, ''],
    }));
  };

  const handleRemoveCourseField = (index) => {
    const updatedCourses = formData.courses.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      courses: updatedCourses,
    }));
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleAddStudentField = () => {
    setStudents([...students, { name: '', indexNumber: '' }]);
  };

  const handleRemoveStudentField = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  return (
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
            className="w-full p-3 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="teacherId">Class Teacher</label>
          <select
            id="teacherId"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleInputChange}
            className="w-full p-3 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
            required
          >
            <option value="" disabled>Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
        </div>
        <h4 className="text-lg font-bold mb-2 text-white font-body">Courses</h4>
        {formData.courses.map((course, index) => (
          <div key={index} className="mb-4 p-3 border rounded-lg bg-primary">
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor={`course${index}`}>Course</label>
              <input
                type="text"
                id={`course${index}`}
                value={course}
                onChange={(e) => handleCourseChange(index, e.target.value)}
                className="w-full p-2 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
                required
              />
            </div>
            {formData.courses.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveCourseField(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCourseField}
          className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full shadow-sm focus:outline-none transition duration-300 mb-4"
        >
          Add Course
        </button>
        <h4 className="text-lg font-bold mb-2 text-white font-body">Students</h4>
        {students.map((student, index) => (
          <div key={index} className="mb-4 p-3 border rounded-lg bg-primary">
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor={`studentName${index}`}>Name</label>
              <input
                type="text"
                id={`studentName${index}`}
                value={student.name}
                onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                className="w-full p-2 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor={`indexNumber${index}`}>Index Number</label>
              <input
                type="text"
                id={`indexNumber${index}`}
                value={student.indexNumber}
                onChange={(e) => handleStudentChange(index, 'indexNumber', e.target.value)}
                className="w-full p-2 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
                required
              />
            </div>
            {students.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveStudentField(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddStudentField}
          className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full shadow-sm focus:outline-none transition duration-300"
        >
          Add Student
        </button>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-full shadow-sm focus:outline-none transition duration-300"
        >
          {loading ? 'Saving...' : 'Save Class'}
        </button>
      </form>
    </div>
  );
};

export default ClassForm;
