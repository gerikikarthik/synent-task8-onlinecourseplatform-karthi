const { generateRoadmap } = require("../services/groqService");

const createRoadmap = async (req, res) => {
  try {
    const { career, experience, dailyTime } = req.body;

    let roadmap = await generateRoadmap(
      career,
      experience,
      dailyTime
    );

    // Remove ```json ... ``` markdown
    roadmap = roadmap
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("ROADMAP:");
    console.log(roadmap);

    res.status(200).json({
      success: true,
      roadmap: JSON.parse(roadmap),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoadmap,
};