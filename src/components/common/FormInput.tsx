import React from "react";
import Form from "react-bootstrap/Form";

type props = {
  label: string;
  value: string;
  placeholder: string;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  errorMsg?: string;
  className?: string;
};

const FormInput = ({
  label,
  value,
  placeholder,
  handleOnChange,
  handleOnKeyDown,
  className = "",
  errorMsg = "",
}: props) => (
  <div className="form-input">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      value={value}
      placeholder={placeholder}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      className={className}
    />
    {errorMsg !== "" && <span className="error-message">{errorMsg}</span>}
  </div>
);

export default FormInput;
