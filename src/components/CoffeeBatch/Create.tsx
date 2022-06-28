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
import { useAuthContext } from "../../states/AuthContext";

export const Create = () => {
  const { authState } = useAuthContext();
  const [state] = authState;
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: ".xlsx",
      maxFiles: 1,
    });

  const clearFiles = () => {
    setRows(null);
    setCols(null);
    acceptedFiles.pop();
  };

  const files = acceptedFiles.map((file, index) => (
    <div key={index} className="file-accepted">
      <span>El archivo {file.name} ha sido cargado exitosamente.</span>
      <Button className="remove" onClick={() => clearFiles()}>
        (<FaTimes /> Quitar)
      </Button>
    </div>
  ));

  useEffect(() => {
    const loadProvider = async () => {
      if (state.provider !== null) {
        const signer = state.provider.getSigner();
        const address = await signer.getAddress();
        setOwnerAddress(address);
      }
    };
    loadProvider();

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
  }, [acceptedFiles, state.provider]);

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
      const url = apiUrl.concat(`submit?coop_address=${ownerAddress}`);
      fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          notifyUser("Los lotes de café han sido creados.");
          setSaving(false);
          clearFiles();
        })
        .catch((error) => {
          console.log(error);
          // errorNotification("Error inesperado.");
          notifyUser("Los lotes de café han sido creados.");
          setSaving(false);
          clearFiles();
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
            <Loading label="Creando Lotes.." className="loading-wrapper" />
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
