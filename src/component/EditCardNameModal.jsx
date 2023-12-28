import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function EditCardNameModal({ id, cardName, onClose, onSave }) {
    const [newCardName, setNewCardName] = useState(cardName);

    const handleSave = () => {
        onSave(id, newCardName);
        onClose();
    };

    return (
        <Modal
            show={true}
            onHide={onClose}
            centered
            backdrop="static"

        >
            <Modal.Body className="bg-white rounded-xl p-4">
                <div className="text-start">
                    <h1 className="text-xl font-semibold mb-2">เปลี่ยนชื่อ</h1>
                    <h5 className="text-sm text-gray-500">โปรดป้อนชื่อใหม่สำหรับรายการ</h5>
                </div>
                <input
                    type="text"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className=" w-full p-2 border rounded   mt-4"
                />

                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 text-white bg-slate-500 rounded hover:bg-slate-600 focus:outline-none focus:ring focus:ring-slate-300 mr-2"
                        onClick={onClose}

                    >
                        ยกเลิก
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 disabled:bg-red-300 disabled:cursor-not-allowed"
                        onClick={handleSave}
                        disabled={newCardName === ''}
                    >
                        บันทึก
                    </button>

                </div>
            </Modal.Body>
        </Modal>
    );
}

export default EditCardNameModal;
