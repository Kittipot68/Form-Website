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

const CreateForm = () => {
  const id = window.location.hash.split("/")[2];
  const depart = window.location.hash.split("/")[3];
  const id2 = window.location.hash.split("/")[2];
  const depart2 = window.location.hash.split("/")[3];
  const [formElements, setFormElements] = useState([]);
  const [formElementsget, setFormElementsget] = useState([]);
  const [child_radio, setchild_radio] = useState([])

  const [answer, setanswer] = useState([])




  const [savedFormElements, setSavedFormElements] = useState([]);
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

      })
      .catch((error) => {
        console.error('Failed to fetch form elements:', error);
      });

  }, []); // Empty dependency array to execute the effect once on mount

  const [getnameform, setgetnameform] = useState([])
  useEffect(() => {
    // Fetch all form elements from the API endpoint on component mount
    axios.get(`http://sfc.sungroup.co.th:4400/get-all-form/${depart}`)
      .then((response) => {
        setgetnameform(response.data)

      })
      .catch((error) => {
        console.error('Failed to fetch form elements:', error);
      });

  }, []); // Empty dependency array to execute the effect once on mount

  function returnnameform(formid) {
    const foundForm = getnameform.find(form => form.uuid === formid);
    return foundForm ? foundForm.name : "";
  }
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

  console.log("answer", answer)

  const count = [];

  answer.forEach((item) => {
    const { countid } = item;
    const isUnique = count.every((countItem) => countItem.countid !== countid);

    if (isUnique) {
      count.push(item);
    }
  });



  // useEffect(() => {
  //   try {
  //     axios.get(`http://sfc.sungroup.co.th:4400/get-child-radio/` + id)
  //       .then((response) => {
  //         const childRadioData = response.data;

  //         const updatedFormElements = formElements.map(element => {
  //           if (element.type === 'radio') {
  //             const matchingChildRadio = childRadioData.filter(child => child.idtemp === element.idtemp);
  //             if (matchingChildRadio.length > 0) {
  //               return { ...element, options: matchingChildRadio };
  //             }
  //           }
  //           return element;
  //         });

  //         // Update state or perform other actions with updatedFormElements
  //          // Set the updated form elements
  //     setFormElementsget(updatedFormElements);

  //     setchild_radio(childRadioData);
  //       })
  //       .catch(error => {
  //         console.error("Error fetching data:", error);
  //       });
  //   } catch (error) {
  //     console.error("Error in useEffect:", error);
  //   }
  // }, [formElements,formElementsget]);



  useEffect(() => {

    saveFormElements();
  }, [formElements]);










  const idtemp = uuidv4(); // Generate the temporary ID
  const addFormElement = async (type) => {
    const newele = "new";
    const idtemp = uuidv4(); // Generate the temporary ID

    let newElement;

    switch (type) {
      case 'select':
        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
          options: [{ id: uuidv4(), value: '' }], // Initialize with one empty option
        };
        break;
      case 'radio':
        // Fetch the child radio options from the backend API
        try {

          const response = await axios.get(`/get-child-radio/${idtemp}`);
          const fetchedRadioOptions = response.data;
          newElement = {
            type,
            id: id2,
            idtemp,
            depart: depart2,
            newele,
            options: fetchedRadioOptions,
          };
        } catch (error) {
          console.error('Failed to fetch radio child options:', error);
          newElement = {
            type,
            id: id2,
            idtemp,
            depart: depart2,
            newele,
            options: [], // Initialize with an empty array if fetching fails
          };
        }
        break;
      case 'checkbox':
        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
          options: [{ id: uuidv4(), value: '', checked: false }], // Initialize with one empty option
        };
        break;
      default:
        newElement = {
          type,
          id: id2,
          idtemp,
          depart: depart2,
          newele,
        };
    }

    setFormElementsget((prevElements) => [...prevElements, newElement]);
    setFormElements((prevElements) => [...prevElements, newElement]);
  };



  // const addFormElement = (type) => {
  //   const newele = "new"

  //   const newElement = { type, id,idtemp, depart, newele, options: [] };
  //   setFormElementsget((prevElements) => [...prevElements, newElement]);
  //   setFormElements((prevElements) => [...prevElements, newElement]);
  // };

  const removeFormElement = (index, elementId) => {
    // Send a delete request to the API to delete the element with the specified id
    axios.delete(`http://sfc.sungroup.co.th:4400/delete-element/${elementId}`)
      .then((response) => {
        console.log('Form element deleted successfully!');
        // Remove the element from formElementsget state
        setFormElementsget((prevElements) => [
          ...prevElements.slice(0, index),
          ...prevElements.slice(index + 1),
        ]);
        toast.info('ลบเรียบร้อย !!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // Remove the element from formElements state
        setFormElements((prevElements) => [
          ...prevElements.slice(0, index),
          ...prevElements.slice(index + 1),
        ]);
      })
      .catch((error) => {
        console.error('Failed to delete form element:', error);
      });
  };

  const navigate = useNavigate(); // Initialize useNavigate hook
  const submitform = () => {
    navigate(`/SubmitForm/${id}/${depart}`);
  };

  const renderFormElement = (element, index) => {
    const handleTitleChange = async (event) => {
      const newTitle = event.target.value;
      // Update the formElements state with the new title
      // setFormElements((prevElements) => {
      //   const updatedElements = [...prevElements];
      //   updatedElements[index].title = newTitle;
      //   return updatedElements;
      // });
      // Update the formElementsget state with the new title
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

      // console.log("elementId",elementId)
    };




    switch (element.type) {
      case 'text':
        return (
          <div className="my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200" key={index}>
            <input
              type="text"
              placeholder="คำถาม"
              value={element.title || ''}
              onChange={handleTitleChange}
              className="p-2 w-full mb-3 border-b-2 border-transparent focus:border-gray-500"
            />

            <input
              type="text"
              placeholder="คำตอบสั้นๆ..."
              className="border-b border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
              disabled
            />
            <button
              className="mt-2 ml-2 px-2 py-1 text-sm text-white bg-red-500 rounded"
              onClick={() => removeFormElement(index, element.id)} // Pass the element id here
            >
              Remove
            </button>
          </div>
        );
      case 'textarea':
        return (
          <div className="my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200" key={index}>
            <input
              type="text"
              placeholder="คำถาม"
              value={element.title || ''}
              onChange={handleTitleChange}
              className="border-b border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
            />

            <textarea
              disabled
              placeholder="ข้อความคำตอบแบบยาว"
              className="border-b border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
            />
            <button
              className="mt-2 ml-2 px-2 py-1 text-sm text-white bg-red-500 rounded"
              onClick={() => removeFormElement(index, element.id)} // Pass the element id here
            >
              Remove
            </button>
          </div>
        );
      case 'select':

        return (
          <div className="my-4" key={index}>
            <input
              type="text"
              placeholder="คำถาม"
              value={element.title || ''}
              onChange={handleTitleChange}
              className="border p-2 rounded w-full"
            />

            <select className="border p-2 rounded w-full">
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
            <button
              className="mt-2 ml-2 px-2 py-1 text-sm text-white bg-red-500 rounded"
              onClick={() => removeFormElement(index, element.id)} // Pass the element id here
            >
              Remove
            </button>
          </div>
        );

      case 'radio':
        const handleAddRadioOption = async () => {
          // Add a new radio option to the radio element
          const newOption = {
            uuid: id,
            idtemp: formElementsget[index].idtemp,
            id_child_radio: idtemp,
            value: '', // Replace this with the default value for the radio option
          };

          try {
            const response = await axios.post('http://sfc.sungroup.co.th:4400/save-child-radio', newOption);
            console.log('Radio option saved successfully!', response.data);

            // Update the formElementsget state with the saved radio option
            setFormElementsget((prevElements) => {
              const updatedElements = [...prevElements];
              updatedElements[index].options.push(newOption);
              return updatedElements;
            });
          } catch (error) {
            console.error('Failed to save radio option:', error);
            // Handle error if needed
          }
        };


        const handleRemoveRadioOption = async (radioIndex) => {
          const optionToRemove = formElementsget[index].options[radioIndex];
          console.log("optionToRemove", optionToRemove)
          try {
            // Call API to delete the radio option
            await axios.delete(`http://sfc.sungroup.co.th:4400/delete-radio-option/${optionToRemove.id_child_radio}`);
            console.log('Radio option deleted successfully!');

            // Update the formElementsget state by removing the deleted option
            setFormElementsget((prevElements) => {
              const updatedElements = [...prevElements];
              updatedElements[index].options.splice(radioIndex, 1);
              return updatedElements;
            });
          } catch (error) {
            console.error('Failed to delete radio option:', error);
            // Handle error if needed
          }
        };

        const handleUpdateRadioOption = async (radioIndex, updatedValue) => {
          // Update the radio option value in the state
          setFormElementsget((prevElements) => {
            const updatedElements = [...prevElements];
            updatedElements[index].options[radioIndex].value = updatedValue;
            return updatedElements;
          });

          const optionToUpdate = formElementsget[index].options[radioIndex];

          try {
            // Call API to update the radio option value
            await axios.put(`http://sfc.sungroup.co.th:4400/update-radio-option/${optionToUpdate.id}`, { value: updatedValue });
            console.log('Radio option updated successfully!');
          } catch (error) {
            console.error('Failed to update radio option:', error);
            // Handle error if needed
          }
        };

        return (
          <div className="my-4" key={index}>
            <input
              type="text"
              placeholder="คำถาม"
              value={element.title || ''}
              onChange={handleTitleChange}
              className="border p-2 rounded w-full"
            />

            {formElementsget.length === 0 ? (
              // Render the "Add Radio" button when options are empty
              <button
                className="px-2 py-1 mt-2 text-white bg-blue-500 rounded"
                onClick={() => handleAddRadioOption(index)}
              >
                Add Radio
              </button>
            ) : (
              // Render radio options and input fields when options have data
              <>
                {element.options.map((option, radioIndex) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      name={`radio_${index}`}
                      disabled
                      value={option.value}
                      onChange={(event) => {
                        const updatedValue = event.target.value;
                        setFormElementsget((prevElements) => {
                          const updatedElements = [...prevElements];
                          updatedElements[index].options[radioIndex].value = updatedValue;
                          return updatedElements;
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(event) => handleUpdateRadioOption(radioIndex, event.target.value)}
                      className="border p-2 rounded w-full"
                    />

                    <button
                      className="ml-2 px-2 py-1 text-white bg-red-500 rounded"
                      onClick={() => handleRemoveRadioOption(radioIndex)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </>
            )}
            <button
              className="px-2 py-1 mt-2 text-white bg-blue-500 rounded"
              onClick={() => handleAddRadioOption(index)}             >
              Add Radio
            </button>
            {/* {element.options.length > 0 ? (
              <button
                className="px-2 py-1 mt-2 text-white bg-blue-500 rounded"
                onClick={() => handleAddRadioOption(index)}             >
                Add Radio
              </button>
            ) : (
              <div></div>
            )} */}
            <button
              className="mt-2 ml-2 px-2 py-1 text-white bg-red-500 rounded"
              onClick={() => removeFormElement(index, element.id)} // Pass the element id here
            >
              Remove
            </button>
          </div>
        );
      case 'checkbox':
        return (
          <div className="my-4" key={index}>
            <input
              type="text"
              placeholder="คำถาม"
              value={element.title || ''}
              onChange={handleTitleChange}
              className="border p-2 rounded w-full"
            />

            <label className="mr-2">
              <input type="checkbox" />
              Checkbox Option 1
            </label>
            <label>
              <input type="checkbox" />
              Checkbox Option 2
            </label>
            <button
              className="mt-2 ml-2 px-2 py-1 text-sm text-white bg-red-500 rounded"
              onClick={() => removeFormElement(index, element.id)} // Pass the element id here
            >
              Remove
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto  " style={{ backgroundColor: '#FFCCCC', maxWidth: '769px', maxHeight: 'auto' }}>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />


      <div className="flex justify-end">


        <button data-bs-toggle="modal"
          data-bs-target="#myModal" className="px-4 py-2  bg-amber-500 text-white font-semibold rounded hover:bg-amber-700 me-3">
          การตอบกลับ  <span style={{ fontSize: "15px" }} className="mx-1 badge text-bg-danger">{count.length}</span>
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
                    <button className="nav-link" id="tab2-tab" data-bs-toggle="tab" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">แยกรายการ</button>
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

          className="px-4 py-2  bg-gray-500 text-white font-semibold rounded hover:bg-gray-700"
        >
          Copy Link
        </button>


        {/* <button onClick={() => submitform()}
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700">
          Share Link
        </button> */}
      </div>

      <div className="my-4 bg-white rounded p-4 shadow-md border border-gray-300 relative">
        <div className="bg-red-500 h-4 rounded-t-md absolute top-0 left-0 right-0 flex items-center justify-center text-white font-bold">
          <span></span>
        </div>
        <h1 className="text-2xl font-bold mb-4 mt-2">{returnnameform(id)}</h1>
        <div className="border-t mb-4" />
        <p>Rest of the content...</p>
      </div>

      <div>
        {formElementsget.map((element, index) => (
          <div className="my-4" key={index}>
            {renderFormElement(element, index)}
          </div>
        ))}

        {/* {formElements && formElements.map((element, index) => (
  <div className="my-4" key={index}>
    {renderFormElement(element, index)}
  </div>
))} */}


      </div>
      <div className="my-4 grid grid-cols-2 gap-2">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded"
          onClick={() => addFormElement('text')}
        >
          Add Text Input
        </button>
        <button
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded"
          onClick={() => addFormElement('textarea')}
        >
          Add Textarea
        </button>
        {/* <button
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded"
          onClick={() => addFormElement('select')}
        >
          Add Select
        </button>
        <button
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded"
          onClick={() => addFormElement('radio')}
        >
          Add Radio Buttons
        </button>
        <button
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded"
          onClick={() => addFormElement('checkbox')}
        >
          Add Checkboxes
        </button> */}
        {/* <button
          className="ml-2 px-4 py-2 text-white bg-green-500 rounded"
          onClick={saveFormElements}
        >
          Save
        </button> */}
      </div>



    </div>




  );
};

export default CreateForm;


