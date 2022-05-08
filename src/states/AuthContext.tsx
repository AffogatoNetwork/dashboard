import React, { useContext, useEffect, useMemo, useReducer } from "react";
import { Magic } from "magic-sdk";
import { ethers } from "ethers";
import emailjs from "@emailjs/browser";
import { CooperativeType } from "../utils/constants";
import CoffeeBatch from "../contracts/CoffeBatch.json";
import { useContracts } from "../hooks/useContracts";

type AuthType = {
  authContext: any;
  authState: any;
};
type props = {
  children: any;
};
type ContextDataType = {
  emailLogin: boolean;
  credential: string;
  cooperative: CooperativeType;
  farmerId: string | null;
  isFarmer: boolean;
};

const AuthContext = React.createContext<AuthType>({ authContext: null, authState: null });

export default function AuthProvider({ children }: props) {
  const contracts = useContracts();
  const magicSDK = new Magic(process.env.REACT_APP_MAGIC_API_KEY || "", {
    network: {
      rpcUrl: "https://xdai.poanetwork.dev/",
      chainId: 10
    }
  });
  emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "");

  const [state, dispatch] = useReducer(
      (prevState: any, action: any) => {
        switch (action.type) {
          case "SIGNING_IN":
            return {
              ...prevState,
              isSigningIn: true,               
            };  
          case "SIGN_IN":
            return {
              ...prevState,
              isLoading: false,
              isSigningIn: false,
              isLoggedIn: action.isLoggedIn,
              provider: action.provider,
            }; 
          case "SIGN_IN_ERROR":
            return {
              ...prevState,
              isLoading: false,
              isSignInError: true,
              isSigningIn: false,
              isLoggedIn: false,
              provider: null,
            };  
          case "SIGN_OUT":
            return {
              ...prevState,
              accountCreated: false,
              isLoading: false,
              isSigningIn: false,
              isSignInError: false,
              isLoggedIn: false,
              provider: null,
            };
          case "CREATING_ACCOUNT":
            return {
              ...prevState,
              creatingAccount: true,
            };
          case "ACCOUNT_CREATED":
            return {
              ...prevState,
              creatingAccount: false,
              accountCreated: true,
              accountCreatedError: false,
            };
          case "CREATING_ACCOUNT_ERROR":
            return {
              ...prevState,
              creatingAccount: false,
              accountCreated: false,
              creatingAccountError: true,
            };
        }
      },
      {
        isLoading: true,
        isSigningIn: false,
        isSignInError: false,
        isLoggedIn: false,
        creatingAccount: false,
        creatingAccountError: false,
        accountCreated: false,
        provider: null,
      }
  );

  useEffect(() => {
      // check if user is logged in
    const load = async () => {
      const loggedIn = await magicSDK.user.isLoggedIn();
      if (loggedIn) {
        const provider = new ethers.providers.Web3Provider((magicSDK.rpcProvider as any));
        dispatch({ type: "SIGN_IN", isLoading: false, isLoggedIn: true, provider: provider });
      } else {
        dispatch({ type: "SIGN_OUT", isLoading: false });
      }
    };
    load();
    // eslint-disable-next-line
  }, [state.isLoggedIn]);    

  const verifyAccount = async () => {
    const provider = new ethers.providers.Web3Provider((magicSDK.rpcProvider as any));
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    // Set CoffeBatch contracts
    const currentCoffeeBatch = new ethers.Contract(
      CoffeeBatch.address,
      CoffeeBatch.abi,
      signer
    );
    contracts.setCurrentCoffeeBatch(currentCoffeeBatch);
    const exists = await currentCoffeeBatch.minters(userAddress);
    if (!exists) {
      dispatch({ type: "SIGN_IN", isLoading: false, isLoggedIn: true, provider:  provider });
    } else {
      await magicSDK.user.logout();
      dispatch({ type: "SIGN_IN_ERROR" });
    }
  };

  const sendAccountEmail = async (data: ContextDataType) => {
    const provider = new ethers.providers.Web3Provider((magicSDK.rpcProvider as any));
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    let templateId = process.env.REACT_APP_EMAILJS_COOP_TEMPLATE_ID || "";
    if (!data.isFarmer) {
      templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "";
    }
    const template_params = {
      "to_name": "Jorge",
      "address": address,
      "id_productor": data.farmerId,
      "to_email": data.isFarmer ? data.cooperative.email : "jdestephen07@gmail.com"
    };
    
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID || "",
      templateId,
      template_params
    ).then(async function(response) {
      await magicSDK.user.logout();
      dispatch({ type: "ACCOUNT_CREATED" });
    }, function(error) {
      console.log("FAILED...", error);
      dispatch({ type: "CREATING_ACCOUNT_ERROR" });
    });
  };

  const authContext = useMemo(
    () => ({
      signIn: async (data: ContextDataType) => {
        dispatch({ type: "SIGNING_IN" });
        if (data.emailLogin) {
          await magicSDK.auth.loginWithMagicLink({ email: data.credential, showUI: true });
        } else {
          await magicSDK.auth.loginWithSMS({ phoneNumber: data.credential });
        }
        if (await magicSDK.user.isLoggedIn()) {
          verifyAccount();
        } else {
          dispatch({ type: "SIGN_IN_ERROR" });
        }
      },
      createAccount: async (data: ContextDataType) => {
        dispatch({ type: "CREATING_ACCOUNT" });
        if (data.emailLogin) {
          await magicSDK.auth.loginWithMagicLink({ email: data.credential, showUI: true });
        } else {
          await magicSDK.auth.loginWithSMS({ phoneNumber: data.credential });
        }
        if (await magicSDK.user.isLoggedIn()) {
          sendAccountEmail(data);
        } else {
          dispatch({ type: "CREATING_ACCOUNT_ERROR" });
        }
      },
      signOut: async () => {
        await magicSDK.user.logout();
        dispatch({ type: "SIGN_OUT" });
      },
      fakeSignOut: async () => {
        dispatch({ type: "SIGN_OUT" });
      },
    }),
    // eslint-disable-next-line
    []
  );

  return <AuthContext.Provider value={{ authContext: authContext,  authState: [ state, dispatch ] }}>{children}</AuthContext.Provider>
};

export function useAuthContext() {
    return useContext(AuthContext)
};
