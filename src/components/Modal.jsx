import React from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi'; // Example close icon, adjust as needed

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          <FiX className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Ensure you have a <div id="modal-root"></div> in your index.html or root component
  );
};

export default Modal;
