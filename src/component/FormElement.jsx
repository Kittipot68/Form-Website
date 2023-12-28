import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // You'll need to install axios

const FormElement = ({
  element,
  index,
  handleTitleChange,
  removeFormElement,
  handleToggleSwitch,
  handleOptionChange,
  addOption,
  removeOption,
  addOptionOthers,
  addselect,
  handleOptionselectChange,
  removeOptionselect,
  handleImageUpload,
  handleimagesize

}) => {
  const [openToggles, setOpenToggles] = useState({});
  const formElementRef = useRef(null);

  // const handleToggleMouseDown = (event) => {
  //   event.preventDefault();
  //   if (!formElementRef.current.contains(event.target)) {
  //     setOpenToggles((prevToggles) => ({
  //       ...prevToggles,
  //       [element.id]: false,
  //     }));
  //   }
  // };

  // const [haveother,sethaveother]= useState([])
  // useEffect(() => {
  //   if (element.options) {

  //     const hasOtherOption = element.options.find(option => option.value === 'other');
  //     // Now you can use the hasOtherOption variable for each element
  //     console.log(`Element at index ${index} has other option: ${hasOtherOption}`);
  //     sethaveother(hasOtherOption,{index: index})
  //   }
  // }, []);
  // console.log(`Element at index`,haveother);

console.log("vvvelement",element)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        formElementRef.current &&
        !formElementRef.current.contains(event.target)
      ) {
        setOpenToggles((prevToggles) => ({
          ...prevToggles,
          [element.id]: false,
        }));
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [element.id]);

  const [uploadedImages, setUploadedImages] = useState(
    Array(element.length).fill(null)
  );

  switch (element.type) {
    case "text":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          
          className={`relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200 ${openToggles[element.id] ? "border-r-4 border-gray-200" : ""
            }`}
          key={index}
        >
          <input
            type="text"
            placeholder="คำถาม"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"

          // className="border-b focus:border-blue-500 transition-colors duration-300 bg-gray-100 outline-none placeholder-gray-400"
          />

          <input
            type="text"
            placeholder="คำตอบสั้นๆ..."
            className="border-b border-dotted border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
            disabled
            style={{ width: "500px" }}
          />

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              {/* <div className="my-4 bg-white rounded p-4 shadow-md relative">
        <div style={{ backgroundColor: "#ea5656" }} className=" h-4 rounded-t-md absolute top-0 left-0 right-0 flex items-center justify-center text-white font-bold">
          <span></span>
        </div> */}

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse ">
                <div className="flex items-center ml-4">
                  <label htmlFor={`toggleSwitch${index}`} className="mr-5">
                    จำเป็น
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id={`toggleSwitch${index}`}
                      className=" cursor-pointer form-check-input"
                      style={{ fontSize: "20px" }}
                      checked={element.required === 1}
                      onChange={() =>
                        handleToggleSwitch(index, element.required)
                      }
                    />
                  </div>
                </div>

                <div className="border-l h-10 mx-2 "></div>
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"text")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "textarea":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="คำถาม"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <textarea
            disabled
            placeholder="ข้อความคำตอบแบบยาว"
            className="border-b border-dotted border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
          />

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse">
                <div className="flex items-center ml-4">
                  <label htmlFor={`toggleSwitch${index}`} className="mr-5">
                    จำเป็น
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id={`toggleSwitch${index}`}
                      className="cursor-pointer form-check-input"
                      style={{ fontSize: "20px" }}
                      checked={element.required === 1}
                      onChange={() =>
                        handleToggleSwitch(index, element.required)
                      }
                    />
                  </div>
                </div>

                <div className="border-l h-10 mx-2 "></div>
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"textarea")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "date":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="คำถาม"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <input
            type="date"
            placeholder="วันที่"
            value={element.date || ""}
            style={{ width: "200px" }}
            className=" pointer-events-none border-b border-dotted border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
          />

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse ">
                <div className="flex items-center ml-4">
                  <label htmlFor={`toggleSwitch${index}`} className="mr-5">
                    จำเป็น
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id={`toggleSwitch${index}`}
                      className="cursor-pointer form-check-input"
                      style={{ fontSize: "20px" }}
                      checked={element.required === 1}
                      onChange={() =>
                        handleToggleSwitch(index, element.required)
                      }
                    />
                  </div>
                </div>

                <div className="border-l h-10 mx-2 "></div>
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"date")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "time":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="คำถาม"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <input
            type="time"
            placeholder="วันที่"
            value={element.date || ""}
            style={{ width: "200px" }}
            className=" pointer-events-none border-b border-dotted border-gray-500 focus:outline-none p-2 w-full mb-3 bg-white"
          />

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse ">
                <div className=" flex items-center ml-4">
                  <label htmlFor={`toggleSwitch${index}`} className="mr-5">
                    จำเป็น
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id={`toggleSwitch${index}`}
                      className="cursor-pointerr form-check-input "
                      style={{ fontSize: "20px" }}
                      checked={element.required === 1}
                      onChange={() =>
                        handleToggleSwitch(index, element.required)
                      }
                    />
                  </div>
                </div>

                <div className="border-l h-10 mx-2 "></div>
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"time")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "radio":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="คำถาม"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <div key={element.id}>
            {element.options &&
              element.options.map((option, optionIndex) => (
                <div>
                  {/* Conditionally render the "Other" input when option value is "other" */}
                  {element.add_other === 1 && option.type == "other" ? (
                    <div key={optionIndex} className="flex mb-2">
                      <input type="radio" disabled className="mr-2" />
                      <span className="mt-3 mr-2">อื่นๆ</span>

                      <input
                        placeholder="(*นำออกเพื่อเพิ่มตัวเลือก)"
                        type="text"
                        readOnly
                        className="mt-2 border-b border-dotted	 border-gray-300 focus:outline-none p-2 w-full mb-3 bg-white"
                      />
                      <i
                        title="นำออก"
                        className=" fa-solid fa-x mt-4"
                        style={{
                          color: "#6e7681",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                        onClick={() => removeOption(index, optionIndex)}
                      ></i>
                    </div>
                  ) : (
                    <div key={optionIndex} className="flex mb-2">
                      <input type="radio" disabled className="mr-2" />
                      <input
                        type="text"
                        value={option.value || ""}
                        onChange={(event) => {
                          const newValue = event.target.value;
                          handleOptionChange(index, optionIndex, newValue);
                        }}
                        placeholder={`ตัวเลือก ${optionIndex + 1}`}
                        className="hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
                      />
                      {element.options.length > 1 && (
                        <i
                          title="นำออก"
                          className="fa-solid fa-x mt-4"
                          style={{
                            color: "#6e7681",
                            cursor: "pointer",
                            marginLeft: "10px",
                          }}
                          onClick={() => removeOption(index, optionIndex)}
                        ></i>
                      )}
                    </div>
                  )}
                </div>
              ))}

            <div className="flex">
              {element.add_other === 1 ? (
                <span className="mt-2"></span>
              ) : (
                <>
                  <input type="radio" disabled className="mr-2 mt-2" />
                  <input
                    readOnly
                    type="text"
                    placeholder={`เพิ่มตัวเลือก`}
                    className="mt-2 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
                    style={{ width: "105px" }}
                    onClick={() => {
                      addOption(index);
                    }}
                  />
                </>
              )}

              {element.add_other === 1 ? (
                <span className="mt-3"></span>
              ) : (
                <span className="mt-3">หรือ</span>
              )}

              {element.add_other === 1 ? (
                <span className="ml-2 cursor-pointer mt-3 text-blue-500"></span>
              ) : (
                <span
                  onClick={() => {
                    addOptionOthers(index);
                  }}
                  className="ml-2 cursor-pointer mt-3 text-blue-500"
                >
                  เพิ่ม "อื่นๆ"
                </span>
              )}
            </div>
          </div>

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse ">
                <div className=" flex items-center ml-4">
                  <label htmlFor={`toggleSwitch${index}`} className="mr-5">
                    จำเป็น
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id={`toggleSwitch${index}`}
                      className="cursor-pointerr form-check-input "
                      style={{ fontSize: "20px" }}
                      checked={element.required === 1}
                      onChange={() =>
                        handleToggleSwitch(index, element.required)
                      }
                    />
                  </div>
                </div>

                <div className="border-l h-10 mx-2 "></div>
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"radio")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "des":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="ไม่มีชื่อ"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse ">
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"des")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case "photo":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="ชื่อภาพ"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <label className="mr-5 mb-3 rounded cursor-pointer text-gray-600 hover:text-gray-800 hover:bg-gray-200" style={{ padding: '10px', display: 'inline-block' }}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageUpload(event, element.idtemp, index)}
            />
            <i className="far fa-image"></i> Upload Image
          </label>





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

          <div className="d-flex justify-content-end">
            {element.pic_name && ( // Check if pic_name exists
              <select className="mt-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2  bg-white"
                value={element.image_size || ""} onChange={(event) => handleimagesize(event, element.idtemp, index)}>
                <option value={"300"}>Small</option>
                <option value={"400"}>Medium</option>
                <option value={"500"}>Large</option>
              </select>
            )}
          </div>



          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse ">
                <div className="ml-2 mr-4" title={element.uuid}>
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"photo")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case "select":
      return (
        <div
          onClick={() =>
            setOpenToggles((prevToggles) => ({
              ...prevToggles,
              [element.id]: true,
            }))
          }
          ref={formElementRef}
          className="relative my-3 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
          key={index}
        >
          <input
            type="text"
            placeholder="คำถาม"
            value={element.title || ""}
            onChange={(event) => handleTitleChange(event, index)} // Pass event and index
            className="mb-3 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
          />

          <div key={element.id}>
            {element.optionselect &&
              element.optionselect.map((option, optionIndex) => (
                <div key={optionIndex} className="flex mb-2">
                  <label className="p-2">{optionIndex + 1}</label>
                  <input
                    type="text"
                    value={option.value || ""}
                    onChange={(event) => {
                      const newValue = event.target.value;
                      handleOptionselectChange(index, optionIndex, newValue);
                    }}
                    placeholder={`ตัวเลือก ${optionIndex + 1}`}
                    className="hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
                  />
                  {element.optionselect.length > 1 && (
                    <i
                      title="นำออก"
                      className="fa-solid fa-x mt-4"
                      style={{
                        color: "#6e7681",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={() => removeOptionselect(index, optionIndex)}
                    ></i>
                  )}
                </div>
              ))}
          </div>
          <label className="p-2"></label>
          <input
            readOnly
            type="text"
            placeholder={`เพิ่มตัวเลือก`}
            className="mt-2 hover:border-b outline-none border-b-1 focus:border-b-4 focus:border-indigo-500 transition-colors duration-300 p-2 w-full  bg-white"
            style={{ width: "105px" }}
            onClick={() => {
              addselect(index);
            }}
          />

          <div className="p-2 mb-3">
            {element.required === 1 ? (
              <div className="flex justify-end items-center">
                <span className="text-red-500 font-bold mr-1">required</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {openToggles[element.id] && (
            <div>
              <div className=" flex rounded-l-md  absolute top-0 left-0 right-0  bottom-0 w-2 bg-blue-500"></div>

              <hr className="mt-3 mb-3 w-full border-t" />

              <div className="flex items-center flex-row-reverse">
                <div className="flex items-center ml-4">
                  <label htmlFor={`toggleSwitch${index}`} className="mr-5">
                    จำเป็น
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id={`toggleSwitch${index}`}
                      className="cursor-pointer form-check-input"
                      style={{ fontSize: "20px" }}
                      checked={element.required === 1}
                      onChange={() =>
                        handleToggleSwitch(index, element.required)
                      }
                    />
                  </div>
                </div>

                <div className="border-l h-10 mx-2 "></div>
                <div className="ml-2 mr-4" title="ลบ">
                  <i
                    className="fa-regular fa-trash-can fa-xl"
                    style={{ color: "#828da1", cursor: "pointer" }}
                    onClick={() => removeFormElement(index, element.id,element.idtemp,element.uuid,"select")}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};
export default FormElement;
