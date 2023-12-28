import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios"; // Import Axios library
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState(""); // State for the username input
  const [password, setPassword] = useState(""); // State for the password input
  const [datalogin, setdatalogin] = useState([]);



  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    setSubmitting(true); // End the submission process

    // Prepare the data to be sent
    e.preventDefault();

    // Make the POST request using Axios
    try {
      const response = await axios.get(
        "http://sfc.sungroup.co.th:4400/loginsunform/" + username + "/" + password
      );

      setdatalogin(response.data);
      if (
        response.data.status === "ok" &&
        response.data.message === "success"
      ) {
        // Show a success notification
        toast.success("🦄 Login Successful!", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Navigate to the desired page (replace "/SeeForm" with the actual path)
        setTimeout(() => {
          // Navigate to the desired page (replace "/SeeForm" with the actual path)
          localStorage.setItem("tokenform", response.data.token);
          navigate("/SeeForm");
        }, 2500);
      } else {
        toast.error("🦄Login Error", {
          position: "top-right",
          autoClose: 5,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setSubmitting(false); // End the submission process

        return;
      }
      console.log("Response from the server:", response.data);
    } catch (err) {
      setSubmitting(false); // End the submission process

      console.error("Error while submitting form data:", err);
    }
  };



  const token = localStorage.getItem("tokenform"); // Retrieve the token from local storage

  useEffect(() => {
    // Check if the token is available in local storage
    if (token) {
      // If token exists, perform the authentication and navigate if successful
      navigate("/SeeForm");
    } else {
      return;
    }
  }, [token]); // Only run the effect when the token changes

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg rounded-lg p-8 mb-4 flex flex-col w-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-red-600">
              SunGroup <span className="text-red-500">Form</span>
            </h2>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out hover:bg-gray-100"
              id="username"
              type="text"
              placeholder="Username"
              value={username} // Set the value of the input to the state variable
              onChange={handleUsernameChange} // Call the handleUsernameChange function on input change
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out hover:bg-gray-100"
              id="password"
              type="password"
              placeholder="Password"
              value={password} // Set the value of the input to the state variable
              onChange={handlePasswordChange} // Call the handlePasswordChange function on input change
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              className={`${isSubmitting ? "pointer-events-none opacity-50" : ""
                } bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dodging-button`}
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-2"
              href="/"
            >
              {/* Forgot Password? */}
            </a>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
