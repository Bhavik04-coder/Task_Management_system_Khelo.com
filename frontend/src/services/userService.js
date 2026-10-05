import api from "./api";

export const userService = {
  /**
   * Fetch authenticated user's profile
   */
  async getProfile() {
    return api.get("/users/me");
  },

  /**
   * Update authenticated user's profile
   * @param {Object} data - { name, email, password }
   */
  async updateProfile(data) {
    return api.put("/users/me", data);
  },
};
