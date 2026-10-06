import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// REQUEST INTERCEPTOR
// Attach JWT automatically
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// RESPONSE INTERCEPTOR
// Handle expired / invalid JWT
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error.response?.status;

    const requestUrl =
      error.config?.url || "";

    /*
     * Do NOT automatically redirect when a
     * login request returns 401.
     *
     * Login uses 401 for incorrect credentials,
     * and the Login page should display that
     * error itself.
     */
    const isLoginRequest =
      requestUrl.includes("/auth/login");

    if (
      status === 401 &&
      !isLoginRequest
    ) {
      localStorage.removeItem("token");

      /*
       * Prevent unnecessary redirect loops.
       */
      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;