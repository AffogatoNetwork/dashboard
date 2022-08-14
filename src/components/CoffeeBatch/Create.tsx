import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import "../../styles/create.scss";
import { useAuthContext } from "../../states/AuthContext";
import { saveFarms } from "../../db/firebase";
import { apiUrl } from "../../utils/constants";
import { errorNotification, notifyUser, isNumber } from "../../utils/utils";
import { FarmType } from "../common/types";
import Loading from "../Loading";

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

  const saveFarmsToDB = async () => {
    const farms = new Array<FarmType>();

    if (rows !== null) {
      // @ts-ignore
      for (let i = 2; i < rows.length; i += 1) {
        try {
          // @ts-ignore
          if (rows[i] !== null && rows[i].length > 0) {
            // @ts-ignore
            if (rows[i][0] !== "" && rows[i][12] !== "") {
              // @ts-ignore
              const gpoint = rows[i][18].trim();
              const gpoint2 = [0, 0];

              // @ts-ignore
              if (gpoint !== "") {
                const gp = gpoint.split(",");
                if (gp.length === 2) {
                  if (isNumber(gp[0]) && isNumber(gp[1])) {
                    gpoint2[0] = parseInt(gp[0]);
                    gpoint2[1] = parseInt(gp[1]);
                  }
                }
              }

              farms.push({
                // @ts-ignore
                farmerAddress: rows[i][0],
                // @ts-ignore
                name: rows[i][11] || "",
                // @ts-ignore
                country: rows[i][12] || "",
                // @ts-ignore
                region: rows[i][13] || "",
                // @ts-ignore
                village: rows[i][14] || "",
                // @ts-ignore
                altitud: rows[i][15] || "",
                // @ts-ignore
                story: rows[i][16] || "",
                // @ts-ignore
                certifications: rows[i][17] || "",
                geopoint: gpoint2,
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (farms.length > 0) {
        await saveFarms(farms);
      }
    }
  };

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
          saveFarmsToDB();
        })
        .catch((error) => {
          console.log(error);
          // errorNotification("Error inesperado.");
          notifyUser("Error creando los lotes.");
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
