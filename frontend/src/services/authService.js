import api from "./api";

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   */
  async register(userData) {
    return api.post("/auth/register", userData);
  },

  /**
   * Log in user and receive JWT token
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    return api.post("/auth/login", credentials);
  },

  /**
   * Log out user session
   */
  async logout() {
    try {
      return await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};
