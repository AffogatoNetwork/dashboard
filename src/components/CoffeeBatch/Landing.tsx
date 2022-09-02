import React from "react";
import Card from "react-bootstrap/esm/Card";
import { setMulticallAddress } from "ethers-multicall";
// import { useTranslation } from "react-i18next";
import "../../styles/batchlist.scss";
import "../../styles/modals.scss";

export const Landing = () => {
  //   const { t } = useTranslation();
  setMulticallAddress(10, "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a");

  return (
    <div className="batch-list">
      <Card className="create-card">
        <Card.Body>
          <div className="container-fluid">
            <div className="row">
              <div className="col-4">
                <img
                  src="https://picsum.photos/500/500"
                  alt="thumbnail"
                  className="rounded float-start"
                />
              </div>
              <div className="col-6 ms-4">
                <h3>Blockchain</h3>
                <p className="">
                  Zombies reversus ab inferno, nam malum cerebro. De carne
                  animata corpora quaeritis. Summus sit​​, morbo vel maleficia?
                  De Apocalypsi undead dictum mauris. Hi mortuis soulless
                  creaturas, imo monstra imo monstra adventus vultus comedat
                  cerebella viventium. Qui offenderit rapto, terribilem incessu.
                  The voodoo sacerdos suscitat mortuos comedere carnem. Search
                  for solum oculi eorum defunctis cerebro. Nescio an Undead
                  zombies. Sicut malus movie horror.
                </p>
                <h3>Trazabilidad</h3>
                <p className="">
                  Zombies reversus ab inferno, nam malum cerebro. De carne
                  animata corpora quaeritis. Summus sit​​, morbo vel maleficia?
                  De Apocalypsi undead dictum mauris. Hi mortuis soulless
                  creaturas, imo monstra imo monstra adventus vultus comedat
                  cerebella viventium. Qui offenderit rapto, terribilem incessu.
                  The voodoo sacerdos suscitat mortuos comedere carnem. Search
                  for solum oculi eorum defunctis cerebro. Nescio an Undead
                  zombies. Sicut malus movie horror.
                </p>
                <h3>Acerca de PROEXO</h3>
                <p>
                  PROEXO es una empresa de economía social que busca y sostiene
                  la primacía del trabajo, opta por la propiedad social de los
                  medios de producción y busca establecer que el excedente
                  generado sea un medio para elevar el nivel de vida de sus
                  miembros.
                </p>
                <h3 className="mb-2">Certificados</h3>
                <img
                  src="https://picsum.photos/100/100"
                  alt="thumbnail"
                  className="rounded-circle"
                />
                <img
                  src="https://picsum.photos/100/100"
                  alt="thumbnail"
                  className="rounded-circle ms-4"
                />
                <img
                  src="https://picsum.photos/100/100"
                  alt="thumbnail"
                  className="rounded-circle  ms-4"
                />
                <img
                  src="https://picsum.photos/100/100"
                  alt="thumbnail"
                  className="rounded-circle  ms-4"
                />
                <img
                  src="https://picsum.photos/100/100"
                  alt="thumbnail"
                  className="rounded-circle ms-4"
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
