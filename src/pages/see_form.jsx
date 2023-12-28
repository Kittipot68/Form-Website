// import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect,useRef } from "react";
import axios from "axios";
// import pic1 from "../assets/imgcard/leon-dewiwje-ldDmTgf89gU-unsplash.jpg";
import pic2 from "../assets/imgcard/thomas-lefebvre-gp8BLyaTaA0-unsplash.jpg"
import Swal from "sweetalert2"
import { v4 as uuidv4 } from 'uuid';
import EditCardNameModal from "../component/EditCardNameModal";
import DeleteForm from "../component/DeleteForm";
function SeeForm() {
  // Sample card data array (you can replace this with your actual data)
  const uniqueId = uuidv4();


  function UUIDToColor(uuid) {
    // Extract a portion of the UUID
    const portion = uuid.substring(0, 6);
  
    // Convert the portion to a decimal number
    const decimalValue = parseInt(portion, 16);
  
    // Map the decimal value to RGB components
    const red = (decimalValue >> 16) & 255;
    const green = (decimalValue >> 8) & 255;
    const blue = decimalValue & 255;
  
    // Return the color as an RGB string
    return `rgb(${red}, ${green}, ${blue})`;
  }


  const pic3 = "http://localhost:5173/?#/SubmitForm/b1e063dd-4bd5-4619-a844-fef5ce17ca40/ict"
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to navigate to the other page when clicking the "Add Card" button
  const navigateToOtherPage = () => {
    const urlpic = "http://localhost:5173/#/SubmitForm/" + uniqueId + "/" + depart;

    // Define the data to be sent in the request body
    const data = {
      urlpic: urlpic,
      // Add other data if needed
    };

    axios.post('http://sfc.sungroup.co.th:4400/create-form/' + uniqueId + '/' + depart, data)
      .then((response) => {
        // Handle the response if needed
        console.log('Create form successfully!', response.data);
        navigate('/CreateForm/' + uniqueId + '/' + depart); // Replace '/other-page' with the path to your other page
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Failed to create form:', error);
      });
  };


  const handleClick = (uuid, depart) => {
    navigate(`/CreateForm/${uuid}/${depart}`);
  };
  const handleClickNewTab = (uuid, depart) => {
    // const url = `http://localhost:5173/#/CreateForm/${uuid}/${depart}`;
    const url = `http://sfc.sungroup.co.th:8083/sungroupform/#/CreateForm/${uuid}/${depart}`;

    window.open(url); // Open in a new tab
  };


  const [form, setform] = useState([]);
  const [data, setData] = useState([]);
  const [iduser, setiduser] = useState("");
  const [depart, setdepart] = useState("");
  const [screenshot, setScreenshot] = useState("");


  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Function to toggle the dropdown open status for a specific card
  const toggleDropdown = (index) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null); // Close the dropdown if already open
    } else {
      setOpenDropdownIndex(index);
    }
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);

  const openEditModal = (index) => {
    setEditingCardIndex(index);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingCardIndex(null);
    setShowEditModal(false);
  };

  const handleSaveCardName = (id, newCardName) => {

    axios.put('http://sfc.sungroup.co.th:4400/update-newname/' + id + '/' + newCardName)
      .then((response) => {
        // Handle the response if needed
        console.log('update new name form successfully!', response.data);
        // navigate('/CreateForm/' + uniqueId + '/' + depart); // Replace '/other-page' with the path to your other page
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Failed to update new name:', error);
      });
  };

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
        setdepart(res.data.decoded.depart.toString());
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



  // if (!data || !iduser) {
  //   return <div>Loading...</div>; // You can replace this with a loading component
  // }
  // console.log("depart",depart)

  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchformdata = async () => {
      try {
        const res = await axios.get('http://sfc.sungroup.co.th:4400/get-all-form/' + depart)
        setform(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchformdata();
  }, [depart, form])


  // useEffect(() => {
  //   const getlinetoken = async () => {
  //     try {
  //       const res = await axios.get(`http://sfc.sungroup.co.th:4400/get-linetoken/${uuid}`);
  //       setLineTokens(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getlinetoken();
  // }, [uuid]);



  // useEffect(() => {
  //   const fetchScreenshot = async () => {
  //     try {
  //       const response = await axios.get(`http://sfc.sungroup.co.th:4400/screenshot?url=${encodeURIComponent(form[6].pic)}`, {
  //         responseType: 'arraybuffer', // Set the response type to arraybuffer to receive binary data
  //       });

  //       // Create a blob from the response data
  //       const screenshotBlob = new Blob([response.data], { type: 'image/png' });

  //       // Create a URL from the blob to use as the src for the <img> element
  //       const screenshotUrl = URL.createObjectURL(screenshotBlob);

  //       setScreenshot(screenshotUrl);
  //     } catch (err) {
  //       console.error('Error fetching screenshot:', err);
  //     }
  //   };
  //   fetchScreenshot();
  // }, [])
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const [cardColors, setCardColors] = useState([]);

  // Assuming 'form' is an array of card objects
  // Initialize the colors for each card
  if (cardColors.length !== form.length) {
    const colors = form.map(() => getRandomColor());
    setCardColors(colors);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDeleteId, setFormToDeleteId] = useState(null);

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setFormToDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle confirming the delete action
  const handleConfirmDelete = () => {

    axios.delete('http://sfc.sungroup.co.th:4400/delete-form/' + formToDeleteId)
      .then((response) => {
        // Handle the response if needed
        console.log('delete form successfully!', response.data);
        // navigate('/CreateForm/' + uniqueId + '/' + depart); // Replace '/other-page' with the path to your other page
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Failed to delete form:', error);
      });

    // Close the modal
    setShowDeleteModal(false);
  };


  const dropdownRef = useRef(null); // Ref to the dropdown menu element

  useEffect(() => {
    // Function to handle clicks outside of the dropdown and cards
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null); // Close the dropdown
      }
    };

    // Add click event listener to window
    window.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount


  useEffect(() => {

    document.title = `SunGroupForm`;
  }, []); // Empty dependency array ensures the effect runs once after component mounts



  return (
    <div className="border rounded  container mx-auto " style={{  maxWidth: '1200px', maxHeight: 'auto' }}>

      <div className="row">
        <div className="mt-3 mb-3 mr-3 " style={{ width: "250px" }}
        >
          {/* Card to navigate to other page */}
          <div
            className="card hover-red "
            onClick={navigateToOtherPage}
            style={{ cursor: "pointer", width: '250px'}}
          >
            <div className="card-body d-flex justify-content-center">
            <i className="fa-solid fa-plus fa-3x text-red-600 animate-spin hover:animate-none"></i>

              {/* Adjust the fa-3x class to change the size of the icon */}
            </div>
          </div>
          <label className="mt-2 text-sm">เพิ่มแบบฟอร์มใหม่</label>
        </div>

        {form.length > 0 ? (
          form.map((card, index) => (
            <div
              className={`mt-3 mb-3 mr-3 ${index < form.length - 1 ? "border-right" : ""
                }`}
              style={{ width: "250px" }}
              onClick={() => handleClick(card.uuid, card.depart)}
              ref={dropdownRef} 
              key={card.id}
            >
              <div
                className="card hover-red relative"
                title={card.title}
                style={{ width: "250px" }}

              >

                <div
                  className="rounded-t shadow-sm solid-color"
                  style={{
                    backgroundColor: UUIDToColor(card.uuid)     ,
                    width: "100%",
                    height: "200px", // Adjust the height as needed
                  }}
                ></div>
                {/* <img className="screenshot card-img-top" src={`data:image/png;base64,${screenshot}`} alt="Captured Screenshot" /> */}

                <div className="card-body">

                  <h6
                    title={card.name}
                    className="card-title font-bold "
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}


                  >
                    {truncateText(card.name, 20)}
                  </h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="card-text">
                      <small className="text-body-secondary ">
                        last updated
                      </small>
                      <i
                        data-bs-toggle="dropdown"
                        aria-expanded={openDropdownIndex === index}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(index); // Toggle dropdown open status
                        }}
                        className="hover-lightslategrey fa-solid fa-ellipsis-vertical"
                      ></i>
                      <ul className={`dropdown-menu ${openDropdownIndex === index ? "show" : ""}`}>
                        {/* Dropdown menu items */}
                        <li>
                          <button className="dropdown-item" onClick={(e) => {
                            e.stopPropagation(); // Prevent event propagation to the card
                            openEditModal(index);
                            toggleDropdown(-1); // Close the dropdown

                          }}>
                            <span><i className="mr-3 fa-solid fa-pen-to-square"></i></span>
                            เปลี่ยนชื่อ
                          </button>

                        </li>
                        <li>
                          <button className="dropdown-item" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(card.uuid);
                            toggleDropdown(-1); // Close the dropdown

                          }}>
                            <span><i className="mr-3 fa-regular fa-trash-can"></i></span>           นำออก
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={(e) => {
                            handleClickNewTab(card.uuid, card.depart);
                            e.stopPropagation(); // Prevent event propagation to the card
                            toggleDropdown(-1); // Close the dropdown

                            // openEditModal(index);
                          }}>
                            <span><i className="mr-3 fa-solid fa-arrow-up-right-from-square"></i></span>
                            เปิดในแท็บใหม่
                          </button>
                        </li>
                      </ul>

                    </div>
                    {/* Tooltip */}
                    <span className="absolute bg-black text-white px-2 py-1 rounded-md top-0 left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none transition-opacity duration-300">
                      {/* {card.name} */}
                    </span>
                  </div>


                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 mt-5 text-center">
            <h3 className="text-3xl font-semibold">Invalid Form</h3>
          </div>
        )}
        {editingCardIndex !== null && (
          <EditCardNameModal
            cardName={form[editingCardIndex].name}
            id={form[editingCardIndex].id} // Pass the id
            onClose={closeEditModal}
            onSave={handleSaveCardName}
          />
        )}

        <DeleteForm
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>

    </div>
    
  );
}

export default SeeForm;

