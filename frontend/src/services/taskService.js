import api from "./api";

export const taskService = {
  /**
   * Fetch paginated and filtered tasks
   * @param {Object} params - { status, priority, due_date, search, page, limit }
   */
  async getTasks(params = {}) {
    return api.get("/tasks", { params });
  },

  /**
   * Fetch dashboard task statistics
   */
  async getTaskStats() {
    return api.get("/tasks/stats");
  },

  /**
   * Fetch a single task by ID
   * @param {number|string} id
   */
  async getTaskById(id) {
    return api.get(`/tasks/${id}`);
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, status, priority, due_date }
   */
  async createTask(taskData) {
    return api.post("/tasks", taskData);
  },

  /**
   * Update an existing task
   * @param {number|string} id
   * @param {Object} taskData
   */
  async updateTask(id, taskData) {
    return api.put(`/tasks/${id}`, taskData);
  },

  /**
   * Patch task status
   * @param {number|string} id
   * @param {string} status - 'Pending' | 'In Progress' | 'Completed'
   */
  async updateTaskStatus(id, status) {
    return api.patch(`/tasks/${id}/status`, { status });
  },

  /**
   * Delete a task by ID
   * @param {number|string} id
   */
  async deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  },
};
