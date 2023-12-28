import React from 'react';
import axios from 'axios'; // Import Axios if not already done
import 'react-toastify/dist/ReactToastify.css';


const CustomComponent = ({ index, element, setFormElements, setFormElementsget }) => {
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

  return (
    <div className="flex items-center flex-row-reverse">
      <div className="flex items-center ml-4">
        <label htmlFor={`toggleSwitch${index}`} className="mr-5">จำเป็น</label>
        <div className="form-check form-switch">
          <input
            type="checkbox"
            id={`toggleSwitch${index}`}
            className="form-check-input"
            style={{ fontSize: "20px" }}
          />
        </div>
      </div>

      <div className="border-l h-10 mx-2"></div>
      
      <div className="ml-2 mr-4" title="ลบ">
        <i
          className="fa-regular fa-trash-can fa-xl"
          style={{ color: '#828da1', cursor: 'pointer' }}
          onClick={() => removeFormElement(element.id)}
        ></i>
      </div>
    </div>
  );
};

export default CustomComponent;
