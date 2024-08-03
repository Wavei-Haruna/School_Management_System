import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FaFileAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReportCards = () => {
  const [reportCards, setReportCards] = useState([]);
  const [formData, setFormData] = useState({ id: '', student: '', subject: '', grade: '' });
  const [loading, setLoading] = useState(false);

  const fetchReportCards = async () => {
    try {
      const q = collection(db, 'reportCards');
      const querySnapshot = await getDocs(q);
      const reportCardsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReportCards(reportCardsData);
    } catch (error) {
      console.error('Error fetching report cards:', error);
    }
  };

  useEffect(() => {
    fetchReportCards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateReportCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        const reportCardRef = doc(db, `reportCards/${formData.id}`);
        await updateDoc(reportCardRef, {
          student: formData.student,
          subject: formData.subject,
          grade: formData.grade,
        });
        fetchReportCards();
        toast.success('Report card updated successfully');
      } else {
        await addDoc(collection(db, 'reportCards'), {
          student: formData.student,
          subject: formData.subject,
          grade: formData.grade,
        });
        fetchReportCards();
        toast.success('Report card added successfully');
      }
      setFormData({ id: '', student: '', subject: '', grade: '' });
    } catch (error) {
      console.error('Error adding or updating report card:', error);
      toast.error('Failed to add or update report card');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReportCard = (reportCard) => {
    setFormData({
      id: reportCard.id,
      student: reportCard.student,
      subject: reportCard.subject,
      grade: reportCard.grade,
    });
  };

  const handleDeleteReportCard = async (reportCardId) => {
    try {
      await deleteDoc(doc(db, `reportCards/${reportCardId}`));
      setReportCards(reportCards.filter(reportCard => reportCard.id !== reportCardId));
      toast.success('Report card deleted successfully');
    } catch (error) {
      console.error('Error deleting report card:', error);
      toast.error('Failed to delete report card');
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Report Cards</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Existing Report Cards</h3>
        <ul className="grid md:grid-cols-3 gap-10">
          {reportCards.map((reportCard) => (
            <li key={reportCard.id} className="mb-2 p-4 rounded bg-primary shadow flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-accent">{reportCard.student}</h4>
                <p className="text-white">Subject: {reportCard.subject}</p>
                <p className="text-white font-body my-3">Grade: {reportCard.grade}</p>
              </div>
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleEditReportCard(reportCard)} className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600 transition duration-300">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteReportCard(reportCard.id)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 font-serif text-white font-body">Add/Edit Report Card</h3>
        <form onSubmit={handleAddOrUpdateReportCard} className="bg-primary p-6 rounded shadow-lg flex flex-col space-y-4">
          <div>
            <label className="block text-white">Student</label>
            <input
              type="text"
              name="student"
              value={formData.student}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-300">
            {loading ? 'Saving...' : formData.id ? 'Update Report Card' : 'Add Report Card'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportCards;
