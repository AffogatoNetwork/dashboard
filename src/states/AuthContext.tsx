import React, { useContext, useEffect, useMemo, useReducer } from "react";
import { Magic } from "magic-sdk";

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
};

const AuthContext = React.createContext<AuthType>({ authContext: null, authState: null });

export default function AuthProvider({ children }: props) {
  const magicSDK = new Magic(process.env.REACT_APP_MAGIC_API_KEY || "", {
    network: {
      rpcUrl: "https://xdai.poanetwork.dev/",
      chainId: 10
    }
  });
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
            }; 
          case "SIGN_IN_ERROR":
            return {
              ...prevState,
              isLoading: false,
              isSignInError: true,
              isSigningIn: false,
              isLoggedIn: false
            };  
          case "SIGN_OUT":
            return {
              ...prevState,
              isLoading: false,
              isSigningIn: false,
              isSignInError: false,
              isLoggedIn: false
            };
        }
      },
      {
        isLoading: true,
        isSigningIn: false,
        isSignInError: false,
        isLoggedIn: false,
      }
  );

  useEffect(() => {
      // check if user is logged in
    const load = async () => {
      console.log("entra");
      const loggedIn = await magicSDK.user.isLoggedIn();
      console.log("pasa ---");
      if (loggedIn) {
        console.log("in ---");
        dispatch({ type: "SIGN_IN", isLoading: false, isLoggedIn: true });
      } else {
        console.log("out ---");
        dispatch({ type: "SIGN_OUT", isLoading: false });
      }
    };
    load();
  }, [state.isLoggedIn]);    

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
          dispatch({ type: "SIGN_IN", isLoading: false, isLoggedIn: true });
        } else {
          dispatch({ type: "SIGN_IN_ERROR" });
        }
      },
      signOut: async (data: ContextDataType) => {
        await magicSDK.user.logout();
        dispatch({ type: "SIGN_OUT" });
      },         
    }),
    []
  );

  return <AuthContext.Provider value={{ authContext: authContext,  authState: [ state, dispatch ] }}>{children}</AuthContext.Provider>
};

export function useAuthContext() {
    return useContext(AuthContext)
};
