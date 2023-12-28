import React from 'react';
import FormElement from './FormElement';
const Form = ({ formElementsget, handleTitleChange, removeFormElement, handleAddRadioOption, handleRemoveRadioOption, handleUpdateRadioOption }) => {
  return (
    <div>
      {formElementsget.map((element, index) => (
        <div className="my-4" key={index}>
          <FormElement
            element={element}
            index={index}
            handleTitleChange={handleTitleChange}
            removeFormElement={removeFormElement}
            handleAddRadioOption={handleAddRadioOption}
            handleRemoveRadioOption={handleRemoveRadioOption}
            handleUpdateRadioOption={handleUpdateRadioOption}
          />
        </div>
      ))}
    </div>
  );
};

export default Form;
