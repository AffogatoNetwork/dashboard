import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import "../../styles/create.scss";
import { apiUrl } from "../../utils/constants";
import { errorNotification, notifyUser } from "../../utils/utils";
import Loading from "../Loading";

export const Create = () => {
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [saving, setSaving] = useState(false);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps, open } =
    useDropzone({
      accept: ".xlsx",
      maxFiles: 1,
    });

  const changeFile = () => {
    setRows(null);
    setCols(null);
    open();
  };

  const files = acceptedFiles.map((file, index) => (
    <div key={index} className="file-accepted">
      <span>El archivo {file.name} ha sido cargado exitosamente.</span>
      <Button className="remove" onClick={() => changeFile()}>
        (<FaTimes /> Quitar)
      </Button>
    </div>
  ));

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      ExcelRenderer(acceptedFiles[0], (err: any, resp: any) => {
        if (err) {
          console.log(err);
        } else {
          setRows(resp.rows);
          setCols(resp.cols);
        }
      });
    }
  }, [acceptedFiles]);

  const fileError = (file: File, errors: any) => {
    if (errors.code === "file-invalid-type") {
      return (
        <span>
          * El tipo del archivo {file.name} no es valido, solo se acepta
          archivos tipo .xlsx y xls
        </span>
      );
    }
    if (errors.code === "file-too-big") {
      return (
        <span>
          * El tamaño del archivo {file.name} ({file.size} MB) excede el máximo
          permitido (1 MB.)
        </span>
      );
    }
    return <span>* El archivo {file.name} no se pudo cargar.</span>;
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
    <div key={index} className="file-errors">
      {errors.map((e) => fileError(file, e))}
    </div>
  ));

  const createBatches = () => {
    if (acceptedFiles.length === 1) {
      setSaving(true);
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      const url = apiUrl.concat(
        "submit?coop_address=0x13248B47b0fF1c04D2A054B662C850dc05d47B4d"
      );
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("---- Resp -----");
          console.log(json);
          notifyUser("Los lotes de café han sido creados.");
          setSaving(false);
          acceptedFiles.pop();
        })
        .catch((error) => {
          console.log(error);
          errorNotification("Error inesperado.");
          setSaving(false);
        });
    } else {
      errorNotification("Seleccione el archivo a cargar.");
    }
  };

  return (
    <div className="new-batch">
      <Card className="create-card">
        <Card.Header>
          <h2>Crear Lotes de café</h2>
        </Card.Header>
        <Card.Body>
          {saving ? (
            <Loading label="Creando Lotes.." />
          ) : (
            <>
              <h4>
                Explicación de como subir el archivo y el formato para hacerlo.
              </h4>
              <div className="dnd-container">
                {acceptedFiles.length === 0 ||
                rows === null ||
                cols === null ? (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <FaSearchPlus className="icon" />
                    <p>
                      Arrastre y suelte el archivo aquí, o presione para elegir
                    </p>
                  </div>
                ) : (
                  <div className="excel-container">
                    <OutTable
                      data={rows}
                      columns={cols}
                      tableClassName="excel"
                      tableHeaderRowClass="heading"
                    />
                  </div>
                )}
                {files}
                {fileRejectionItems}
              </div>
            </>
          )}
        </Card.Body>
        <Card.Footer>
          <Button onClick={() => createBatches()} disabled={saving}>
            Crear Lotes
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
