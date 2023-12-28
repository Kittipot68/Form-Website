import React, { useState,useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import sunform from '../assets/sunform.png';


export default function Navbar({ children }) {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('tokenform');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const [data, setData] = useState([]);
  const [iduser, setiduser]=  useState("")
  const [nameuser,setnameuser] = useState("")



  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const token = localStorage.getItem("tokenform"); // Retrieve the token from local storage
  const config = {
    headers: { Authorization: "Bearer " + token }, // Set the Authorization header with the token
  };
  const authen = async () => {
    try {
      const res = await axios.post(
        "http://sfc.sungroup.co.th:4400/sunform/auth",
        null,
        config
      ); // Make a POST request with the token
      setData(res.data);
      // if (res.data.status === "ok" && res.data.decoded.role === "user") {

      if (res.data.status === "ok") {
        setiduser(res.data.decoded.id.toString());
        setnameuser(res.data.decoded.user.toString());

      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "โปรดเข้าสู่ระบบ",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              localStorage.removeItem("tokenform");
              // Navigate to the login page or any other page after logout
              navigate("/"); // Replace "/login" with the desired route after logout
            }, 500); // 2-second delay
          }
        });
      }
    } catch (err) {
      console.log(err);
      localStorage.removeItem("tokenform");
      // Navigate to the login page or any other page after logout
      navigate("/"); // Replace "/login" with the desired route after logout
    }
  };

  useEffect(() => {
    authen();
  }, [iduser]);

  return (
    <>
      <nav style={{minWidth:"410px"}} className="bg-white shadow fixed w-full top-0 z-50 flex justify-center">
        <div className="container  flex items-center justify-between">
          <a href="#">
            <img src={sunform} alt="Logo" className="w-32" />
          </a>
          <div className="px-4 py-3 sm:flex text-gray-700 font-medium items-center">
              Welcome, <span className="text-teal-500">{nameuser}</span>
              
           
            <div className="px-4 py-3 relative inline-block text-left" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center justify-center w-8 h-8 p-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              >
                {isOpen ? (
                  <i className="fa-solid fa-caret-down fa-rotate-180"></i>
                ) : (
                  <i className="fa-solid fa-caret-down"></i>
                )}
              </button>

              {isOpen && (
                <div className="absolute right-0 z-10 mt-2 space-y-2 bg-white border border-gray-300 rounded-md shadow-lg">
                  {/* Dropdown items */}
                  <a
                    href="#"
                    className="rounded block w-full text-left text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white focus:outline-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto" style={{ marginTop: '150px' }}>
        {children}
      </div>
    </>
  );
}
