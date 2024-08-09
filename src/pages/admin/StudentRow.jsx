import React from 'react';

const StudentRow = ({ student, courses, onMarkChange }) => {
  const studentMarks = student?.marks || {};
  const coursesArray = courses || [];
  
  const totalMarks = coursesArray.reduce((total, course) => total + (studentMarks[course] || 0), 0);
  const averageMarks = coursesArray.length ? totalMarks / coursesArray.length : 0;
  
  // Check if any mark is non-zero
  const hasNonZeroMark = coursesArray.some(course => studentMarks[course] > 0);
  
  let grade;
  if (hasNonZeroMark) {
    if (averageMarks >= 90) grade = 'A+';
    else if (averageMarks >= 80) grade = 'A';
    else if (averageMarks >= 70) grade = 'B';
    else if (averageMarks >= 60) grade = 'C';
    else grade = 'F';
  } else {
    grade = 'N/A'; // Default grade if no marks are entered
  }
  
  return (
    <tr>
      <td className="border p-2">{student?.name || 'Unknown'}</td>
      <td className="border p-2">{student?.indexNumber || 'N/A'}</td>
      {coursesArray.map((course) => (
        <td key={course} className="border p-2">
          <input
            type="number"
            value={studentMarks[course] || null}
            onChange={(e) => {
            

              const value = parseInt(e.target.value, 10);
              onMarkChange(course, isNaN(value) ? 0 : value);
            }}
            className="w-full p-2 text-sm border rounded-full shadow-sm focus:outline-none focus:border-accent"
            min="0"
            max="100"
          />
        </td>
      ))}
      <td className="border p-2">{totalMarks}</td>
      <td className="border p-2">{averageMarks.toFixed(2)}</td>
      <td className="border p-2">{grade}</td>
      <td className="border p-2">{student?.rank || 'N/A'}</td>
    </tr>
  );
};

export default StudentRow;
