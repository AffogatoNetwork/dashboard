import React, { useId } from 'react';
import Form from 'react-bootstrap/Form';

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
  className = '',
  errorMsg = '',
}: props) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const isInvalid = errorMsg !== '';

  return (
    <div className="form-input border-0 bg-transparent">
      <Form.Label htmlFor={inputId}>{label}</Form.Label>
      <Form.Control
        id={inputId}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        className={className}
        aria-invalid={isInvalid ? 'true' : 'false'}
        aria-describedby={isInvalid ? errorId : undefined}
      />
      {isInvalid && (
        <span id={errorId} className="error-message" role="alert">
          {errorMsg}
        </span>
      )}
    </div>
  );
};

export default FormInput;
