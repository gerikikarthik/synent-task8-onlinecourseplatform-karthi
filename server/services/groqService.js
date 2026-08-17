const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// GENERATE AI ROADMAP
// =====================================================

const generateRoadmap = async (
  career,
  experience,
  dailyTime
) => {
  const prompt = `
Create a learning roadmap.

Career: ${career}
Experience: ${experience}
Daily Study Time: ${dailyTime}

Return ONLY valid JSON.

Do not use markdown.
Do not use \`\`\`json.
Do not add any explanation outside JSON.

Return exactly this structure:

{
  "title": "",
  "duration": "",
  "modules": [
    {
      "title": "",
      "duration": "",
      "topics": []
    }
  ]
}

Create modules and topics that are specifically relevant to the selected career.
`;


  const chatCompletion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      model: "openai/gpt-oss-120b",

      temperature: 0.7,
    });

  return chatCompletion.choices[0].message.content;
};


// =====================================================
// GENERATE CODING QUESTIONS FOR A TOPIC
// =====================================================

const generateCodingQuestions = async (
  topic,
  career
) => {

  const prompt = `
You are an expert coding interview problem generator.

Career: ${career}
Topic: ${topic}

Generate exactly 5 coding practice problems.

IMPORTANT RULES:

1. Every problem must be directly related to the given topic.
2. Do NOT generate generic questions unrelated to the topic.
3. Questions should be suitable for coding practice.
4. Difficulty should range from Easy to Medium.
5. Problems should follow a LeetCode-style format.
6. Include problem description.
7. Include at least one example for every problem.
8. Include constraints.
9. Provide Java starter code.
10. Provide Python starter code.
11. Return ONLY valid JSON.
12. Do NOT use markdown.
13. Do NOT use \`\`\`json.
14. Do NOT add any explanation outside JSON.

Return exactly this structure:

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


  const chatCompletion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      model: "openai/gpt-oss-120b",

      temperature: 0.5,
    });


  return chatCompletion.choices[0].message.content;
};


// =====================================================
// EXPORT FUNCTIONS
// =====================================================

module.exports = {
  generateRoadmap,
  generateCodingQuestions,
};