import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';
import ClassList from './ClassList';
import ClassForm from './ClassForm';
import StudentTableModal from './StudentTableModal';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({ id: '', className: '', courses: [], numberOfStudents: 0, teacherId: '' });
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([{ name: '', indexNumber: '' }]);
  const [originalStudents, setOriginalStudents] = useState([]); // Track original students
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchClasses = async () => {
    try {
      const q = collection(db, 'classes');
      const querySnapshot = await getDocs(q);
      const classesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const q = collection(db, 'teachers');
      const querySnapshot = await getDocs(q);
      const teachersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const hasDuplicateIndexNumbers = () => {
    const indexNumbers = students.map(student => student.indexNumber);
    return new Set(indexNumbers).size !== indexNumbers.length;
  };

  const handleAddOrUpdateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newClass = {
        className: formData.className,
        courses: formData.courses,
        numberOfStudents: students.length, // Update the number of students
        teacherId: formData.teacherId,
      };

      if (formData.id) {
        const classRef = doc(db, `classes/${formData.id}`);
        await updateDoc(classRef, newClass);
        await updateStudents(formData.id);
        fetchClasses();
        toast.success('Class updated successfully');
      } else {
        const classRef = await addDoc(collection(db, 'classes'), newClass);
        await addStudents(classRef.id);
        fetchClasses();
        toast.success('Class added successfully');
      }

      // Reset the form after success
      setFormData({ id: '', className: '', courses: [], numberOfStudents: 0, teacherId: '' });
      setStudents([{ name: '', indexNumber: '' }]);
      setOriginalStudents([]);
    } catch (error) {
      console.error('Error adding or updating class:', error);
      toast.error('Failed to add or update class');
    } finally {
      setLoading(false);
    }
  };

  const addStudents = async (classId) => {
    for (const student of students) {
      await addDoc(collection(db, `classes/${classId}/students`), student);
    }
  };

  const updateStudents = async (classId) => {
    const studentDocs = await getDocs(collection(db, `classes/${classId}/students`));
    const existingStudents = studentDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Identify students to be deleted
    const studentsToRemove = originalStudents.filter(
      originalStudent => !students.some(student => student.indexNumber === originalStudent.indexNumber)
    );

    // Remove students from Firestore
    for (const student of studentsToRemove) {
      const studentRef = doc(db, `classes/${classId}/students/${student.id}`);
      await deleteDoc(studentRef);
    }

    // Add or update students in Firestore
    for (const student of students) {
      const existingStudent = existingStudents.find(s => s.indexNumber === student.indexNumber);
      if (existingStudent) {
        const studentRef = doc(db, `classes/${classId}/students/${existingStudent.id}`);
        await updateDoc(studentRef, student);
      } else {
        await addDoc(collection(db, `classes/${classId}/students`), student);
      }
    }
  };

  const handleEditClass = async (cls) => {
    setFormData({
      id: cls.id,
      className: cls.className,
      courses: cls.courses,
      numberOfStudents: cls.numberOfStudents,
      teacherId: cls.teacherId,
    });

    const studentDocs = await getDocs(collection(db, `classes/${cls.id}/students`));
    const fetchedStudents = studentDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(fetchedStudents);
    setOriginalStudents(fetchedStudents); // Store original students
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteDoc(doc(db, `classes/${classId}`));
      setClasses(classes.filter(cls => cls.id !== classId));
      toast.success('Class deleted successfully');
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  const handleOpenModal = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
    setShowModal(false);
  };

  return (
    <div className="p-4 container mx-auto">
      <h2 className="font-header  text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Classes</h2>
      <div className="grid grid-cols-2 gap-x-10">
      <ClassList classes={classes} onEdit={handleEditClass} onDelete={handleDeleteClass} onOpenModal={handleOpenModal} />
      <ClassForm
        formData={formData}
        setFormData={setFormData}
        students={students}
        setStudents={setStudents}
        teachers={teachers}
        loading={loading}
        handleAddOrUpdateClass={handleAddOrUpdateClass}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        hasDuplicateIndexNumbers={hasDuplicateIndexNumbers}
      />
      </div>
      {showModal && (
        <StudentTableModal classData={selectedClass} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Classes;
