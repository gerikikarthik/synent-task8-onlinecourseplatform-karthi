import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const API =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";


export default function Quiz() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [questions,setQuestions] = useState([]);

  const [loading,setLoading] = useState(true);

  const [currentQuestion,setCurrentQuestion] = useState(0);

  const [answers,setAnswers] = useState({});



  useEffect(()=>{

    loadQuiz();

  },[id]);





  const loadQuiz = async()=>{

    try{

      const token =
      localStorage.getItem("token");


      const res = await axios.get(
        `${API}/quiz/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      console.log("QUIZ DATA",res.data);


      setQuestions(
        res.data.questions ||
        res.data.quiz?.questions ||
        []
      );


    }
    catch(error){

      console.log(
        "QUIZ ERROR",
        error.response?.data
      );


      alert(
        error.response?.data?.message ||
        "Quiz not available"
      );


    }
    finally{

      setLoading(false);

    }

  };





  const selectAnswer=(questionId,option)=>{


    setAnswers({

      ...answers,

      [questionId]:option

    });


  };






  const submitQuiz=async()=>{


    let score=0;



    questions.forEach((q)=>{


      if(
        answers[q._id] === q.answer
      ){

        score++;

      }


    });



    const percentage = Math.round(
      (score/questions.length)*100
    );





    try{


      const token =
      localStorage.getItem("token");



      await axios.post(

        `${API}/quiz/submit`,

        {

          courseId:id,

          answers

        },

        {

          headers:{
            Authorization:`Bearer ${token}`
          }

        }

      );


    }
    catch(error){

      console.log(error);

    }






    if(percentage >= 70){


      alert(
        `🎉 Passed\nScore : ${percentage}%`
      );


      navigate(
        `/certificate/${id}`
      );


    }
    else{


      alert(
        `❌ Failed\nScore : ${percentage}%`
      );


      const retry =
      window.confirm(
        "Retry Quiz?"
      );


      if(retry){

        setCurrentQuestion(0);

        setAnswers({});


      }
      else{

        navigate(
          `/learn/${id}`
        );

      }


    }


  };






  if(loading){

    return(

      <div className="container text-center mt-5">

        <h2>
          Loading Quiz...
        </h2>

      </div>

    );

  }







  if(questions.length===0){

    return(

      <div className="container text-center mt-5">

        <h2>
          No Quiz Found
        </h2>


      </div>

    );

  }






  const question =
  questions[currentQuestion];





  return(

    <div
    className="container py-5"
    style={{
      minHeight:"100vh",
      background:"#f8f9fa"
    }}
    >


      <div className="row justify-content-center">


        <div className="col-lg-8">


          <div className="card shadow border-0">


            <div className="card-body p-5">



              <h2 className="text-center text-primary mb-4">

                📝 Course Quiz

              </h2>





              <h5>

                Question {currentQuestion+1}
                /
                {questions.length}

              </h5>





              <div className="progress mb-4">

                <div

                className="progress-bar"

                style={{
                  width:
                  `${((currentQuestion+1)/questions.length)*100}%`
                }}

                >

                </div>

              </div>







              <h4 className="mb-4">

                {question.question}

              </h4>






              {
                question.options.map(
                  (option,index)=>(


                    <div
                    key={index}
                    className="card p-3 mb-3"
                    style={{

                      cursor:"pointer",

                      border:
                      answers[question._id]===option
                      ?
                      "2px solid blue"
                      :
                      "1px solid #ddd"

                    }}
                    onClick={()=>{

                      selectAnswer(
                        question._id,
                        option
                      )

                    }}
                    >


                      <input

                      type="radio"

                      checked={
                        answers[question._id]===option
                      }

                      readOnly

                      />

                      {" "}

                      {option}



                    </div>


                  )
                )
              }








              <div className="d-flex justify-content-between mt-4">



                <button

                className="btn btn-secondary"

                disabled={
                  currentQuestion===0
                }

                onClick={()=>{

                  setCurrentQuestion(
                    currentQuestion-1
                  )

                }}

                >

                  ⬅ Previous

                </button>






                {

                  currentQuestion <
                  questions.length-1

                  ?

                  <button

                  className="btn btn-primary"

                  onClick={()=>{

                    setCurrentQuestion(
                      currentQuestion+1
                    )

                  }}

                  >

                    Next ➡

                  </button>


                  :


                  <button

                  className="btn btn-success"

                  onClick={submitQuiz}

                  >

                    Submit Quiz ✅

                  </button>


                }



              </div>



            </div>


          </div>


        </div>


      </div>


    </div>


  );


}