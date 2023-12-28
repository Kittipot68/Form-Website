import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the XLSX library

const AnswerHeader = ({ count, id }) => {
    const [formElements, setFormElements] = useState([]);

    useEffect(() => {
        axios.get('http://sfc.sungroup.co.th:4400/get-answer-print/' + id)
            .then((response) => {
                const fetchedFormElements = response.data;
                setFormElements(fetchedFormElements);
            })
            .catch((error) => {
                console.error('Failed to fetch form elements:', error);
            });
    }, []);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    }

    const groupedData = {};
    formElements.forEach((element) => {
        const { time_stamp, countid, title, answer,type } = element;
        if (type !== 'des' && type !== 'photo') {
            if (!groupedData[countid]) {
            groupedData[countid] = [];
        }
        groupedData[countid].push({ time_stamp: formatTimestamp(time_stamp), title, answer });
    }
    });

    console.log("gropdata",groupedData)
    console.log("formElements",formElements)

    const formattedData = [];

    const titles = Array.from(new Set(Object.values(groupedData).flatMap(group => group.map(item => item.title))));

    // Header row with titles
    const headerRow = ['ประทับเวลา', ...titles];
    formattedData.push(headerRow);

    // Data rows
    Object.keys(groupedData).forEach((countid) => {
        const group = groupedData[countid];
        const rowData = [group[0].time_stamp];

        titles.forEach((title) => {
            const answer = group.find(item => item.title === title)?.answer || '';
            rowData.push(answer);
        });

        formattedData.push(rowData);
    });

    // console.log("titles",titles)
    // console.log(formattedData)
    // console.log("formElements",formElements)

    const handleExportToExcel = () => {
        // Your logic to gather data for export


        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'exported_data.xlsx');
    };

    return (
        <div className="modal-header my-1">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="modal-title fw-bold text-xl px-5" colSpan="2">{`คำตอบ ${count} ข้อ`}</th>
                        {/* <th>
                            <input required className='py-1 px-2 rounded-md border focus:ring focus:ring-green-300' type='date'></input>
                        </th>
                        <th>
                            <input required className='py-1 px-2 rounded-md border focus:ring focus:ring-green-300' type='date'></input>
                        </th> */}


                        <th className="text-right">
                            <button className="bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={handleExportToExcel}>
                                <i className="fa-sharp fa-solid fa-file-arrow-down"></i> Export to Excel
                            </button>
                        </th>

                        {/* onClick={handleExportToExcel} */}
                        <th>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
    );
};

export default AnswerHeader;
