const Groq = require("groq-sdk");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});



// ===============================
// AI QUIZ GENERATOR USING GROQ
// ===============================

exports.generateQuiz = async (courseTitle) => {

  try {

    const completion = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      response_format: {
        type: "json_object"
      },

      messages: [

        {
          role: "system",
          content:
          "Generate quiz questions only in valid JSON format. No extra text."
        },


        {
          role: "user",
          content: `
Generate 5 multiple choice quiz questions.

Course:
${courseTitle}


JSON format:

{
 "questions":[
  {
   "question":"Question text",
   "options":[
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
   ],
   "answer":"Correct option"
  }
 ]
}

`
        }

      ],


      temperature: 0.2,

    });



    let response =
      completion.choices[0].message.content;



    console.log("Groq Response:", response);



    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();



    // Extract JSON only

    const start = response.indexOf("{");

    const end = response.lastIndexOf("}") + 1;


    const jsonData = response.substring(
      start,
      end
    );



    return JSON.parse(jsonData);



  } catch(error) {


    console.log(
      "Groq Quiz Error:",
      error.message
    );


    throw error;

  }

};