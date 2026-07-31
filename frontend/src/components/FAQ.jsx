export default function FAQ() {

  const faqs = [

    {
      question: "How do I enroll in a course?",
      answer:
        "Open the course details page and click 'Buy Premium Course' to enroll.",
    },

    {
      question: "Will I receive a certificate?",
      answer:
        "Yes. After completing the course and quizzes, you can download your certificate.",
    },

    {
      question: "What is the AI Career Roadmap?",
      answer:
        "Our AI creates a personalized learning roadmap based on your selected course and experience level.",
    },

    {
      question: "Can I watch free videos before purchasing?",
      answer:
        "Yes. Every premium course includes a free preview video before payment.",
    },

    {
      question: "Can I access my course forever?",
      answer:
        "Yes. Once purchased, you will have lifetime access to the course.",
    },

    {
      question: "Can I download course notes?",
      answer:
        "Yes. Premium users can download PDF notes and study offline.",
    }

  ];

  return (

    <section
      className="py-5"
      style={{
        background: "#f8f9fa",
      }}
    >

      <div className="container">

        <div className="text-center mb-5">

          <span className="badge bg-info text-dark px-3 py-2 fs-6">
            ❓ FAQ
          </span>

          <h2 className="fw-bold mt-3">
            Frequently Asked Questions
          </h2>

          <p className="text-muted">
            Find answers to the most common questions.
          </p>

        </div>

        <div
          className="accordion"
          id="faqAccordion"
        >

          {faqs.map((faq, index) => (

            <div
              className="accordion-item"
              key={index}
            >

              <h2
                className="accordion-header"
                id={`heading${index}`}
              >

                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                >

                  {faq.question}

                </button>

              </h2>

              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                data-bs-parent="#faqAccordion"
              >

                <div className="accordion-body">

                  {faq.answer}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}