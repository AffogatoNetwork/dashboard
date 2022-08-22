import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import "../../styles/create.scss";
import { useAuthContext } from "../../states/AuthContext";
import { saveFarms } from "../../db/firebase";
import { apiUrl } from "../../utils/constants";
import {
  getCompanyName,
  errorNotification,
  notifyUser,
} from "../../utils/utils";
import { FarmType } from "../common/types";
import Loading from "../Loading";

export const Create = () => {
  const { t } = useTranslation();
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
      <span>
        <>{t("remove", { "file-name": file.name })}</>
      </span>
      <Button className="remove" onClick={() => clearFiles()}>
        <>
          <FaTimes /> {t("remove")}
        </>
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
    const companyName = getCompanyName(ownerAddress);

    if (rows !== null) {
      // @ts-ignore
      for (let i = 2; i < rows.length; i += 1) {
        try {
          // @ts-ignore
          if (rows[i] !== null && rows[i].length > 0) {
            // @ts-ignore
            if (rows[i][1] !== "" && rows[i][2] !== "") {
              farms.push({
                // @ts-ignore
                farmerAddress: rows[i][1],
                company: companyName,
                // @ts-ignore
                name: rows[i][2] || "",
                // @ts-ignore
                height: rows[i][3] || 0,
                // @ts-ignore
                area: rows[i][4] || 0,
                // @ts-ignore
                certifications: rows[i][5] || "",
                // @ts-ignore
                latitude: rows[i][6] || "",
                // @ts-ignore
                longitude: rows[i][7] || "",
                // @ts-ignore
                bio: rows[i][8] || "",
                // @ts-ignore
                country: rows[i][9] || "",
                // @ts-ignore
                region: rows[i][10] || "",
                // @ts-ignore
                village: rows[i][11] || "",
                // @ts-ignore
                village2: rows[i][12] || "",
                // @ts-ignore
                varieties: rows[i][13] || "",
                // @ts-ignore
                shadow: rows[i][14] || "",
                // @ts-ignore
                familyMembers: rows[i][15] || 1,
                // @ts-ignore
                ethnicGroup: rows[i][16] || "",
                location: "",
                search: "",
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
          notifyUser(t("create-batches.success"));
          setSaving(false);
          clearFiles();
          saveFarmsToDB();
        })
        .catch((error) => {
          console.log(error);
          // errorNotification("Error inesperado.");
          notifyUser(t("errors.creating-batch"));
          setSaving(false);
          clearFiles();
        });
    } else {
      errorNotification(t("errors.no-file"));
    }
  };

  return (
    <div className="new-batch">
      <Card className="create-card">
        <Card.Header>
          <h2>
            <>{t("create-batches.title")}</>
          </h2>
        </Card.Header>
        <Card.Body>
          {saving ? (
            <Loading
              label={t("create-batches.creating")}
              className="loading-wrapper"
            />
          ) : (
            <>
              <h4>
                <>{t("create-batches.explanation")}</>
              </h4>
              <div className="dnd-container">
                {acceptedFiles.length === 0 ||
                rows === null ||
                cols === null ? (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <FaSearchPlus className="icon" />
                    <p>
                      <>{t("create-batches.drag-drop")}</>
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
            <>{t("create-batches.menu")}</>
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
