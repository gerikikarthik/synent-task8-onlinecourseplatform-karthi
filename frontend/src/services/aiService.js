import axios from "axios";

const API_URL = "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/ai";

export const generateRoadmap = async (data) => {
  const response = await axios.post(
    `${API_URL}/roadmap`,
    data
  );

  return response.data;
};