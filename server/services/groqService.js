const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// GENERATE COURSE + CAREER BASED AI ROADMAP
// =====================================================

const generateRoadmap = async (
  career,
  experience,
  dailyTime,
  courseTitle,
  courseDescription,
  courseTopics
) => {
  try {
    const topics = Array.isArray(courseTopics)
      ? courseTopics
      : [];

    const prompt = `
You are an expert personalized learning-path designer.

Your task is to create a COMPLETE learning roadmap using the
SELECTED COURSE as the PRIMARY SOURCE and the learner's CAREER
as the direction for prioritization.

====================================================
LEARNER
====================================================

Career:
${career}

Experience:
${experience || "Beginner"}

Daily Study Time:
${dailyTime || "2 hours"}

====================================================
SELECTED COURSE
====================================================

Course Title:
${courseTitle}

Course Description:
${courseDescription || "Not provided"}

Course Topics:
${JSON.stringify(topics)}

====================================================
ABSOLUTE COURSE RULES
====================================================

1. The selected course is the PRIMARY learning source.

2. Every module MUST be directly connected to the selected course.

3. Every topic MUST come from, be a natural expansion of, or be
   directly required to understand the selected course.

4. DO NOT randomly add technologies because they are popular.

5. DO NOT create unrelated career topics.

6. The career is used ONLY to:
   - prioritize relevant course topics
   - decide learning order
   - decide practical emphasis
   - decide project direction
   - decide relevant interview preparation

7. Do NOT turn the roadmap into a generic career roadmap.

8. If a skill is not connected to the selected course, DO NOT include it.

====================================================
MODULE RULES
====================================================

9. AI must decide the appropriate number of modules based on the
   actual course content.

10. Do NOT create empty or unnecessary modules.

11. For a large 6-month course, approximately 5 modules is preferred.

12. For a smaller course, fewer modules are acceptable.

13. Each module must have logically connected topics.

14. Modules must progress from fundamentals to advanced/practical
   learning.

15. Avoid duplicate modules.

====================================================
TOPIC RULES
====================================================

16. Each topic must represent a complete learning lesson.

17. Topics must be specific, not vague.

18. Do NOT repeat the same topic.

19. Topics must logically depend on previous topics.

20. Every topic must contain:
   - title
   - description
   - complete video topic
   - detailed notes
   - topic-specific quiz
   - coding questions when applicable

21. Do NOT create 1-minute learning videos.

22. videoTopic must describe the COMPLETE lesson to teach.

====================================================
QUIZ RULES
====================================================

23. Every quiz must be directly related to its CURRENT topic.

24. Quiz questions must test concepts actually taught in that topic.

25. NEVER reuse the same quiz question in another topic.

26. NEVER reuse the same question with minor wording changes.

27. Quiz questions must become progressively more challenging.

28. Do not ask questions about future topics.

29. Do not ask questions about unrelated technologies.

30. Generate 5 unique quiz questions for every topic.

31. Each quiz question must have:
   - question
   - 4 options
   - correct answer

====================================================
CODING RULES
====================================================

32. Coding questions are ONLY for programming/coding topics.

33. For non-coding topics:

"isCoding": false

and:

"codingQuestions": []

34. For coding topics:

"isCoding": true

35. Coding questions MUST be directly related to the CURRENT topic.

36. NEVER generate coding problems from another topic.

37. NEVER repeat coding problems between topics.

38. Do not change the same problem slightly and count it as new.

39. Coding difficulty should progress:
   Easy → Easy/Medium → Medium.

40. Generate 3 unique coding questions for each coding topic.

41. Coding questions must contain:
   - title
   - difficulty
   - description
   - example
   - solutionHint

====================================================
NOTES RULES
====================================================

42. Notes must teach the CURRENT topic.

43. Notes must contain useful learning points.

44. Notes must not contain unrelated concepts.

45. Do not simply repeat the topic title as notes.

====================================================
PRACTICAL LEARNING
====================================================

46. Include practical activities where they naturally fit the course.

47. Include projects that use the course technologies/topics.

48. Project difficulty should increase throughout the roadmap.

49. Interview preparation may be included only when it is directly
    relevant to the selected course and career.

====================================================
DURATION
====================================================

50. AI must estimate a realistic duration.

51. Consider:
   - course size
   - topic complexity
   - experience
   - daily study time

52. Do not blindly force 6 months.

53. A large course may take several months.

54. A smaller course may take less time.

====================================================
PROGRESS
====================================================

55. Every topic must start with:

"completed": false

56. The frontend will update completion as the learner progresses.

====================================================
VERY IMPORTANT
====================================================

The roadmap must answer this question:

"What should THIS learner learn from THIS COURSE to become
better prepared for THIS CAREER?"

Do NOT answer:

"What should anyone learn for this career?"

The COURSE must remain the foundation.

====================================================
RETURN ONLY JSON
====================================================

{
  "title": "",
  "career": "${career}",
  "course": "${courseTitle}",
  "duration": "",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "",
      "description": "",
      "topics": [
        {
          "topicNumber": 1,
          "title": "",
          "description": "",
          "videoTopic": "",
          "notes": [
            ""
          ],
          "quiz": [
            {
              "question": "",
              "options": [
                "",
                "",
                "",
                ""
              ],
              "answer": ""
            }
          ],
          "isCoding": false,
          "codingQuestions": [],
          "completed": false
        }
      ]
    }
  ]
}

For coding topics, use:

"isCoding": true

and generate exactly 3 unique coding questions.

For non-coding topics, use:

"isCoding": false

and:

"codingQuestions": []

Generate the roadmap now.
Return ONLY valid JSON.
`;

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
          {
            role: "system",
            content:
              "You are a strict course-specific AI learning roadmap generator. The selected course is the primary source. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.25,
        max_tokens: 16000,
      });

    const result =
      completion.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error(
        "Groq returned an empty roadmap response"
      );
    }

    // Remove accidental markdown fences
    return result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  } catch (error) {
    console.error(
      "❌ Groq Roadmap Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate AI roadmap"
    );
  }
};


// =====================================================
// GENERATE TOPIC-SPECIFIC CODING QUESTIONS
// =====================================================

const generateCodingQuestions = async (
  topic,
  career
) => {
  try {
    const prompt = `
You are an expert programming instructor.

Generate coding practice questions ONLY for the CURRENT TOPIC.

====================================================
TOPIC
====================================================

${topic}

====================================================
CAREER
====================================================

${career || "Software Developer"}

====================================================
STRICT RULES
====================================================

1. Every question MUST be directly related to the topic.

2. Do NOT generate questions from other topics.

3. Do NOT generate generic coding questions.

4. Generate exactly 5 unique questions.

5. Do not repeat questions.

6. Do not create the same problem with different wording.

7. Difficulty must progress:
   Easy → Easy → Medium → Medium → Medium

8. Questions must be useful for practical learning and interviews.

9. Return ONLY valid JSON.

====================================================
JSON
====================================================

{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "title": "",
      "difficulty": "Easy",
      "description": "",
      "examples": [
        {
          "input": "",
          "output": "",
          "explanation": ""
        }
      ],
      "constraints": [],
      "starterCode": {
        "java": "",
        "python": ""
      }
    }
  ]
}
`;

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
          {
            role: "system",
            content:
              "You are a strict topic-specific coding question generator. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.25,
        max_tokens: 7000,
      });

    const result =
      completion.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error(
        "Groq returned an empty coding question response"
      );
    }

    return result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  } catch (error) {
    console.error(
      "❌ Groq Coding Questions Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate coding questions"
    );
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  generateRoadmap,
  generateCodingQuestions,
};