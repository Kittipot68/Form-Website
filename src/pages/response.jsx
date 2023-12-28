import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Response() {
  const id = window.location.hash.split("/")[2];
  const depart = window.location.hash.split("/")[3];
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const handleNavigate = () => {
    navigate(`/SubmitForm/${id}/${depart}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <div className="text-center text-green-600 text-2xl font-bold mb-4">
        เราได้บันทึกคำตอบของคุณไว้แล้ว
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={handleNavigate}
        >
          ส่งคำตอบเพิ่ม
        </button>
        {/* OR, you can use the Link component like this:
          <Link to={`/Response/${id}/${depart}`} className="...">
            ส่งคำตอบเพิ่ม
          </Link>
        */}
      </div>
    </div>
  );
}
