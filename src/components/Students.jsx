import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../AuthContext';
import { FaSpinner, FaEdit, FaTrash, FaPrint, FaFilePdf } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import calculateGradeAndRemarks from '../utils/calculateGradeAndRemarks';
import { toast } from 'react-toastify';
import AllStudents from './AllStudents';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Modal from 'react-modal'; // Import Modal from react-modal

const Students = () => {
  const { currentUser } = useAuth();
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [formData, setFormData] = useState({ name: '', grades: {} });
  const [loading, setLoading] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // State to manage selected student for PDF view
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, `teachers/${currentUser.uid}/classes/${classId}/students`);
        const querySnapshot = await getDocs(studentsRef);
        const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calculate total marks and sort students
        studentsData.forEach(student => {
          student.totalMarks = Object.values(student.grades).reduce((acc, { grade }) => acc + parseInt(grade), 0);
        });
        studentsData.sort((a, b) => b.totalMarks - a.totalMarks);

        // Assign class positions
        studentsData.forEach((student, index) => {
          student.position = index + 1;
        });

        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchClassInfo = async () => {
      try {
        if (currentUser && classId) {
          const classRef = doc(db, `teachers/${currentUser.uid}/classes/${classId}`);
          const classDoc = await getDoc(classRef);
          if (classDoc.exists()) {
            setClassInfo(classDoc.data());
          } else {
            console.error('Class document does not exist.');
          }
        } else {
          console.error('Current user or class ID is undefined.');
        }
      } catch (error) {
        console.error('Error fetching class info:', error);
      }
    };

    if (currentUser && classId) {
      fetchStudents();
      fetchClassInfo();
    }
  }, [currentUser, classId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGradeChange = (course, grade) => {
    const { grade: letterGrade, remark } = calculateGradeAndRemarks(grade);
    setFormData(prevData => ({
      ...prevData,
      grades: { ...prevData.grades, [course]: { grade, letterGrade, remark } },
    }));
  };

  const handleAddOrUpdateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingStudentId) {
        const studentRef = doc(db, `teachers/${currentUser.uid}/classes/${classId}/students/${editingStudentId}`);
        await updateDoc(studentRef, {
          name: formData.name,
          grades: formData.grades,
        });
        toast.success('Student Marks updated');
      } else {
        // Convert grades to numbers if necessary before adding
        const grades = {};
        for (const course in formData.grades) {
          grades[course] = {
            grade: parseInt(formData.grades[course].grade),
            letterGrade: formData.grades[course].letterGrade,
            remark: formData.grades[course].remark
          };
        }

        await addDoc(collection(db, `teachers/${currentUser.uid}/classes/${classId}/students`), {
          name: formData.name,
          grades: grades,
          class: classId,
        });
        toast.success('Student added successfully');
      }
      setFormData({ name: '', grades: {} });
      setEditingStudentId(null);
      fetchStudents(); // Fetch students again after adding or updating
    } catch (error) {
      console.error('Error adding or updating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    setFormData({
      name: student.name,
      grades: student.grades,
    });
    setEditingStudentId(student.id);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteDoc(doc(db, `teachers/${currentUser.uid}/classes/${classId}/students/${studentId}`));
      setStudents(students.filter(student => student.id !== studentId));
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const openPdfModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closePdfModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const StudentResultPDF = ({ student }) => (
  <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Student Result</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.boldText}>Name:</Text>
            </View>
            <View style={styles.cell}>
              <Text>{student.name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.boldText}>Class:</Text>
            </View>
            <View style={styles.cell}>
              <Text>{classInfo.className}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.boldText}>Position:</Text>
            </View>
            <View style={styles.cell}>
              <Text>{student.position}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.boldText}>Grades:</Text>
            </View>
          </View>
          {classInfo.courses.map(course => (
            <View key={course} style={styles.row}>
              <View style={styles.cell}>
                <Text>{course}:</Text>
              </View>
              <View style={styles.cell}>
                <Text>{student.grades[course]?.grade}</Text>
              </View>
              <View style={styles.cell}>
                <Text>({student.grades[course]?.letterGrade} - {student.grades[course]?.remark})</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.boldText}>Total Marks:</Text>
            </View>
            <View style={styles.cell}>
              <Text>{student.totalMarks}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 20,
    },
    header: {
      paddingBottom: 20,
      textAlign: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    section: {
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      paddingBottom: 5,
    },
    cell: {
      padding: 5,
      flexGrow: 1,
    },
    boldText: {
      fontWeight: 'bold',
    },
  });

  return (
    <div className="p-4">
      {classId ? (
        <>
          <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Students in {classInfo.className}</h2>
          <form onSubmit={handleAddOrUpdateStudent} className="mt-4 max-w-7xl mx-auto font-semibold ">
            <div className="mb-4">
              <label className="block text-white mb-2" htmlFor="name">Student Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 text-sm border md:w-1/2 rounded-full shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter student name"
                required
              />
            </div>
            {classInfo.courses && classInfo.courses.map(course => (
              <div key={course} className="mb-4">
                <label className="block text-white mb-2" htmlFor={`grade-${course}`}>{course} Grade</label>
                <input
                  type="number"
                  id={`grade-${course}`}
                  name={course}
                  value={formData.grades[course]?.grade || ''}
                  onChange={e => handleGradeChange(course, e.target.value)}
                  className="w-full p-3 text-sm border md:w-1/2 rounded-full shadow-sm focus:outline-none focus:border-blue-500"
                  placeholder={`Enter grade for ${course}`}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 md:w-1/2 rounded-full shadow hover:bg-blue-600 transition duration-300 flex justify-center items-center"
            >
              {loading ? <FaSpinner className="animate-spin" /> : editingStudentId ? 'Update Student' : 'Add Student'}
            </button>
          </form>
          <div className="mt-6">
            <table className="w-full text-left table-auto overflow-x-scroll ">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4">Position</th>
                  <th className="p-4">Name</th>
                  {classInfo.courses && classInfo.courses.map(course => (
                    <th key={course} className="p-4">{course}</th>
                  ))}
                  <th className="p-4">Total Marks</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="bg-gray-700 text-white">
                    <td className="p-4">{student.position}</td>
                    <td className="p-4">{student.name}</td>
                    {classInfo.courses && classInfo.courses.map(course => (
                      <td key={course} className="p-4">
                        {student.grades[course]?.grade} ({student.grades[course]?.letterGrade} - {student.grades[course]?.remark})
                      </td>
                    ))}
                    <td className="p-4">{student.totalMarks}</td>
                    <td className="p-4 flex space-x-4">
                      <button onClick={() => handleEditStudent(student)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                        <FaTrash />
                      </button>
                      <button onClick={() => openPdfModal(student)} className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition duration-300">
                        <FaFilePdf />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Modal for viewing PDF */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closePdfModal}
            contentLabel="Student Result PDF"
            className="modal absolute top-[15vh] left-36 w-[70vw]"
            overlayClassName="overlay"
          >
            <div className="flex justify-end mb-4">
              <button onClick={closePdfModal} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                Close
              </button>
            </div>
            {selectedStudent && (
              <PDFViewer width="100%" height="600">
                <StudentResultPDF student={selectedStudent} />
              </PDFViewer>
            )}
          </Modal>
        </>
      ) : (
        <AllStudents />
      )}
    </div>
  );
};

export default Students;
