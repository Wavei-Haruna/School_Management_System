import React from 'react';
import Swal from 'sweetalert2';

const StudentRow = ({ student, courses, onMarkChange }) => {
  const studentMarks = student?.marks || {};
  const coursesArray = courses || [];

  const calculateWeightedMark = (mark, type) => {
    if (typeof mark !== 'number' || isNaN(mark)) {
      return 0;
    }
    if (type === 'MidSem') {
      return (mark / 100) * 25; // Convert to 25%
    } else if (type === 'Exercise') {
      return (mark / 100) * 15; // Convert to 15%
    } else if (type === 'End of Sem') {
      return (mark / 100) * 60; // Convert to 60%
    }
    return 0;
  };

  const calculateTotalMarks = (marks) => {
    return calculateWeightedMark(marks.exercise, 'Exercise') +
           calculateWeightedMark(marks.midsem, 'MidSem') +
           calculateWeightedMark(marks.exam, 'End of Sem');
  };

  const handleInputChange = (course, type, value) => {
    if (value > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Marks cannot be more than 100!',
      });
      return;
    }
    onMarkChange(course, type, value);
  };

  const totalMarks = coursesArray.reduce((total, course) => {
    const courseMarks = studentMarks[course] || { exercise: 0, midsem: 0, exam: 0 };
    return total + calculateTotalMarks(courseMarks);
  }, 0);

  const averageMarks = coursesArray.length ? totalMarks / coursesArray.length : 0;

  let grade;
if (averageMarks >= 80 && averageMarks <= 100) grade = 'A1';
else if (averageMarks >= 75 && averageMarks <= 79) grade = 'B2';
else if (averageMarks >= 70 && averageMarks <= 74) grade = 'B3';
else if (averageMarks >= 65 && averageMarks <= 69) grade = 'C4';
else if (averageMarks >= 60 && averageMarks <= 64) grade = 'C5';
else if (averageMarks >= 55 && averageMarks <= 59) grade = 'C6';
else if (averageMarks >= 50 && averageMarks <= 54) grade = 'D7';
else if (averageMarks >= 45 && averageMarks <= 49) grade = 'E8';
else grade = 'F9';

  return (
    <tr>
      <td className="border p-2">{student?.name}</td>
      <td className="border p-2">{student?.indexNumber}</td>
      {coursesArray.map((course) => (
        <td key={course} className="border p-2">
          <input
            type="number"
            value={studentMarks[course]?.exercise || ''}
            onChange={(e) => handleInputChange(course, 'exercise', parseInt(e.target.value, 10) || 0)}
            className="w-16 p-1 border rounded-full shadow-sm focus:outline-none"
            placeholder="Exercise"
            max="100"
          />
          <input
            type="number"
            value={studentMarks[course]?.midsem || ''}
            onChange={(e) => handleInputChange(course, 'midsem', parseInt(e.target.value, 10) || 0)}
            className="w-16 p-1 border rounded-full shadow-sm focus:outline-none"
            placeholder="MidSem"
            max="100"
          />
          <input
            type="number"
            value={studentMarks[course]?.exam || ''}
            onChange={(e) => handleInputChange(course, 'exam', parseInt(e.target.value, 10) || 0)}
            className="w-16 p-1 border rounded-full shadow-sm focus:outline-none"
            placeholder="End of Sem"
            max="100"
          />
        </td>
      ))}
      <td className="border p-2">{totalMarks.toFixed(2)}</td>
      <td className="border p-2">{averageMarks.toFixed(2)}</td>
      <td className="border p-2">{grade}</td>
      <td className="border p-2">{student.rank || 0}</td>
    </tr>
  );
};

export default StudentRow;
