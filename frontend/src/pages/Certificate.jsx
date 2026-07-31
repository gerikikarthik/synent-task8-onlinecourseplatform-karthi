import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

export default function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    fetchCourse();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    generateCertificate();
  }, []);

  // ==========================
  // Fetch Course
  // ==========================

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`
      );

      setCourse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Generate Certificate
  // ==========================

  const generateCertificate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/certificate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCertificate(res.data);
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Certificate Generation Failed"
      );
    }
  };

  // ==========================
  // Download PDF
  // ==========================

  const downloadCertificate = () => {
    const input = document.getElementById("certificate");

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(`${course.title}-Certificate.pdf`);
    });
  };

  // ==========================
  // Loading
  // ==========================

  if (!course || !user) {
    return (
      <div className="container mt-5 text-center">
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#edf2f7,#f8fafc,#eef5ff)",
        padding: "50px 0",
      }}
    >
      {/* Success Message */}

      <div
        className="alert alert-success text-center"
        style={{
          width: "980px",
          margin: "0 auto 30px",
          borderRadius: "12px",
        }}
      >
        <h4>🎉 Certificate Generated Successfully!</h4>

        <p className="mb-0">
          Congratulations! Your certificate is ready.
        </p>
      </div>

      {/* ================= Certificate ================= */}

      <div
        id="certificate"
        style={{
          width: "1100px",
          minHeight: "760px",
          margin: "auto",
          padding: "55px",
          position: "relative",
          overflow: "hidden",

          background:
            "linear-gradient(135deg,#fffef8,#fff9e8,#fffefb)",

          border: "16px solid #d4af37",
          borderRadius: "18px",

          boxShadow:
            "0 20px 60px rgba(0,0,0,.18)",
        }}
      >
        {/* Inner Border */}

        <div
          style={{
            position: "absolute",
            inset: "18px",
            border: "2px solid #e7c55c",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />

        {/* Watermark */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            backgroundImage:
              "url('/images/Logo.jpeg')",

            backgroundRepeat: "no-repeat",

            backgroundPosition: "center",

            backgroundSize: "430px",

            opacity: 0.035,

            pointerEvents: "none",
          }}
        />

        {/* Decorative Corners */}

        <div
          style={{
            position: "absolute",
            top: "18px",
            left: "22px",
            fontSize: "56px",
            color: "#d4af37",
          }}
        >
          ❦
        </div>

        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "22px",
            fontSize: "56px",
            color: "#d4af37",
            transform: "scaleX(-1)",
          }}
        >
          ❦
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "18px",
            left: "22px",
            fontSize: "56px",
            color: "#d4af37",
            transform: "rotate(180deg)",
          }}
        >
          ❦
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "18px",
            right: "22px",
            fontSize: "56px",
            color: "#d4af37",
            transform:
              "rotate(180deg) scaleX(-1)",
          }}
        >
          ❦
        </div>

        {/* Main Content */}

        <div
          style={{
            position: "relative",
            zIndex: 5,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "Cinzel",
              fontSize: "58px",
              color: "#0b3d91",
              letterSpacing: "6px",
              marginBottom: "8px",
            }}
          >
            COURSEHUB
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            Empowering Future Professionals
          </p>

          <h2
            style={{
              fontFamily: "Cinzel",
              fontSize: "38px",
              color: "#c79a00",
              letterSpacing: "8px",
              marginTop: "30px",
            }}
          >
            CERTIFICATE OF COMPLETION
          </h2>

          <hr
            style={{
              width: "70%",
              margin: "25px auto 35px",
              border: "1px solid #e5cf7d",
            }}
          />
          <p
            style={{
              fontSize: "26px",
              color: "#444",
              marginBottom: "15px",
            }}
          >
            This Certificate is Proudly Presented To
          </p>

          <h1
            style={{
              fontFamily: "'Brush Script MT', cursive",
              fontSize: "70px",
              color: "#1565c0",
              fontWeight: "normal",
              margin: "15px 0 25px",
            }}
          >
            {user.name}
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#444",
              marginBottom: "15px",
            }}
          >
            For Successfully Completing
          </p>

          <h2
            style={{
              fontFamily: "Cinzel",
              fontSize: "38px",
              color: "#222",
              fontWeight: "bold",
              marginBottom: "25px",
            }}
          >
            {course.title}
          </h2>

          <p
            style={{
              width: "78%",
              margin: "auto",
              fontSize: "21px",
              lineHeight: "38px",
              color: "#444",
            }}
          >
            This certificate is proudly awarded in recognition of your
            outstanding dedication, commitment, and successful completion of
            the course requirements. We appreciate your passion for learning
            and wish you continued success in your professional career.
          </p>

          {/* Bottom Section */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "70px",
            }}
          >
            {/* QR Code */}

            <div style={{ textAlign: "center", width: "220px" }}>
              {certificate && (
                <QRCode
                  value={`https://synent-task8-onlinecourseplatform-karthi.vercel.app/verify-certificate/${certificate.certificateId}`}
                  size={100}
                />
              )}

              <p
                style={{
                  marginTop: "12px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Scan to Verify
              </p>
            </div>

            {/* Certificate Details */}

            <div
              style={{
                textAlign: "center",
                flex: 1,
              }}
            >
              <h4
                style={{
                  color: "#0b3d91",
                  marginBottom: "10px",
                }}
              >
                Certificate ID
              </h4>

              <div
                style={{
                  color: "#1565c0",
                  fontWeight: "bold",
                  fontSize: "26px",
                  marginBottom: "30px",
                }}
              >
                {certificate
                  ? certificate.certificateId
                  : "Generating..."}
              </div>

              <h4
                style={{
                  color: "#0b3d91",
                  marginBottom: "10px",
                }}
              >
                Date Issued
              </h4>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {new Date().toLocaleDateString()}
              </div>
            </div>
            {/* Premium Gold Seal */}

            <div
              style={{
                position: "absolute",
                right: "45px",
                bottom: "45px",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,#FFD700,#D4AF37,#B8860B)",
                border: "5px solid #fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "13px",
                lineHeight: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,.25)",
              }}
            >
              <div>
                COURSEHUB
                <br />
                ★★★★★
                <br />
                CERTIFIED
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Buttons */}

      <div
        className="text-center mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-success btn-lg"
          onClick={downloadCertificate}
        >
          📄 Download PDF
        </button>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => window.print()}
        >
          🖨 Print Certificate
        </button>

        <button
          className="btn btn-warning btn-lg"
          onClick={() =>
            navigate("/ai-roadmap", {
              state: {
                career: course.title,
                experience: "Beginner",
                dailyTime: "2 Hours",
              },
            })
          }
        >
          🤖 Generate AI Roadmap
        </button>
      </div>
    </div>
  );
}
