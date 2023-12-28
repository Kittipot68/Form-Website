import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-dialog">
        <div className="modal-content bg-white shadow-lg rounded-lg">
          <div className="modal-header bg-gray-200 p-4 border-b">
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
          </div>
          <div className="modal-body p-4">
            <p className="text-gray-700">
              Are you sure you want to delete this item?
            </p>
          </div>
          <div className="modal-footer p-4 border-t">
            <button
              className="btn btn-secondary mr-2"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                onConfirm();
                onClose(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
