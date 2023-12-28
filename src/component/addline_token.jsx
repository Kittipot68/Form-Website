import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { func } from 'prop-types';
const Addline_token = ({ uuid }) => {

  const [lineToken, setLineToken] = useState("");
  const [lineTokens, setLineTokens] = useState([]);
  const maxCharacterLimit = 43;
  const idtemp = uuidv4();
  const handleLineTokenChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxCharacterLimit) {
      setLineToken(inputText);
    }
  };

  useEffect(() => {
    const getlinetoken = async () => {
      try {
        const res = await axios.get(`http://sfc.sungroup.co.th:4400/get-linetoken/${uuid}`);
        setLineTokens(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getlinetoken();
  }, [uuid]);






  const handleAddLineToken = async () => {
    if (lineToken.trim() !== "") {
      try {
        // Make the POST request to your API
        const response = await axios.post(
          `http://sfc.sungroup.co.th:4400/insert-linetoken/${uuid}/${lineToken}/${idtemp}`
        );

        // Check if the request was successful
        if (response.status === 200) {
          // Add the lineToken to the state and reset the input
          setLineTokens([...lineTokens,{ line_token:lineToken,idtemp:idtemp,uuid:uuid}]);
          setLineToken("");
        } else {
          // Handle the case where the request was not successful
          console.error("API request failed with status:", response.status);
        }
      } catch (err) {
        // Handle any errors that occur during the request
        console.error("Error adding token:", err);
      }
    }
  };


  const handleDeleteLineToken = (idtemp, index) => {
    // Make an API request to delete the line token by ID
    axios.delete(`http://sfc.sungroup.co.th:4400/delete-linetoken/${idtemp}`)
      .then(response => {
        // Check if the request was successful (HTTP status code 200)
        if (response.status === 200) {
          // Remove the line token from the state
          const updatedTokens = [...lineTokens];
          updatedTokens.splice(index, 1);
          setLineTokens(updatedTokens);
        } else {
          console.error("API request failed with status:", response.status);
        }
      })
      .catch(error => {
        console.error("Error deleting token:", error);
      });
  };

  return (
    <div>
      <div className='table-responsive'>
    <table className="rounded table  table-striped table-bordered">
  <thead>
    <tr>
      <th>Line Notify Token</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {lineTokens.map((item, index) => (
      <tr key={index}>
        <td>{item.line_token}</td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteLineToken(item.idtemp, index)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
      <div className="mb-3 mt-3">
       
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            id="fl-text"
            placeholder="Line Notify Token"
            onChange={handleLineTokenChange}
            name="linetoken"
            maxLength={maxCharacterLimit}
            value={lineToken}
          />
          <div className="input-group-append">
            <span className="input-group-text" id="charCount">
              [{lineToken.length}/{maxCharacterLimit}]
            </span>
            <button
              type="submit"
              className="btn btn-outline-success"
              name="SaveBotSetting"
              onClick={handleAddLineToken}
            >
              <i className="fas fa-save"></i> &nbsp;บันทึกข้อมูล!
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Addline_token;
