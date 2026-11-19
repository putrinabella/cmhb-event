import axios, { type AxiosRequestConfig, type Method } from "axios";

// 1. Define interface for Type Safety
interface AppEnv {
  VITE_EVENT_API: string;
}

// 2. Safe Env Loader (Runtime vs Build time)
const getEnv = (): AppEnv => {
  // Production / Docker (Priority)
  if (typeof window !== "undefined" && (window as any).__ENV__) {
    return {
      VITE_EVENT_API: (window as any).__ENV__.VITE_EVENT_API,
    };
  }

  // Vite Dev (Fallback)
  return {
    VITE_EVENT_API: import.meta.env.VITE_EVENT_API as string,
  };
};

const env = getEnv();

const api = axios.create({
  baseURL: env.VITE_EVENT_API,
  headers: {
    "Content-Type": "application/json",
  },
});

const USE_TEST_TOKEN = false;

api.interceptors.request.use(
  (config) => {
    if (config.headers) {
      if (USE_TEST_TOKEN) {
        config.headers.Authorization = "TOKEN_TESTING";
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.token) {
            config.headers.Authorization = `Bearer ${parsedUser.token}`;
          }
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, mungkin token invalid");
    }
    return Promise.reject(error);
  }
);

export const apiRequestWeb = async <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    const errData = error?.response?.data ?? { message: error.message };
    throw errData;
  }
};

export default api;
