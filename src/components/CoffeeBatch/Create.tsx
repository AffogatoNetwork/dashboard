import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import { FaSearchPlus } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import "../../styles/create.scss";


export const Create = () => {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxFiles: 1
  });

  const files = acceptedFiles.map((file, index) => (
    <div key={index} className="file-accepted">
      <span>El archivo {file.name} ha sido cargado exitosamente.</span>
    </div>
  ));
  
  const fileError = (file: File, errors: any) => {
    if (errors.code === "file-invalid-type") {
      return <span>* El tipo del archivo {file.name} no es valido, solo se acepta archivos tipo .xlsx y xls</span>;
    } else if (errors.code === "file-too-big") {
      return <span>* El tamaño del archivo {file.name} ({file.size} MB) excede el máximo permitido (1 MB.)</span>;
    }
    return <span>* El archivo {file.name} no se pudo cargar.</span>;
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
    <div key={index} className="file-errors">
      {errors.map(e => (
        fileError(file, e)
      ))}
    </div>
  ));

  return (
    <div className="new-batch">
      <Card className="create-card">
        <Card.Header>
          <h2>Crear Lotes de café</h2>
        </Card.Header>
        <Card.Body>
          <h3>
            Explicación  de como subir el archivo  y el formato para hacerlo.
          </h3>
          <div className="dnd-container">
            <div {...getRootProps({className: "dropzone"})}>
              <input {...getInputProps()} />
              <FaSearchPlus className="icon" />
              <p>Arrastre y suelte el archivo aquí, o presione para elegir</p>
            </div>
            {files}
            {fileRejectionItems}
          </div>
        </Card.Body>
        <Card.Footer>
          <Button>
            Crear Lotes
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
