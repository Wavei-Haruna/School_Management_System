import React, { useEffect } from 'react';

const ClassForm = ({
  formData,
  setFormData,
  students,
  setStudents,
  teachers,
  loading,
  handleAddOrUpdateClass,
  errorMessage,
  setErrorMessage,
  hasDuplicateIndexNumbers
}) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate index numbers before submitting
    if (hasDuplicateIndexNumbers()) {
      setErrorMessage('Duplicate index numbers found! Each student must have a unique index number.');
      return;
    }

    // Clear any existing error message if validation passes
    setErrorMessage('');

    // Pass the event object to handleAddOrUpdateClass
    handleAddOrUpdateClass(e);
  };

  return (
    <div className="mt-2  ">
      <h3 className="text-xl font-bold mb-4 font-serif text-white font-body ">Add/Edit Class</h3>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className=" mx-auto  w-full relative mb-12">
        <table className="w-full bg-white border-collapse rounded-lg">
          <tbody>
            <tr>
              <td className="p-2 border-b">
                <label className="block text-gray-600 font-semibold">Class Name</label>
              </td>
              <td className="p-2 border-b">
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border rounded-md shadow-sm focus:outline-none focus:border-accent"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 border-b">
                <label className="block text-gray-600 font-semibold">Class Teacher</label>
              </td>
              <td className="p-2 border-b">
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border rounded-md shadow-sm focus:outline-none focus:border-accent"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-2 border-b">
                <label className="block text-gray-600 font-semibold">Courses</label>
              </td>
              <td className="p-2 border-b">
                {formData.courses.map((course, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => handleCourseChange(index, e.target.value)}
                      className="w-full p-2 text-sm border rounded-md shadow-sm focus:outline-none focus:border-accent mb-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCourseField(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCourseField}
                  className="mt-2 p-2 bg-accent text-white text-sm rounded-md"
                >
                  Add Course
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-2 border-b">
                <label className="block text-gray-600 font-semibold">Students</label>
              </td>
              <td className="p-2 border-b">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Name</th>
                      <th className="p-2 border-b">Index Number</th>
                      <th className="p-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index}>
                        <td className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={student.name}
                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                            className="w-full p-2 text-sm border rounded-md shadow-sm focus:outline-none focus:border-accent"
                            required
                          />
                        </td>
                        <td className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="Index Number"
                            value={student.indexNumber}
                            onChange={(e) => handleStudentChange(index, 'indexNumber', e.target.value)}
                            className="w-full p-2 text-sm border rounded-md shadow-sm focus:outline-none focus:border-accent"
                            required
                          />
                        </td>
                        <td className="p-2 border-b text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveStudentField(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={handleAddStudentField}
                  className="mt-4 p-2 bg-accent text-white text-sm  rounded-md"
                >
                  Add Student
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-2 border-b"></td>
              <td className="p-2 border-b">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 text-center p-2 mx-auto bg-accent text-white text-lg rounded-full shadow-sm hover:bg-accent-dark transition duration-200"
                >
                  {loading ? 'Saving...' : 'Save Class'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default ClassForm;
