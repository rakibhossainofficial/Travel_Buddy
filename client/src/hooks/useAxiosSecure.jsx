import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logout } = useAuth() || {};

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        if (err.status === 401 || err.status === 403) {
          toast.error(err.response.data.error);
          logout();
        }
        return Promise.reject(err);
      }
    );
  }, [logout]);

  return axiosSecure;
};

export default useAxiosSecure;
