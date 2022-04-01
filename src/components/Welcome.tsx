import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import MagicContext from "../states/MagicContext";

type props = {
  changeUpdateMagic: () => void;
}

const Welcome = ({ changeUpdateMagic }: props) => {
  const magic = useContext(MagicContext);
  
  const onLogout = async () => {
    if (magic.magic) {
      await magic.magic.user.logout();
      changeUpdateMagic();
    }
  }

  return (
    <div className="login">
      <Card>
        <Button onClick={() => onLogout()}>
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Welcome;
