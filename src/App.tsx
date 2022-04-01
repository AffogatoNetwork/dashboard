import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import "./styles/app.scss";
import { Magic } from "magic-sdk";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import MagicContext from "./states/MagicContext";
import { useMagic } from "./hooks/useMagic";

const customNodeOptions = {
  rpcUrl: "https://xdai.poanetwork.dev/",
  chainId: 10
};

const App = () => {
  const magic = useMagic();
  const magicSDK = new Magic("pk_live_6EA338E8981B7DEB", {
    network: customNodeOptions
  });
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [updateMagic, setUpdateMagic] = useState(false);

  useEffect(() => {
    async function load() {
      magic.setCurrentMagic(magicSDK);
      const isLoggedIn = await magicSDK.user.isLoggedIn();
      setLoggedIn(isLoggedIn);
    };
    load();
    // eslint-disable-next-line
  }, [updateMagic]);

  const changeUpdateMagic = () => {
    setUpdateMagic(!updateMagic);
  };

  return (
    <MagicContext.Provider value={magic}>
      <Container fluid className="main-container">
        {!isLoggedIn ? (
          <Login changeUpdateMagic={changeUpdateMagic} />
        ) : (
          <Welcome changeUpdateMagic={changeUpdateMagic} />
        )}
      </Container>
    </MagicContext.Provider>
  );
};

export default App;
