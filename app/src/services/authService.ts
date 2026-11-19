import { apiRequest } from "./apiClient";

export interface UserInterface {
  id: string;
  email: string;
  role?: string;
}

interface ApiLoginResponse {
  meta: {
    success: boolean;
    message: string;
    code: number;
  };
  data: {
    id: string;
    email: string;
    token: string;
  };
}

export const login = async (email: string, password: string) => {
  const res = await apiRequest("post", "/login", { email, password });

  const data = res.data as ApiLoginResponse["data"];

  return {
    token: data.token,
    user: {
      id: data.id,
      email: data.email,
      role: "admin",
    },
  };
};

export const logout = () => apiRequest("post", "/logout");
