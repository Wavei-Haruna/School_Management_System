import React from 'react';

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

  const totalMarks = coursesArray.reduce((total, course) => {
    const courseMarks = studentMarks[course] || { exercise: 0, midsem: 0, exam: 0 };
    return total + calculateTotalMarks(courseMarks);
  }, 0);

  const averageMarks = coursesArray.length ? totalMarks / coursesArray.length : 0;

  let grade;
  if (averageMarks >= 90) grade = 'A+';
  else if (averageMarks >= 80) grade = 'A';
  else if (averageMarks >= 70) grade = 'B';
  else if (averageMarks >= 60) grade = 'C';
  else grade = 'F';

  return (
    <tr>
      <td className="border p-2">{student?.name}</td>
      <td className="border p-2">{student?.indexNumber}</td>
      {coursesArray.map((course) => (
        <td key={course} className="border p-2">
          <input
            type="number"
            value={studentMarks[course]?.exercise || ''}
            onChange={(e) => onMarkChange(course, 'exercise', parseInt(e.target.value, 10) || 0)}
            className="w-16 p-1 border rounded-full shadow-sm focus:outline-none"
            placeholder="Exercise"
          />
          <input
            type="number"
            value={studentMarks[course]?.midsem || ''}
            onChange={(e) => onMarkChange(course, 'midsem', parseInt(e.target.value, 10) || 0)}
            className="w-16 p-1 border rounded-full shadow-sm focus:outline-none"
            placeholder="MidSem"
          />
          <input
            type="number"
            value={studentMarks[course]?.exam || ''}
            onChange={(e) => onMarkChange(course, 'exam', parseInt(e.target.value, 10) || 0)}
            className="w-16 p-1 border rounded-full shadow-sm focus:outline-none"
            placeholder="End of Sem"
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