import React from "react";
import Form from "react-bootstrap/Form";

type props = {
  label: string;
  value: string;
  placeholder: string;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg: string;
};

const FormInput = ({ label, value, placeholder, handleOnChange, errorMsg }: props) => {
 
  return (
    <div className="form-input">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
      />
      {errorMsg !== "" && <span className="error-message">{errorMsg}</span> }
    </div>
  )
};

export default FormInput;
