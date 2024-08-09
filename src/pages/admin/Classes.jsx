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
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

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

  const handleAddOrUpdateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newClass = {
        className: formData.className,
        courses: formData.courses,
        numberOfStudents: students.length,
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
      setFormData({ id: '', className: '', courses: [], numberOfStudents: 0, teacherId: '' });
      setStudents([{ name: '', indexNumber: '' }]);
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
    for (const student of existingStudents) {
      const studentRef = doc(db, `classes/${classId}/students/${student.id}`);
      await deleteDoc(studentRef);
    }
    await addStudents(classId);
  };

  const handleEditClass = (cls) => {
    setFormData({
      id: cls.id,
      className: cls.className,
      courses: cls.courses,
      numberOfStudents: cls.numberOfStudents,
      teacherId: cls.teacherId,
    });
    setStudents(cls.students || [{ name: '', indexNumber: '' }]);
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
    <div className="p-4 ">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Classes</h2>
      <ClassList classes={classes} onEdit={handleEditClass} onDelete={handleDeleteClass} onOpenModal={handleOpenModal} />
      <ClassForm
        formData={formData}
        setFormData={setFormData}
        students={students}
        setStudents={setStudents}
        teachers={teachers}
        loading={loading}
        handleAddOrUpdateClass={handleAddOrUpdateClass}
      />
      {showModal && (
        <StudentTableModal classData={selectedClass} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Classes;
