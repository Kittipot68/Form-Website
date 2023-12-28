import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function DeleteForm({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      {/* <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
      <div className="text-start">
                    <h1 className="text-xl font-semibold mb-2">ต้องการลบแบบฟอร์มนี้ใช้หรือไม่?</h1>
                    <h5 className="text-sm text-gray-500">หากทำการลบแล้ว แบบฟอร์มและข้อมูลทั้งหมดจะไม่สามารถกู้กลับมาได้</h5>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 text-white bg-slate-500 rounded hover:bg-slate-600 focus:outline-none focus:ring focus:ring-slate-300 mr-2"
                        onClick={onClose}

                    >
                        ยกเลิก
                    </button>
                    <button
                        className="px-4 py-0 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 disabled:bg-red-300 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                    >
                        ลบ
                    </button>

                </div>

                </Modal.Body>

      {/* <Modal.Footer>
       
      </Modal.Footer> */}
    </Modal>
  );
}

export default DeleteForm;
