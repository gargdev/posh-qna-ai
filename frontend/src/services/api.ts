import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    console.log(
      `🔄 Making ${config.method?.toUpperCase()} request to ${config.url}`,
    );
    console.log("   Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for logging
axios.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const sendQuery = async (query: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { query });
    return response.data;
  } catch (error) {
    console.error("Error sending query:", error);
    throw error;
  }
};

export const sendFeedback = async (
  query: string,
  response: string,
  helpful: boolean,
  modelUsed: string,
  context?: string,
) => {
  if (!query || helpful === undefined || !response || !modelUsed) {
    throw new Error("Missing required feedback parameters");
  }

  try {
    const feedback = await axios.post(`${API_BASE_URL}/feedback`, {
      query,
      response,
      helpful,
      modelUsed,
      context,
    });
    return feedback.data;
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};
