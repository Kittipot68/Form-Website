import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Answer1 = ({ id }) => {
    const [formElements, setFormElements] = useState([]);

    useEffect(() => {
        axios.get('http://sfc.sungroup.co.th:4400/get-answer/' + id)
            .then((response) => {
                const fetchedFormElements = response.data;
                setFormElements(fetchedFormElements);


            })
            .catch((error) => {
                console.error('Failed to fetch form elements:', error);
            });
    }, [formElements]);

 



    // Group form elements by title
    // function returntitle(countId){
    //     for(let i = 0 ; i < formElements.length;i++){
    //         if(formElements[i].idtemp === countId){
    //             return formElements[i].title
    //         }
    //     }
    // }

    // console.log("formElements",formElements)

    // console.log("returntitle1",returntitle("63665d77-3ac9-4749-9f2d-c8f8f8ff2f14"))
    // console.log("returntitle2",returntitle("3d278a10-2ad4-4e1e-b7fe-28135a015a32"))
    // console.log("returntitle3",returntitle("d355288e-327c-4635-bb6a-6f3423458c02"))

    // const groupedFormElements = formElements.reduce((acc, element) => {
    //     if (!acc[element.idtemp]) {
    //         acc[element.idtemp] = {
    //             title: element.title,
    //             answers: [],
    //         };
    //     }
    
    //     acc[element.idtemp].answers.push(element.answer);
    //     return acc;
    // }, {});

    const groupedFormElements = formElements.reduce((acc, element) => {
        if (element.type !== "photo" && element.type !== "des") {
          if (!acc[element.idtemp]) {
            acc[element.idtemp] = {
              title: element.title,
              answers: [],
            };
          }
      
          acc[element.idtemp].answers.push(element.answer);
        }
        return acc;
      }, {});
      
    

    return (
        <div className="tab-pane fade show active" id={id} role="tabpanel" aria-labelledby={`${id}-tab`}>
            <div className="mx-auto mt-3 p-4 " style={{ backgroundColor: '#FFCCCC', maxWidth: '769px', maxHeight: 'auto' }}>
            {Object.entries(groupedFormElements).map(([countid, { title, answers }], index) => (
                    <div key={index} className="my-3 bg-white rounded-xl p-4 shadow-xl border-2 border-gray-500">
                        <h3 className="text-lg font-semibold mb-2">{title}</h3>
                        <h3 className="text-sm mb-2">{`คำตอบ ${answers.filter(answer => answer !== '').length} ข้อ`}</h3>

                        {answers.length > 0 ? (
                            <div className="max-h-72 overflow-y-auto">

                                {answers.filter(answer => answer !== '').map((answer, answerIndex) => (
                                    <div key={answerIndex} className=" bg-slate-100 px-4 py-2 mb-2 rounded-lg">
                                        {answer.toString()}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">ไม่มีคำตอบสำหรับคำถามนี้</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Answer1;
