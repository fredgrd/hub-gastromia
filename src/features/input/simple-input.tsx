import React, { CSSProperties } from "react";
import "./simple-input.css";

const SimpleInput: React.FC<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: {
    labelTitle: string;
    placeholder?: string;
    style?: CSSProperties;
    inputType?: string;
  };
}> = ({ value, onChange, options }) => {
  return (
    <div className="simpleinput" style={options.style}>
      <label className="simpleinput-label">{options.labelTitle}</label>
      <input
        type={options.inputType ? options.inputType : "text"}
        className="simpleinput-input"
        onChange={onChange}
        value={value}
        placeholder={options.placeholder}
      ></input>
    </div>
  );
};

export default SimpleInput;
