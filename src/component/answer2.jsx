import React from 'react';

const Answer2 = ({ id, depart }) => {
  return (
    <div className="tab-pane fade show" id={id} role="tabpanel" aria-labelledby={`${id}-tab`}>
      <div className="mx-auto mt-3 p-4 " style={{ backgroundColor: '#FFCCCC', maxWidth: '769px', maxHeight: 'auto' }}>
        <div className="my-4 bg-white rounded p-4 shadow-md relative">
          <div className="bg-red-500 h-4 rounded-t-md absolute top-0 left-0 right-0 flex items-center justify-center text-white font-bold">
            <span></span>
          </div>
          <h1 className="text-2xl font-bold mb-4 mt-2">ฟอร์ม ไม่มีชื่อ</h1>
          <hr className="w-full border-t" />
          <p>{depart}</p>
        </div>

        {/* <div>
        {formElements.map((element, index) => (
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
      </div> */}

      </div>    </div>
  );
};

export default Answer2;
