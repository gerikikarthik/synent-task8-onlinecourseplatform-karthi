import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export const generateRoadmap = async (data) => {
  const response = await axios.post(
    `${API_URL}/roadmap`,
    data
  );

  return response.data;
};