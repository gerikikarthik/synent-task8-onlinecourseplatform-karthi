const {
  generateRoadmap,
  generateCodingQuestions,
} = require("../services/groqService");


// =====================================================
// CREATE AI ROADMAP
// =====================================================

const createRoadmap = async (req, res) => {
  try {
    const {
      career,
      experience,
      dailyTime,
    } = req.body;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required",
      });
    }

    let roadmap = await generateRoadmap(
      career,
      experience,
      dailyTime
    );

    // Remove markdown if AI returns ```json
    roadmap = roadmap
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("ROADMAP:");
    console.log(roadmap);

    const parsedRoadmap = JSON.parse(roadmap);

    res.status(200).json({
      success: true,
      roadmap: parsedRoadmap,
    });

  } catch (error) {
    console.error(
      "Create Roadmap Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE CODING QUESTIONS
// =====================================================

const createCodingQuestions = async (
  req,
  res
) => {
  try {
    const {
      topic,
      career,
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    let questions =
      await generateCodingQuestions(
        topic,
        career || "Software Developer"
      );

    // Remove markdown if AI returns ```json
    questions = questions
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(
      "CODING QUESTIONS:"
    );

    console.log(questions);

    const parsedQuestions =
      JSON.parse(questions);

    res.status(200).json({
      success: true,
      data: parsedQuestions,
    });

  } catch (error) {
    console.error(
      "Create Coding Questions Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createRoadmap,
  createCodingQuestions,
};