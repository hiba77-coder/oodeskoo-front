import axios from "axios";

const AUTH_TOKEN_KEY = "auth_token";

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const storeToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

export { AUTH_TOKEN_KEY, api };
