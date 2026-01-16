import { useEffect, useRef } from "react";
import api from "../lib/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();
  const authRef = useRef({ isSignedIn, getToken });

  useEffect(() => {
    authRef.current = { isSignedIn, getToken };
  }, [isSignedIn, getToken]);

  // include the token to the request headers
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const { isSignedIn, getToken } = authRef.current;
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          };
        }
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  return { isSignedIn, isClerkLoaded: isLoaded };
}
export default useAuthReq;
