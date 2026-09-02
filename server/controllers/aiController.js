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
      courseTitle,
      courseDescription,
      courseTopics,
    } = req.body;

    console.log("=================================");
    console.log("AI ROADMAP REQUEST");
    console.log("Career:", career);
    console.log("Experience:", experience);
    console.log("Daily Time:", dailyTime);
    console.log("Course:", courseTitle);
    console.log("=================================");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required",
      });
    }

    if (!courseTitle) {
      return res.status(400).json({
        success: false,
        message: "Course title is required",
      });
    }

    // -----------------------------
    // GENERATE ROADMAP
    // -----------------------------

    let roadmap = await generateRoadmap(
      career,
      experience || "Beginner",
      dailyTime || "2 hours",
      courseTitle,
      courseDescription || "",
      courseTopics || []
    );

    console.log("RAW GROQ ROADMAP:");
    console.log(roadmap);

    // -----------------------------
    // REMOVE MARKDOWN
    // -----------------------------

    roadmap = roadmap
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // -----------------------------
    // FIND JSON
    // -----------------------------

    const start = roadmap.indexOf("{");
    const end = roadmap.lastIndexOf("}") + 1;

    if (start === -1 || end <= 0) {
      throw new Error(
        "Groq returned invalid roadmap data"
      );
    }

    roadmap = roadmap.substring(start, end);

    // -----------------------------
    // PARSE JSON
    // -----------------------------

    const parsedRoadmap = JSON.parse(roadmap);

    console.log("✅ ROADMAP GENERATED");

    // -----------------------------
    // SEND RESPONSE
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "AI Roadmap generated successfully",
      roadmap: parsedRoadmap,
    });

  } catch (error) {
    console.error(
      "❌ Create Roadmap Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate AI roadmap",
    });
  }
};


// =====================================================
// CREATE CODING QUESTIONS
// =====================================================

const createCodingQuestions = async (req, res) => {
  try {
    const {
      topic,
      career,
    } = req.body;

    console.log("=================================");
    console.log("CODING QUESTION REQUEST");
    console.log("Topic:", topic);
    console.log("Career:", career);
    console.log("=================================");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    // -----------------------------
    // GENERATE QUESTIONS
    // -----------------------------

    let questions =
      await generateCodingQuestions(
        topic,
        career || "Software Developer"
      );

    console.log("RAW GROQ QUESTIONS:");
    console.log(questions);

    // -----------------------------
    // REMOVE MARKDOWN
    // -----------------------------

    questions = questions
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // -----------------------------
    // FIND JSON
    // -----------------------------

    const start = questions.indexOf("{");
    const end = questions.lastIndexOf("}") + 1;

    if (start === -1 || end <= 0) {
      throw new Error(
        "Groq returned invalid coding question data"
      );
    }

    questions = questions.substring(
      start,
      end
    );

    // -----------------------------
    // PARSE JSON
    // -----------------------------

    const parsedQuestions =
      JSON.parse(questions);

    console.log("✅ CODING QUESTIONS GENERATED");

    // -----------------------------
    // SEND RESPONSE
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "Coding questions generated successfully",
      data: parsedQuestions,
    });

  } catch (error) {
    console.error(
      "❌ Create Coding Questions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate coding questions",
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