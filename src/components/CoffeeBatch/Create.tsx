import React, { useEffect, useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import "../../styles/create.scss";
import { useAuthContext } from "../../states/AuthContext";
import { saveBatch, saveFarms } from "../../db/firebase";
import { apiUrl } from "../../utils/constants";
import {
  getCompanyName,
  getCompanyAddressesByHost,
  errorNotification,
  notifyUser,
} from "../../utils/utils";
import { FarmType } from "../common/types";
import Loading from "../Loading";
import {use} from "i18next";

export const Create = () => {
  const { t } = useTranslation();
  const { authState } = useAuthContext();
  const [state] = authState;
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        "file" : [".xlsx"],
      },
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
      <button className="remove" onClick={() => clearFiles()}>
        <>
          <FaTimes /> {t("remove")}
        </>
      </button>
    </div>
  ));

  useEffect(() => {
    const loadProvider = async () => {

      const user = localStorage.getItem("addres")
      if(user !== ""){
        setCurrentUser(user)
      } else {
        setCurrentUser("0xfa474d1e6d83c6ba0591117981d56dbf08c774af")

      }
      const address = getCompanyAddressesByHost(window.location.host)[0];
      setOwnerAddress(address);
    };
    loadProvider();

    if (acceptedFiles.length > 0) {
      ExcelRenderer(acceptedFiles[0], (err: any, resp: any) => {
        if (err) {
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
      {currentUser ? (
      <div className="card create-card shadow-xl">
        <div className="card-body">
          <h2 className="py-4">
            <>{t("create-batches.title")}</>
          </h2>
          {saving ? (
            <Loading
              label={t("create-batches.creating")}
              className="loading-wrapper"
            />
          ) : (
            <>
              <h4 className="text-light text-stone-400">
                <>{t("create-batches.explanation")}</>
              </h4>
              <div className="dnd-container">
                {acceptedFiles.length === 0 ||
                rows === null ||
                cols === null ? (
                  <div {...getRootProps({ className: "dropzone p-6" })}>
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
        </div>
        <div className="card-footer">
              <button className="btn btn-secondary" onClick={() => createBatches()} disabled={saving}>
                <>{t("create-batches.menu")}</>
              </button>
        </div>
     </div>
      ) : (
          <h1> Not logged in</h1>
      )}
    </div>
  );
};
