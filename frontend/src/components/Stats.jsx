export default function Stats() {

  const stats = [

    {
      number: "25K+",
      title: "Happy Students",
      icon: "👨‍🎓",
      color: "#0d6efd",
    },

    {
      number: "500+",
      title: "Premium Courses",
      icon: "📚",
      color: "#198754",
    },

    {
      number: "10K+",
      title: "Certificates",
      icon: "🎓",
      color: "#ffc107",
    },

    {
      number: "98%",
      title: "Success Rate",
      icon: "🏆",
      color: "#dc3545",
    }

  ];

  return (

    <section
      className="py-5"
      style={{
        background:
          "linear-gradient(135deg,#0d6efd,#6610f2)",
        color: "white",
      }}
    >

      <div className="container">

        <div className="row text-center">

          {stats.map((item, index) => (

            <div
              className="col-lg-3 col-md-6 mb-4"
              key={index}
            >

              <div className="p-4">

                <div
                  style={{
                    fontSize: "55px",
                  }}
                >
                  {item.icon}
                </div>

                <h1
                  className="fw-bold mt-3"
                  style={{
                    color: item.color,
                  }}
                >
                  {item.number}
                </h1>

                <h5>
                  {item.title}
                </h5>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}