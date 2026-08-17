const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateRoadmap = async (career, experience, dailyTime) => {
  const prompt = `
Create a learning roadmap.

Career: ${career}
Experience: ${experience}
Daily Study Time: ${dailyTime}

Return ONLY valid JSON:

{
  "title": "",
  "duration": "",
  "modules": []
}
`;

  const chatCompletion = await groq.chat.completions.create({
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

module.exports = { generateRoadmap };