import React from "react";
import Button from "react-bootstrap/esm/Button";
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
        <Card.Header>
          <div>
            <h2>Title</h2>
          </div>
          <div>
            <h3>Subtitle</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="container-fluid">
            <div className="row">
              <div className="col-4">
                <img
                  src="https://picsum.photos/400/400"
                  alt="thumbnail"
                  className="left"
                />
              </div>
              <div className="col-6">
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
                <p>
                  Cum horribilem resurgere de sepulcris creaturis, sicut de
                  iride et serpens. Pestilentia, ipsa screams. Pestilentia est
                  haec ambulabat mortuos. Sicut malus voodoo. Aenean a dolor
                  vulnerum aperire accedunt, mortui iam vivam. Qui tardius
                  moveri, sed in magna copia sint terribiles legionis. Alii
                  missing oculis aliorum sicut serpere crabs nostram. Putridi
                  odores aere implent.
                </p>
                <Button className="">Do Something</Button>
                <Button className="mx-4">Do Something Else</Button>
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer />
      </Card>
    </div>
  );
};
