import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import Answer1 from '../component/answer1';
import Answer2 from '../component/answer2';
import AnswerHeader from '../component/answerheader';
import clipboardCopy from 'clipboard-copy';
import FormElement from '../component/FormElement';
import Swal from 'sweetalert2';
import Addline_token from '../component/addline_token';
const CreateForm = () => {
  const id = window.location.hash.split("/")[2];
  const depart = window.location.hash.split("/")[3];
  const id2 = window.location.hash.split("/")[2];
  const depart2 = window.location.hash.split("/")[3];
  const [formElements, setFormElements] = useState([]);
  const [formElementsget, setFormElementsget] = useState([]);
  const [formElementsget2, setFormElementsget2] = useState([]);

  const [data, setData] = useState([]);
  const [iduser, setiduser] = useState("")
  const [nameuser, setnameuser] = useState("")


  const [child_radio, setchild_radio] = useState([])
  const [answer, setanswer] = useState([])

  const [savedFormElements, setSavedFormElements] = useState([]);

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




  const handleCopyLink = async () => {
    try {
      // const link = `http://localhost:5173/#/SubmitForm/${id}/${depart}`;
      const link = `http://sfc.sungroup.co.th:8083/sungroupform/#/SubmitForm/${id}/${depart}`;

      await clipboardCopy(link); // This will copy the link to the clipboard

      toast.success('Link copied to clipboard!', { position: "top-center" });
    } catch (error) {
      console.error('Failed to copy link: ', error);
      toast.error('Failed to copy link', { position: "top-center" });
    }
  };


  const saveFormElements = async () => {
    setSavedFormElements([...formElements]);

    // Loop through the formElements array and send new elements to the API
    for (let i = 0; i < formElements.length; i++) {
      const element = {
        id: formElements[i].id,
        type: formElements[i].type,
        depart: formElements[i].depart,
        newele: formElements[i].newele,
        idtemp: formElements[i].idtemp,
      };

      // console.log("/save-form-elements", element);
      // Check if the element has the property "newele" with the value "new"
      if (element.newele === "new") {
        try {
          const response = await axios.post('http://sfc.sungroup.co.th:4400/save-form-elements', element);
          setFormElements([]);
          // Handle the response if needed
          console.log(`Form element ${i + 1} saved successfully!`, response.data);
          toast.success('👍 Save Success', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } catch (error) {
          // Handle any errors that occurred during the request
          console.error(`Failed to save form element ${i + 1}:`, error);
          toast.error('👎 Error', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }
    }
  };
  useEffect(() => {
    // Fetch all form elements from the API endpoint on component mount
    axios.get(`http://sfc.sungroup.co.th:4400/get-all-form-elements/${id}/${depart}`)
      .then((response) => {
        const fetchedFormElements = response.data.formElements;
        setFormElementsget(fetchedFormElements);
        setFormElements(fetchedFormElements); // Set formElements state with fetched data
        setFormElementsget2(fetchedFormElements);


      })
      .catch((error) => {
        console.error('Failed to fetch form elements:', error);
      });

  }, []); // Empty dependency array to execute the effect once on mount


  const [formName, setFormName] = useState(""); // Initialize with an empty string

  useEffect(() => {
    // Fetch the form name from the API endpoint on component mount
    axios.get(`http://sfc.sungroup.co.th:4400/get-name-form/${id}`)
      .then((response) => {
        // Extract the 'name' property from the response data
        const fetchedFormName = response.data.name;
        setFormName(fetchedFormName);
      })
      .catch((error) => {
        console.error('Failed to fetch form name:', error);
      });
  }, [id]); // Include 'id' in the dependency array to re-fetch when the 'id' changes

  const handleNameChange = async (event) => {
    const newName = event.target.value;

    setFormName(newName);

    if (newName !== '') {
      try {
        // Make an API call to update the form name
        await axios.put(`http://sfc.sungroup.co.th:4400/update-newname2/${id}/${newName}`);
        console.log('Updated new name form successfully!');
      } catch (error) {
        console.error('Failed to update new name:', error);
      }
    } else {
      // Fetch old form name if new name is empty
      try {
        const response = await axios.get(`http://sfc.sungroup.co.th:4400/get-name-form/${id}`);
        const fetchedFormName = response.data.name;
        setFormName(fetchedFormName);
      } catch (error) {
        console.error('Failed to fetch form name:', error);
      }
    }
  };


  const count = [];
  const [answerCounts, setAnswerCounts] = useState({});
  useEffect(() => {
    axios.get('http://sfc.sungroup.co.th:4400/get-answer/' + id)
      .then((response) => {
        setanswer(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch answer:', error);
      });
  }, []);


  

  answer.forEach((item) => {
    const { countid } = item;
    const isUnique = count.every((countItem) => countItem.countid !== countid);

    if (isUnique) {
      count.push(item);
    }
  });







  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRadio = await axios.get(`http://sfc.sungroup.co.th:4400/get-child-radio/${id}`);
        const responseSelect = await axios.get(`http://sfc.sungroup.co.th:4400/get-child-select/${id}`);

        const childRadioOptions = responseRadio.data;
        const childSelectOptions = responseSelect.data;

        const updatedFormElements = formElementsget2.map(element => {
          if (element.type === 'radio') {
            const matchingChildRadioOptions = childRadioOptions.filter(child => child.id_child_radio === element.idtemp);
            return { ...element, options: matchingChildRadioOptions };
          } else if (element.type === 'select') {
            const matchingChildSelectOptions = childSelectOptions.filter(child => child.id_child_select === element.idtemp);
            return { ...element, optionselect: matchingChildSelectOptions };
          }
          return element;
        });

        setFormElementsget(updatedFormElements);
      } catch (error) {
        console.error('Failed to fetch child options:', error);
      }
    };

    fetchData();
  }, [formElementsget2, id]);



  useEffect(() => {

    saveFormElements();
  }, [formElements]);






  const idtemp = uuidv4(); // Generate the temporary ID
  const addFormElement = async (type) => {
    const newele = "new";
    const idtemp = uuidv4(); // Generate the temporary ID
    const pic_name = ""
    const image_size = "400"


    let newElement;

    switch (type) {
      case 'photo':
        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
          pic_name,
          image_size
        };

        break;
      case 'select':
        const initialChildOptionselect = {
          uuid: id,
          idtemp: uuidv4(),
          value: 'ตัวเลือก 1',
          id_child_select: idtemp, // Use the idtemp of the new radio element
        };
        try {
          await axios.post(`http://sfc.sungroup.co.th:4400/save-child-select`, initialChildOptionselect)
          console.log('add child select success');
        } catch (error) {
          console.error('Failed to add child select success', error);
        }

        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
          optionselect: [initialChildOptionselect], // Initialize with an empty array for radio options

        };

        break;
      case 'radio':

        const initialChildOption = {
          uuid: id,
          idtemp: uuidv4(),
          value: 'ตัวเลือก 1',
          id_child_radio: idtemp, // Use the idtemp of the new radio element
          checked: 0,
          type: ""

        };

        try {
          await axios.post(`http://sfc.sungroup.co.th:4400/save-child-radio`, initialChildOption)
          console.log('add child radio success');

        } catch (error) {
          console.error('Failed to add child radio success', error);

        }

        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
          options: [initialChildOption], // Initialize with an empty array for radio options

        };
        break;
      case 'checkbox':
        // ... (your existing code)
        break;
      default:
        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
        };
      // ... (your existing code)
    }
    setFormElementsget((prevElements) => [...prevElements, newElement]);
    setFormElements((prevElements) => [...prevElements, newElement]);
    setFormElementsget2((prevElements) => [...prevElements, newElement]);
  };


  // element.options.push(newOption);

  console.log(",elementelementelement", formElementsget)

  const removeFormElement = async (index, elementId, idtemp, uuid, type) => {
    const oldPicName = formElementsget[index].pic_name;

    // Create a custom confirmation dialog using Swal
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'การลบนี้ รวมไปถึงคำตอบที่เคยบันทึกอยู่ในคำถามนี้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        // Send a delete request to the API to delete the element with the specified id
        await axios.delete(`http://sfc.sungroup.co.th:4400/delete-element/${elementId}/${idtemp}/${uuid}/${type}`)
          .then((response) => {
            console.log('Form element deleted successfully!');
            // Remove the element from formElementsget state
            if (oldPicName) {
              try {
                axios.delete(`http://sfc.sungroup.co.th:4400/deletepicture/${oldPicName}`);
              } catch (error) {
                console.error('Error deleting old image:', error);
              }
            }
            setFormElementsget((prevElements) => [
              ...prevElements.slice(0, index),
              ...prevElements.slice(index + 1),
            ]);
            setFormElements((prevElements) => [
              ...prevElements.slice(0, index),
              ...prevElements.slice(index + 1),
            ]);

            setFormElementsget2((prevElements) => [
              ...prevElements.slice(0, index),
              ...prevElements.slice(index + 1),
            ]);
            // Show a success message with Swal
            // Swal.fire(
            //   'Deleted!',
            //   'การลบเสร็จสิ้น!!!!',
            //   'success'
            // ).then(() => {
            //   // Additional actions after deletion if needed
            // });
          })
          .catch((error) => {
            console.error('Failed to delete form element:', error);
            // Show an error message with Swal
            Swal.fire(
              'Error!',
              'Failed to delete the form element.',
              'error'
            );
          });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };



  const navigate = useNavigate(); // Initialize useNavigate hook
  const submitform = () => {
    navigate(`/SubmitForm/${id}/${depart}`);
  };

  const handleTitleChange = async (event, index) => {
    const newTitle = event.target.value;

    setFormElementsget((prevElements) => {
      const updatedElements = [...prevElements];
      updatedElements[index].title = newTitle;
      return updatedElements;
    });
    const elementId = formElementsget[index].idtemp; // Assuming "id" is the unique identifier for each form element
    try {
      await axios.put(`http://sfc.sungroup.co.th:4400/update-element-title/${elementId}`, {
        title: newTitle,
      });
      console.log('Title updated successfully in the database!');
      // You can show a success toast or perform other actions upon successful update
    } catch (error) {
      console.error('Failed to update title in the database:', error);
      // You can show an error toast or perform other error handling
    }

  };


  console.log("formElements", formElements)
  console.log("formElementsget", formElementsget)

  const handleToggleSwitch = async (index, required) => {
    try {
      const updatedRequired = required === 1 ? 0 : 1;

      // Update the UI first
      setFormElementsget((prevElements) => {
        const updatedElements = [...prevElements];
        updatedElements[index].required = updatedRequired;
        return updatedElements;
      });

      // Update the database
      const elementId = formElementsget[index].idtemp;

      await axios.put(`http://sfc.sungroup.co.th:4400/update-required/${elementId}/${updatedRequired}`);
      console.log('Required updated successfully in the database!');
      // You can show a success toast or perform other actions upon successful update
    } catch (error) {
      console.error('Failed to update required in the database:', error);
      // You can show an error toast or perform other error handling
    }
  };


  const addOption = async (elementIndex) => {

    const updatedFormElements = [...formElementsget];
    const element = updatedFormElements[elementIndex];
    //  console.log("element",element)
    // Check if element and its options array are defined
    if (element && element.options) {
      const newOption = {
        uuid: id,
        idtemp: uuidv4(),
        value: `ตัวเลือก ${element.options.length + 1}`,
        id_child_radio: element.idtemp,
        checked: 0,
        type: ""
      };

      try {
        await axios.post(`http://sfc.sungroup.co.th:4400/save-child-radio`, newOption)
        console.log('add child radio success');
        element.options.push(newOption);

        // Update the formElementsget state with the updated options
        setFormElementsget(updatedFormElements);
      } catch (error) {
        console.error('Failed to add child radio success', error);

      }

    }
  };


  const addOptionOthers = async (elementIndex) => {

    const updatedFormElements = [...formElementsget];
    const element = updatedFormElements[elementIndex];
    //  console.log("element",element)
    // Check if element and its options array are defined
    if (element && element.options) {
      const newOption = {
        uuid: id,
        idtemp: uuidv4(),
        value: "",
        id_child_radio: element.idtemp,
        checked: 0,
        type: "other"
      };

      try {
        await axios.post(`http://sfc.sungroup.co.th:4400/save-child-radio`, newOption)
        await axios.put(`http://sfc.sungroup.co.th:4400/update-add-other-radio/` + element.idtemp + "/" + 1)


        console.log('add child radio success');
        element.options.push(newOption);

        // Update the formElementsget state with the updated options

        setFormElementsget((prevElements) => {
          const updatedElements = [...prevElements];
          updatedElements[elementIndex].add_other = 1;
          return updatedElements;
        });
      } catch (error) {
        console.error('Failed to add child radio success', error);

      }

    }
  };




  const addselect = async (elementIndex) => {

    const updatedFormElements = [...formElementsget];
    const element = updatedFormElements[elementIndex];
    //  console.log("element",element)
    // Check if element and its options array are defined
    if (element && element.optionselect) {
      const newOption = {
        uuid: id,
        idtemp: uuidv4(),
        value: `ตัวเลือก ${element.optionselect.length + 1}`,
        id_child_select: element.idtemp,
      };

      try {
        await axios.post(`http://sfc.sungroup.co.th:4400/save-child-select`, newOption)
        console.log('add child select success');
        element.optionselect.push(newOption);

        // Update the formElementsget state with the updated options
        setFormElementsget(updatedFormElements);
      } catch (error) {
        console.error('Failed to add select radio success', error);

      }

    }
  };




  const handleOptionChange = async (elementIndex, optionIndex, newValue) => {
    // console.log("elementIndex", elementIndex);
    // console.log("optionIndex", optionIndex);
    // console.log("newValue", newValue);

    const updatedFormElements = [...formElementsget];

    if (
      updatedFormElements[elementIndex] &&
      updatedFormElements[elementIndex].options
    ) {
      const optionToUpdate = updatedFormElements[elementIndex].options[optionIndex];

      if (optionToUpdate) {
        optionToUpdate.value = newValue;

        // Assuming "idtemp" is the property you want to use
        const idtempToUpdate = optionToUpdate.idtemp;

        setFormElementsget(updatedFormElements);

        try {
          // Replace "http://sfc.sungroup.co.th:4400/update-radio-value" with your API endpoint
          await axios.put(`http://sfc.sungroup.co.th:4400/update-radio-value/` + idtempToUpdate, { value: newValue });
          console.log("update value radio child success");
        } catch (error) {
          console.log("update value radio child failed", error);
        }
      }
    }
  };


  const handleOptionselectChange = async (elementIndex, optionIndex, newValue) => {


    const updatedFormElements = [...formElementsget];

    if (
      updatedFormElements[elementIndex] &&
      updatedFormElements[elementIndex].optionselect
    ) {
      const optionToUpdate = updatedFormElements[elementIndex].optionselect[optionIndex];

      if (optionToUpdate) {
        optionToUpdate.value = newValue;

        // Assuming "idtemp" is the property you want to use
        const idtempToUpdate = optionToUpdate.idtemp;

        setFormElementsget(updatedFormElements);

        try {
          await axios.put(`http://sfc.sungroup.co.th:4400/update-select-value/` + idtempToUpdate, { value: newValue });
          console.log("update value select child success");
        } catch (error) {
          console.log("update value select child failed", error);
        }
      }
    }
  };



  const removeOption = async (elementIndex, optionIndex) => {
    console.log('Removing option', elementIndex, optionIndex);

    const updatedFormElements = [...formElementsget];
    const element = updatedFormElements[elementIndex];



    if (element && element.options) {
      const optionToRemove = element.options[optionIndex];
      const idtempToRemove = optionToRemove.idtemp;



      if (optionToRemove.type === 'other') {

        await axios.put(`http://sfc.sungroup.co.th:4400/update-add-other-radio/` + element.options[optionIndex].id_child_radio + "/" + 0)
        // await axios.put(`http://sfc.sungroup.co.th:4400/update-add-other-radio/`+element.idtemp+"/"+1)
        await axios.delete(`http://sfc.sungroup.co.th:4400/delete-radio-option/` + idtempToRemove)

        setFormElementsget((prevElements) => {
          const updatedElements = [...prevElements];
          updatedElements[elementIndex].add_other = 0;
          return updatedElements;
        });
      } else if (optionToRemove.type === '') {

        await axios.delete(`http://sfc.sungroup.co.th:4400/delete-radio-option/` + idtempToRemove)
        setFormElementsget(updatedFormElements);
      }
      element.options.splice(optionIndex, 1);
    }
  };


  const removeOptionselect = async (elementIndex, optionIndex) => {
    console.log('Removing option', elementIndex, optionIndex);

    const updatedFormElements = [...formElementsget];
    const element = updatedFormElements[elementIndex];

    if (element && element.optionselect) {
      const optionToRemove = element.optionselect[optionIndex];
      const idtempToRemove = optionToRemove.idtemp;

      await axios.delete(`http://sfc.sungroup.co.th:4400/delete-select-option/` + idtempToRemove)
      setFormElementsget(updatedFormElements);

      element.optionselect.splice(optionIndex, 1);
    }
  };


  useEffect(() => {

    document.title = `${formName}`;
  }, [formName]); // Empty dependency array ensures the effect runs once after component mounts




  const handleImageUpload = async (event, idtemp, index) => {
    const imageFile = event.target.files[0]; // Assuming you're only selecting a single file
    const fileExtension = imageFile.name.split('.').pop(); // Get the file extension

    // Generate a unique filename using a timestamp and a random number
    const uniqueFileName = `file_${Date.now()}_${Math.floor(Math.random() * 10000)}.${fileExtension}`;

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', imageFile, uniqueFileName);

    // Get the old picture filename from the previous state
    const oldPicName = formElementsget[index].pic_name;

    // Delete the old picture from the server if it exists
    if (oldPicName) {
      try {
        await axios.delete(`http://sfc.sungroup.co.th:4400/deletepicture/${oldPicName}`);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    // Make the POST request using Axios
    try {
      const response = await axios.post(`http://sfc.sungroup.co.th:4400/upload/${idtemp}/${uniqueFileName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormElementsget((prevElements) => {
        const updatedElements = [...prevElements];
        updatedElements[index].pic_name = uniqueFileName;
        return updatedElements;
      });

      console.log(response.data.message); // Log the response message
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };



  const handleimagesize = async (event, idtemp, index) => {

    const size = event.target.value;

    console.log("size", size)
    // Make the POST request using Axios
    try {
      const response = await axios.put(`http://sfc.sungroup.co.th:4400/update-imagesize/${idtemp}/${size}`);

      setFormElementsget((prevElements) => {
        const updatedElements = [...prevElements];
        updatedElements[index].image_size = size;
        return updatedElements;
      });

      console.log(response.data.message); // Log the response message
    } catch (error) {
      console.error('Error  image size:', error);
    }
  };



  return (
    <div className="mx-auto " style={{ backgroundColor: '#efd8f4', maxWidth: '769px', maxHeight: 'auto' }}>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />


      <div className="flex justify-end">


        <button data-bs-toggle="modal"
          data-bs-target="#myModal" className=" px-4 py-2  bg-amber-500 text-white font-semibold rounded hover:bg-amber-700 me-3">
          การตอบกลับ

          <span style={{ fontSize: "15px" }} className="hover:animate-pulse mx-1 badge text-bg-danger">{count.length}</span>
        </button>

        <div className=" modal fade" id="myModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div>
                {/* Your other components and content */}
                <AnswerHeader count={count.length} id={id} />
                {/* Other parts of your component */}
              </div>

              <div className="modal-body">
                <ul className="nav justify-content-center nav-pills nav-fill" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">ข้อสรุป</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button disabled className="nav-link opacity-50 cursor-not-allowed" id="tab2-tab" data-bs-toggle="tab" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">แยกรายการ</button>
                  </li>

                </ul>
                <div className="tab-content mt-3" id="myTabContent">
                  <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
                    <Answer1 id={id} depart={depart} />
                  </div>
                  <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                    <Answer2 id={id} depart={depart} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-700" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>




        <button
          onClick={handleCopyLink}

          className=" px-4 py-2 me-3  bg-gray-500 text-white font-semibold rounded hover:bg-gray-700"
        >
          Copy Link
        </button>

        <button
          data-bs-toggle="modal"
          data-bs-target="#linemodal"
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-700"
        >


          <i className="fab fa-line fa-xl" style={{ color: '#ffffff' }}></i> รับการแจ้งเตือน
        </button>
        <div className=" modal fade" id="linemodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div>
                {/* Your other components and content */}
                <hr></hr>
                {/* Other parts of your component */}
              </div>

              <div className="modal-body" style={{ overflowY: 'auto' }}>
              <Addline_token uuid={id}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-700" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>




        {/* <button onClick={() => submitform()}
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700">
          Share Link
        </button> */}
      </div>

      <div className="my-4 bg-white rounded p-4 shadow-md border border-gray-300 relative">
        <div style={{ backgroundColor: "#ea5656" }} className="h-4 rounded-t-md absolute top-0 left-0 right-0 flex items-center justify-center text-white font-bold">
          <span></span>
        </div>
        <input
          type="text"
          value={formName}
          onChange={handleNameChange}
          className="text-2xl font-bold mt-2  mb-4 hover:border-b outline-none  focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"

          // className="mb-4 mt-2"
          onBlur={handleNameChange} // Save when input loses focus
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              handleNameChange(event); // Save when Enter key is pressed
            }
          }}
        />
        <div className="border-t mb-4" />
        {/* <p>Rest of the content...</p> */}
      </div>

      <div>
        {formElementsget.map((element, index) => (
          <div className="my-4" key={index}>
            <FormElement
              element={element}
              index={index}
              handleTitleChange={handleTitleChange}
              removeFormElement={removeFormElement}
              handleToggleSwitch={handleToggleSwitch}
              handleOptionChange={handleOptionChange} // Pass the option change handler to the FormElement
              addOption={addOption} // Pass the add option handler to the FormElement
              removeOption={removeOption}
              addOptionOthers={addOptionOthers}
              addselect={addselect}
              handleOptionselectChange={handleOptionselectChange}
              removeOptionselect={removeOptionselect}
              handleImageUpload={handleImageUpload}
              handleimagesize={handleimagesize}
            />
          </div>
        ))}
      </div>
      <div className="my-4">
        <div className="grid grid-cols-2 gap-2 justify-end">
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('text')}
          >
            คำตอบสั้นๆ
          </button>
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('textarea')}
          >
            ย่อหน้า
          </button>
        </div>
        <div className="border-t border-gray-300 mt-4 pt-4 grid grid-cols-2 gap-2 justify-end">
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('date')}
          >
            วันที่
          </button>
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('time')}
          >
            เวลา
          </button>
        </div>
      </div>
      <div className="my-4">
        <div className="border-t border-gray-300 mt-4 pt-4 grid grid-cols-2 gap-2 justify-end">

          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('radio')}
          >
            หลายตัวเลือก
          </button>
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('select')}
          >
            เลื่อนลง
          </button>
        </div>
      </div>
      <div className="my-4">
        <div className="border-t border-gray-300 mt-4 pt-4 grid grid-cols-2 gap-2 justify-end">
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('des')}
          >
            เพิ่มชื่อและรายละเอียด
          </button>
          <button
            className=" px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => addFormElement('photo')}
          >
            เพิ่มรูปภาพ
          </button>
        </div>
      </div>


    </div>
  );
};

export default CreateForm;


