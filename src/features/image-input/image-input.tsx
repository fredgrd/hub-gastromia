import React, { useRef, useState } from "react";
import convertToBase64 from "../../models/convert-base64";
import "./image-input.css";

import { Spin } from "antd";

export interface ImageInputData {
  type: string;
  base64: string;
}

const ImageInput: React.FC<{
  data: ImageInputData | undefined;
  onSet: (data: ImageInputData) => void;
  options?: {
    style?: React.CSSProperties;
    info?: string;
  };
}> = ({ data, onSet, options }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageOnSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const file: File = event.target.files[0];
    const base64 = await convertToBase64(file);

    if (base64 && typeof base64 === "string") {
      onSet({ type: file.type, base64: base64 });
    }

    setIsUploading(false);
  };

  return (
    <div
      className="imageinput"
      style={options ? options.style : {}}
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      }}
    >
      <input
        type="file"
        accept="image"
        onChange={imageOnSelect}
        ref={inputRef}
        style={{ display: "none" }}
      />

      {!data && (
        <div className="imageinput-info-positioner">
          <span className="imageinput-info">{options?.info}</span>
        </div>
      )}

      {isUploading && (
        <div className="imageinput-spinner">
          <Spin />
        </div>
      )}

      <img className="imageinput-img" src={data?.base64} alt=""/>
    </div>
  );
};

export default ImageInput;
