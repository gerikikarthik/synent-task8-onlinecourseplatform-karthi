import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function Quiz() {

  const { id } = useParams();
  const navigate = useNavigate();


  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});



  useEffect(() => {

    loadQuiz();

  }, [id]);




  const loadQuiz = async () => {

    try {


      const token = localStorage.getItem("token");


      const res = await axios.get(

        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/quiz/${id}`,

        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }

      );



      setQuestions(

        res.data.quiz?.questions || []

      );



    } catch(error){


      console.log(
        "QUIZ ERROR:",
        error.response?.data || error.message
      );


      alert(
        error.response?.data?.message ||
        "Quiz not available"
      );


    } finally {


      setLoading(false);


    }

  };






  const selectAnswer = (questionId, option)=>{


    setAnswers((prev)=>({

      ...prev,

      [questionId]: option

    }));


  };






  const submitQuiz = async()=>{


    let score = 0;



    questions.forEach((q)=>{


      if(
        answers[q._id] === q.answer
      ){

        score++;

      }


    });




    const percentage = Math.round(

      (score / questions.length) * 100

    );





    try{


      const token = localStorage.getItem("token");



      await axios.post(

        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/quiz/submit",

        {
          courseId:id,
          answers:answers
        },

        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }

      );



    }catch(error){


      console.log(error);


    }






    if(percentage >= 70){


      alert(
        `🎉 Congratulations!\nScore: ${percentage}%`
      );



      navigate(`/certificate/${id}`);



    }else{


      alert(
        `❌ Failed\nScore: ${percentage}%`
      );



      const retry =
        window.confirm(
          "Retry Quiz?"
        );



      if(retry){


        setCurrentQuestion(0);

        setAnswers({});


      }else{


        navigate(`/learn/${id}`);


      }


    }


  };







  if(loading){


    return (

      <div className="container text-center mt-5">

        <h2>
          Loading Quiz...
        </h2>

      </div>

    );

  }







  if(questions.length === 0){


    return (

      <div className="container text-center mt-5">


        <h2>
          No Quiz Found
        </h2>


      </div>

    );

  }







  const question =
    questions[currentQuestion];







  return (


    <div
      className="container py-5"
      style={{
        minHeight:"100vh",
        background:"#f8f9fa"
      }}
    >



      <div className="row justify-content-center">


        <div className="col-lg-8">


          <div
            className="card shadow-lg border-0"
            style={{
              borderRadius:"20px"
            }}
          >



            <div className="card-body p-5">



              <h2
                className="text-center mb-4"
                style={{
                  color:"#0d6efd",
                  fontWeight:"bold"
                }}
              >

                📝 Course Quiz

              </h2>





              <div className="mb-4">


                <div className="d-flex justify-content-between">

                  <span>
                    Question {currentQuestion+1}
                  </span>


                  <span>
                    {questions.length}
                  </span>


                </div>





                <div
                  className="progress mt-2"
                  style={{
                    height:"10px"
                  }}
                >


                  <div

                    className="progress-bar bg-success"

                    style={{

                      width:
                      `${((currentQuestion+1)/
                      questions.length)*100}%`

                    }}

                  ></div>


                </div>



              </div>







              <h4 className="mb-4">

                {question.question}

              </h4>







              <div className="d-grid gap-3">



                {
                  question.options.map(
                    (option,index)=>(


                    <label

                      key={index}

                      className="card p-3"

                      style={{

                        cursor:"pointer",

                        border:

                        answers[question._id] === option

                        ?

                        "2px solid #0d6efd"

                        :

                        "1px solid #ddd"

                      }}

                    >



                      <input

                        type="radio"

                        name={question._id}

                        checked={
                          answers[question._id] === option
                        }

                        onChange={()=>


                          selectAnswer(
                            question._id,
                            option
                          )

                        }


                        style={{
                          marginRight:"10px"
                        }}

                      />



                      {option}



                    </label>


                  ))

                }



              </div>








              <div
                className="d-flex justify-content-between mt-5"
              >



                <button

                  className="btn btn-secondary"

                  disabled={
                    currentQuestion===0
                  }

                  onClick={()=>


                    setCurrentQuestion(
                      currentQuestion-1
                    )

                  }

                >

                  ⬅ Previous

                </button>







                {

                  currentQuestion < questions.length-1

                  ?

                  (

                  <button

                    className="btn btn-primary"

                    onClick={()=>


                      setCurrentQuestion(
                        currentQuestion+1
                      )

                    }

                  >

                    Next ➡

                  </button>


                  )


                  :


                  (

                  <button

                    className="btn btn-success"

                    onClick={submitQuiz}

                  >

                    ✅ Submit Quiz

                  </button>


                  )

                }



              </div>





            </div>


          </div>



        </div>


      </div>



    </div>


  );


}