export default function Companies() {

  const companies = [

    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Infosys",
    "TCS"

  ];

  return (

    <section className="py-5 bg-light">

      <div className="container text-center">

        <h2 className="fw-bold mb-5">

          Trusted By Learners Working At

        </h2>

        <div className="row">

          {companies.map((company, index) => (

            <div
              className="col-lg-2 col-md-4 col-6 mb-4"
              key={index}
            >

              <div
                className="shadow rounded p-4 bg-white"
              >

                <h4 className="fw-bold">

                  {company}

                </h4>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}