import React, { useState, useEffect, createRef, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function SubmitForm() {
  const [formElements, setFormElements] = useState([]);
  const [formElementsget, setFormElementsget] = useState([]);


  // const link = `http://sfc.sungroup.co.th:8083/sungroupform/#/SubmitForm/${id}/${depart}`;
  // http://localhost:5173/#/SubmitForm/8cce37ed-6fb5-47a7-b2ec-3785ec92f24b/ict

  const id = window.location.hash.split("/")[2];

  const depart = window.location.hash.split("/")[3];
  
  const [formData, setFormData] = useState({});
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false); // State variable for submit success
  const errorDivRefs = useRef([]);
  const [time, setTime] = useState('');
  const [errorMessages, seterrorMessages] = useState([])
  const [currentErrorIndex, setCurrentErrorIndex] = useState(-1);
  const [haserror, setHasError] = useState(false);
  const errorElementRef = useRef(null); // Create a ref
  const [shouldScrollToError, setShouldScrollToError] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherOptionValue, setOtherOptionValue] = useState('');
  const [selectedOptionselect, setselectedOptionselect] = useState('');
  const [tokens,setLineTokens] = useState([])
  const handleSelectChange = (event) => {
    setselectedOptionselect(event.target.value);
  };
  const navigate = useNavigate()

  const generateTempId = () => {
    return uuidv4();
  }; const [countid, setcountid] = useState(generateTempId());

  useEffect(() => {
    const getlinetoken = async () => {
      try {
        const res = await axios.get(`http://sfc.sungroup.co.th:4400/get-linetoken/${id}`);
        setLineTokens(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getlinetoken();
  }, [id]);

  console.log("token",tokens)


  const LINE_NOTIFY_ACCESS_TOKEN = 'SBLcSxej34TWfLupwcSNYVZVGjtzR8ju37wd4ptkQyJ';

  const sendLineNotifyToAllTokens = async (data, tokens) => {
    try {
      // Iterate through the array of objects
        const title = "Title";
      
        // Initialize the message content with the title
        let message = `\n\n`;
        
        // Iterate through the array of objects
        formElements.filter(formElement =>  formElement.type !== 'photo')
        .forEach((formElement, index) => {
          const answerObj = data.find(row => row.idtemp === formElement.idtemp);
      
          if (answerObj && answerObj.answer) {
            const answer = answerObj.answer;
            message += `${formElement.title} : \t${answer}\n`;
          }else if (formElement.type==='des'){
            message += `\n\n${formElement.title} \n\n`;

          } else {
            message += `${formElement.title} :\n`;
          }
        });
      

        console.log("message",message)
        // Iterate through the array of tokens
        for (const token of tokens) {
          try {
            const response = await axios.post(
              'http://sfc.sungroup.co.th:4400/sendLineNotify', // Replace with your server's endpoint
              {
                message,
                line_token: token.line_token,
              },
              {
                headers: {
                  'Content-Type': 'application/json', // Set the content type to JSON
                },
              }
            );
  
            // Check the response status for each token
            if (response.status === 200) {
              console.log(`Line Notify message sent successfully to token: ${token.line_token}`);
            } else {
              console.error(`Failed to send Line Notify message to token: ${token.line_token}`);
            }
          } catch (error) {
            console.error(`Error sending Line Notify message to token: ${token.line_token}`, error);
          }
        }
      
    } catch (error) {
      console.error('Error sending Line Notify messages:', error);
    }
  };
  
  // Call the function to send messages to all tokens
  
  


  useEffect(() => {
    // Fetch all form elements from the API endpoint on component mount
    axios.get('http://sfc.sungroup.co.th:4400/get-all-form-elements/' + id + "/" + depart)
      .then((response) => {
        const fetchedFormElements = response.data.formElements;
        setFormElements(fetchedFormElements);
      })
      .catch((error) => {
        console.error('Failed to fetch form elements:');
      });

  }, []);


  useEffect(() => {
    // Scroll if there's a new error and shouldScrollToError is true
    if (shouldScrollToError) {
      const elementRect = errorElementRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollTop = elementRect.top + window.scrollY - viewportHeight / 2;

      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      // Reset scrolling status after scrolling
      setShouldScrollToError(false);
    }
  }, [shouldScrollToError]);


  // Call the function with your formData


  const handleSubmit = async () => {

    const formRows = Object.values(formData);
    console.log("formrow", formRows)

    let hasError = false;
    const requiredFields = formElements
      .filter((element) => element.required === 1)
      .sort((a, b) => b.id - a.id);
    let currentErrorIdx = -1; // Track the current error index



    if (haserror) {
      setShouldScrollToError(true);

      return

    } else {
      requiredFields.forEach((element, index) => {
        const fieldKey = `answer_${element.idtemp}`;
        const field = formRows.find((row) => row.idtemp === element.idtemp);
        // console.log("field",field)
        // console.log("currentErrorIdx",currentErrorIdx)
        // console.log("index",index)


        if (!field || !field.answer || field.answer.trim() === "") {
          setHasError(true)
          hasError = true;
          setCurrentErrorIndex(element.idtemp);


          seterrorMessages((prevErrorMessages) => ({
            ...prevErrorMessages,
            [fieldKey]: "จำเป็นต้องกรอกคำถามนี้", // Set the error message for the field
          }));
        }
      });

      if (hasError) {
        setShouldScrollToError(true);

        // setCurrentErrorIndex(currentErrorIdx);

        return;
      } else {

        setCurrentErrorIndex(""); // Reset the current error index

        seterrorMessages({}); // Clear all previous error messages
        if (formRows.length === 0) {
          sendLineNotifyToAllTokens(formRows,tokens);

          setIsSubmitSuccess(true);

          formElements.forEach((element) => {

            if (element.type === "des") {

            } else {
              axios.post('http://sfc.sungroup.co.th:4400/submit-form-data', { uuid: element.uuid, idtemp: element.idtemp, answer: "", countid: countid })
                .then((response) => {
                  console.log('Form data submitted successfully!');
                  navigate(`/Response/${id}/${depart}`);

                  // You can show a success message or perform other actions upon successful submission
                })
                .catch((error) => {
                  console.error('Failed to submit form data:', error);
                  // You can show an error message or perform other error handling
                });
            }
          });
        } else {
          sendLineNotifyToAllTokens(formRows,tokens);

          formElements.forEach((element) => {
            setIsSubmitSuccess(true);
            let tempanswer = "";

            // Find the corresponding form row in formData based on idtemp
            const formRow = formRows.find((row) => row.idtemp === element.idtemp);

            if (formRow) {
              tempanswer = formRow.answer || "";
            }

            const rowData = {
              uuid: element.uuid,
              idtemp: element.idtemp,
              answer: tempanswer, // Use the formData for each row
              countid: countid,
            };

            if (element.type === "des") {

            } else {
              axios.post('http://sfc.sungroup.co.th:4400/submit-form-data', rowData)
                .then((response) => {
                  console.log('Form data submitted successfully!');
                  navigate(`/Response/${id}/${depart}`);
                  // You can show a success message or perform other actions upon successful submission
                })
                .catch((error) => {
                  console.error('Failed to submit form data:', error);
                  // You can show an error message or perform other error handling
                });
            }
          });
        }
      }
    }
  };

 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRadio = await axios.get(`http://sfc.sungroup.co.th:4400/get-child-radio/${id}`);
        const responseSelect = await axios.get(`http://sfc.sungroup.co.th:4400/get-child-select/${id}`);

        const childRadioOptions = responseRadio.data;
        const childSelectOptions = responseSelect.data;

        const updatedFormElements = formElements.map(element => {
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
  }, [formElements, id]);




  const handleOptionValueChange = (elementId, optionIndex, newValue) => {

    console.log("elementId", elementId)
    console.log("optionIndex", optionIndex)
    console.log("newValue", newValue)

    if (formData.hasOwnProperty(`row${elementId}`)) {
      formData[`row${elementId}`].answer = newValue;
    } else {
    }

    setFormElementsget((prevFormElements) => {
      const updatedFormElements = prevFormElements.map((element) => {
        if (element.idtemp === elementId) {
          const updatedOptions = element.options.map((option, index) => {
            if (index === optionIndex) {
              return {
                ...option,
                value: newValue,
              };
            }
            return option;
          });

          return {
            ...element,
            options: updatedOptions,
          };
        }
        return element;
      });

      return updatedFormElements;
    });



  };




  const renderFormElement = (element, index, idtemp) => {
    const errorDivRef = errorDivRefs.current[index] || (errorDivRefs.current[index] = createRef());
    const showErrorStyle = currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`]




    function convertDateFormat(inputDate) {
      const [year, month, day] = inputDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }



    const calculateMaxOptionWidth = (options) => {
      const maxWidth = options.reduce((maxWidth, option) => {
        const optionWidth = option.value.length;
        return optionWidth > maxWidth ? optionWidth : maxWidth;
      }, 0);
      return maxWidth;
    };

    const handleanswerchange = (event, elementId, optionIndex) => {

      const fieldKey = `answer_${idtemp}`;
      seterrorMessages((prevErrorMessages) => ({
        ...prevErrorMessages,
        [fieldKey]: "", // Clear the error message
      }));

      const { name, value, type, checked } = event.target;

      console.log("name", name)
      console.log("value", value)
      console.log("type", type)
      console.log("",)

    
      const [fieldName, index] = name.split('_');
      const rowIndex = parseInt(index, 10);

      if (type === 'checkbox') {
        // For checkboxes, update the formData with an array of selected options


        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: [...(prevFormData[name] || []), ...(checked ? [value] : [])],
        }));
      } else if (type === 'radio') {

        // For radio buttons, update the formData with the selected option
        const updatedFormElements = formElementsget.map((element) => {
          if (element.idtemp === elementId) {
            setHasError(false)

            return {
              ...element,
              options: element.options.map((option, index) => {
                if (index === optionIndex) {
                  return {
                    ...option,
                    checked: option.checked === 1 ? 0 : 1, // Toggle the checked state
                  };
                }
                setFormData((prevFormData) => {
                  const rowKey = `row${elementId}`;
                  const newRowData = { ...prevFormData[rowKey], answer: "", idtemp: idtemp, uuid: id, countid: countid };
                  return { ...prevFormData, [rowKey]: newRowData };
                });

                return {
                  ...option,
                  checked: 0, // Uncheck other options in the same radio group

                };
              }),
            };
          }
          return element;
        });



        setFormElementsget(updatedFormElements);
        // Get the selected option value

        if (fieldName === 'answerother') {
          setHasError(false)
          const selectedOptionValue = updatedFormElements.find(
            (element) => element.idtemp === elementId
          ).options[optionIndex].checked === 1
            ? updatedFormElements.find((element) => element.idtemp === elementId).options[optionIndex].value
            : value;

          setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [elementId]: selectedOptionValue,
          }));


          setFormData((prevFormData) => {
            const rowKey = `row${elementId}`;
            const newRowData = { ...prevFormData[rowKey], answer: selectedOptionValue, idtemp: idtemp, uuid: id, countid: countid };
            return { ...prevFormData, [rowKey]: newRowData };
          });


        } else {

          const selectedOptionValue = updatedFormElements.find(
            (element) => element.idtemp === elementId
          ).options[optionIndex].checked === 1
            ? updatedFormElements.find((element) => element.idtemp === elementId).options[optionIndex].value
            : '';
          setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [elementId]: selectedOptionValue,
          }));

          setFormData((prevFormData) => {
            const rowKey = `row${elementId}`;
            const newRowData = { ...prevFormData[rowKey], answer: selectedOptionValue, idtemp: idtemp, uuid: id, countid: countid };
            return { ...prevFormData, [rowKey]: newRowData };
          });
        }

      } else if (fieldName === "answertime") {

        let data = value.replace(/[^\d]/g, ''); // Remove non-numeric characters
        let hours = data.substring(0, 2);
        let minutes = data.substring(2);
        if (data.length >= 3) {
          data = hours + ':' + minutes;
        }

        if (data.length < 5 && data.length != 0) {

          seterrorMessages((preverrorMessages) => ({
            ...preverrorMessages,
            [`answer_${idtemp}`]: "เวลาไม่ถูกต้อง", // Store error message for each input
          }));

          setCurrentErrorIndex(idtemp); // Set currentErrorIndex for the invalid field
          setHasError(true);

        } else if (data.substring(0, 2) >= 24) {
          seterrorMessages((preverrorMessages) => ({
            ...preverrorMessages,
            [`answer_${idtemp}`]: "เวลาไม่ถูกต้อง", // Store error message for each input
          }));

          setCurrentErrorIndex(idtemp); // Set currentErrorIndex for the invalid field
          setHasError(true);

        } else if (parseInt(minutes) > 59) {
          seterrorMessages((preverrorMessages) => ({
            ...preverrorMessages,
            [`answer_${idtemp}`]: "เวลาไม่ถูกต้อง", // Store error message for each input
          }));

          setCurrentErrorIndex(idtemp); // Set currentErrorIndex for the invalid field
          setHasError(true);

        }
        else {
          seterrorMessages((preverrorMessages) => ({
            ...preverrorMessages,
            [`answer_${idtemp}`]: "", // Store error message for each input
          }));
          setCurrentErrorIndex(""); // Set currentErrorIndex for the invalid field
          setHasError(false);

        }
        setTime(data.substring(0, 5)); // Limit to HH:MM format

        setFormData((prevFormData) => {
          const rowKey = `row${rowIndex + 1}`;
          const newFormData = {
            ...prevFormData,
            [rowKey]: {
              ...prevFormData[rowKey],
              answer: data.substring(0, 5),
              idtemp: idtemp,
              uuid: id,
              countid: countid,
            },
          };
          return newFormData;

          // const newRowData = { ...prevFormData[rowKey], answer: data.substring(0, 5), idtemp: idtemp, uuid: id, countid: countid };
          // return { ...prevFormData, [rowKey]: newRowData };
        });
      } else if (fieldName === "answerdate") {
        let convertedDate = convertDateFormat(value);

        setHasError(false);


        setFormData((prevFormData) => {
          const rowKey = `row${rowIndex + 1}`;
          const newRowData = { ...prevFormData[rowKey], answer: convertedDate, idtemp: idtemp, uuid: id, countid: countid };
          return { ...prevFormData, [rowKey]: newRowData };
        });
      }
      else {
        setHasError(false);


        setFormData((prevFormData) => {
          const rowKey = `row${rowIndex + 1}`;
          const newRowData = { ...prevFormData[rowKey], answer: value, idtemp: idtemp, uuid: id, countid: countid };
          return { ...prevFormData, [rowKey]: newRowData };
        });
      }
      // Rest of the function...
    };







    const star = "*";


    switch (element.type) {
      case 'text':
        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
              {/* When element.required is 1, the * will be red */}
              {element.required === 1 ? (
                <span>
                  {element.title}{" "}
                  <span style={{ color: "red" }}>{star}</span>
                </span>
              ) : (
                element.title || ""
              )}
            </div>


            <input
              name={`answer_${index}`}
              onChange={handleanswerchange}
              type="text"
              placeholder="คำตอบของคุณ"
              className="mb-3 hover:border-b outline-none border-b focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
            />

            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
              {/* When element.required is 1, the * will be red */}
              {element.required === 1 ? (
                <span>
                  {element.title}{" "}
                  <span style={{ color: "red" }}>{star}</span>
                </span>
              ) : (
                element.title || ""
              )}
            </div>

            <textarea
              name={`answer_${index}`} // Add the name attribute
              onChange={handleanswerchange}
              placeholder="คำตอบของคุณ"
              className="mb-3 hover:border-b outline-none border-b focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
            />

            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}

          </div>
        );

      case 'date':
        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
              {/* When element.required is 1, the * will be red */}
              {element.required === 1 ? (
                <span>
                  {element.title}{" "}
                  <span style={{ color: "red", fontSize: "16px" }}>{star}</span>
                </span>
              ) : (
                element.title || ""
              )}
            </div>

            <input
              type="date"
              placeholder="วันที่"
              onChange={handleanswerchange}
              name={`answerdate_${index}`} // Add the name attribute
              style={{ maxWidth: "200px" }}
              className="mb-3 hover:border-b outline-none border-b focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
            />
            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}

          </div>
        );
      case 'time':
        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>


            <div className='p-2 mb-3 '>
              {/* When element.required is 1, the * will be red */}
              {element.required === 1 ? (
                <span>
                  {element.title}{" "}
                  <span style={{ color: "red" }}>{star}</span>
                </span>
              ) : (
                element.title || ""
              )}
            </div>
            <input
              type="text"
              placeholder="ชั่วโมง : นาที "
              maxLength="5"
              size="5"
              onChange={handleanswerchange}
              value={formData[`row${index + 1}`]?.answer || ""}
              name={`answertime_${index}`}
              style={{ maxWidth: "105px" }}
              className="mb-3 hover:border-b outline-none border-b focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"

            />

            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}
          </div>

        );

      case 'des':
        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
              {element.title || ""}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}

            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
              {/* When element.required is 1, the * will be red */}
              {element.required === 1 ? (
                <span>
                  {element.title}{" "}
                  <span style={{ color: "red" }}>{star}</span>
                </span>
              ) : (
                element.title || ""
              )}
            </div>


            {element.options && element.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                {/* ... other code ... */}
                {element.add_other === 1 && option.type == 'other' ? (
                  <div key={optionIndex} className="flex mb-2">
                    <input
                      type="radio"
                      id={`radio-${option.idtemp}`}
                      className="cursor-pointer mr-5 w-6 h-6 text-indigo-500 focus:ring-indigo-500 border-gray-300 hover:bg-indigo-200 focus:bg-indigo-300"
                      checked={option.checked === 1} // Use the checked property from the option
                      onClick={(e) => handleanswerchange(e, element.idtemp, optionIndex)}
                      name={`answerother_${option.idtemp}`} // Add the name attribute

                    />

                    <div className="flex items-center">
                      <label htmlFor={`radio-other-${option.idtemp}`}>
                        อื่นๆ:
                      </label>

                      <input
                        type="text"
                        className="ml-2 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 w-full bg-white"
                        value={option.value || ""
                        } onChange={(e) => {
                          const newValue = e.target.value;
                          handleOptionValueChange(element.idtemp, optionIndex, newValue);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div key={optionIndex} className="flex mb-2">
                    <input
                      type="radio"
                      id={`radio-${option.idtemp}`}
                      className="cursor-pointer mr-5 w-6 h-6 text-indigo-500 focus:ring-indigo-500 border-gray-300 hover:bg-indigo-200 focus:bg-indigo-300"
                      checked={option.checked === 1} // Use the checked property from the option
                      onClick={(e) => handleanswerchange(e, element.idtemp, optionIndex)}
                    />
                    <label htmlFor={`radio-${option.idtemp}`} className="">
                      {option.value || ""}
                    </label>
                  </div>
                )}
              </div>
            ))}

            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}
          </div>
        );

      case 'select':

        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
              {/* When element.required is 1, the * will be red */}
              {element.required === 1 ? (
                <span>
                  {element.title}{" "}
                  <span style={{ color: "red" }}>{star}</span>
                </span>
              ) : (
                element.title || ""
              )}
            </div>

            <select
              name={`answer_${index}`}
              onChange={handleanswerchange}
              className={`border shadow-sm border-spacing-5 rounded p-2 text-base `}>
              <option value="" className="bg-gray-200 py-2 pl-1 pr-2 rounded-t">เลือก</option>
              
              <option disabled className="border-t border-gray-300 pt-1">──────────────</option>

              {element.optionselect && element.optionselect.map((option, optionIndex) => (

                <option
                  key={optionIndex}
                  value={option.value}
                  className="hover:bg-blue-200 py-2 pl-1 pr-2"
                >
                  {option.value}
                </option>
              ))}
            </select>

            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}
          </div>
        );

        case 'photo':

        return (
          <div
            ref={(ref) => {
              errorDivRef.current = ref; // Assign the ref to the error div
              if (showErrorStyle && currentErrorIndex === element.idtemp) {
                errorElementRef.current = ref; // Assign the ref to the error element
              }
            }}
            className={`my-3 bg-white rounded-lg p-4 shadow-sm border-2 ${showErrorStyle ? 'border-red-500' : 'border-gray-200'
              }`}
            key={idtemp}>
            <div className='p-2 mb-3 '>
                {element.title || ""}
            </div>

            <div className=" d-flex justify-content-center">


{element.pic_name && ( // Check if pic_name exists
  <div>


    <img
      src={`http://sfc.sungroup.co.th:4400/getpicture/${element.pic_name}`} // Replace with your server URL and path
      alt="Uploaded"
      style={{ maxWidth: `${element.image_size}px`, maxHeight: `${element.image_size}px` }} // Adjust styling as needed
    />
  </div>


)}
</div>



            {currentErrorIndex === element.idtemp && errorMessages[`answer_${idtemp}`] && (
              <div className="flex items-center">
                <i className="fa-solid fa-circle-exclamation text-red-500 mr-2" style={{ color: "#ff0000" }}></i>
                <p className="text-red-500 text-sm mt-1">{errorMessages[`answer_${idtemp}`]}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

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


  useEffect(() => {

    document.title = `${formName}`;
  }, [formName]); // Empty dependency array ensures the effect runs once after component mounts


  console.log("formele,ent", formElements)

  return (

    <div className=" mx-auto mt-5 mb-5 p-4 " style={{ backgroundColor: '#efd8f4', maxWidth: '769px', maxHeight: 'auto' }}>
      <div className="my-4 bg-white rounded p-4 shadow-md relative">
        <div style={{ backgroundColor: "#ea5656" }} className=" h-4 rounded-t-md absolute top-0 left-0 right-0 flex items-center justify-center text-white font-bold">
          <span></span>
        </div>
        <h1 className="text-2xl font-bold mb-4 mt-2">{formName}</h1>
        <hr className="mb-4 w-full border-t" />
        {/* <p className=''>Rest of the content...</p> */}
      </div>

      <div>
        {formElementsget.map((element, index) => (
          <div key={index}>{renderFormElement(element, index, element.idtemp)}</div>
        ))}
      </div>
      <div className='d-flex justify-content-end'>
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="px-4 py-2  bg-red-500 text-white font-semibold rounded hover:bg-red-700"
        >ส่ง
        </button>
      </div>

    </div>
  );
}
