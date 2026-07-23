import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

export default function Certificate() {

  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    getCourse();

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    setUser(storedUser);

    generateCertificate();

  }, []);

  // ===========================
  // GET COURSE
  // ===========================

  const getCourse = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`
      );

      setCourse(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // ===========================
  // GENERATE CERTIFICATE
  // ===========================

  const generateCertificate = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(

        `http://localhost:5000/api/certificate/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      setCertificate(res.data);

    } catch (err) {

      console.error("Certificate Error:", err);

      alert(
        err.response?.data?.message ||
        "Certificate generation failed"
      );

    }

  };

  // ===========================
  // DOWNLOAD PDF
  // ===========================
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

  if (!course || !user) {

    return (
      <div className="container mt-5 text-center">
        <h2>Loading...</h2>
      </div>
    );

  }

  return (
<div
  className="container py-5"
  style={{
    background: "#eef2f7",
    minHeight: "100vh",
  }}
>

  <div
    id="certificate"
    style={{
      width: "950px",
      margin: "auto",
      padding: "35px",
      border: "15px solid #c9a227",
      borderRadius: "20px",
      background: "linear-gradient(135deg,#fffdf5,#fef9e7,#fffdf5)",
      boxShadow: "0 0 30px rgba(0,0,0,.25)",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >

    {/* Watermark */}

    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: "140px",
        fontWeight: "bold",
        color: "#d4af37",
        opacity: 0.05,
        userSelect: "none",
      }}
    >
      COURSEHUB
    </div>

    {/* Logo */}

    <img
      src="/logo.png"
      alt="CourseHub Logo"
      style={{
        width: "100px",
        marginBottom: "15px",
      }}
    />

    <h1
      style={{
        fontFamily: "Cinzel",
        fontSize: "46px",
        color: "#0b3d91",
        letterSpacing: "5px",
        marginBottom: "5px",
      }}
    >
      COURSEHUB
    </h1>

    <p
      style={{
        color: "#777",
        fontSize: "18px",
        fontStyle: "italic",
        marginBottom: "25px",
      }}
    >
      Empowering Future Professionals
    </p>

    <h2
      style={{
        fontFamily: "Cinzel",
        color: "#c79a00",
        letterSpacing: "6px",
        fontSize: "34px",
        marginBottom: "30px",
      }}
    >
      CERTIFICATE OF COMPLETION
    </h2>

    <hr
      style={{
        width: "70%",
        margin: "25px auto",
      }}
    />

    <p style={{ fontSize: "22px" }}>
      This Certificate is Proudly Presented To
    </p>

    <h1
      style={{
        fontFamily: "Great Vibes",
        fontSize: "58px",
        color: "#1565c0",
        margin: "20px 0",
      }}
    >
      {user.name}
    </h1>

    <p
      style={{
        fontSize: "22px",
        marginTop: "25px",
      }}
    >
      For Successfully Completing
    </p>

    <h2
      style={{
        fontFamily: "Cinzel",
        color: "#222",
        fontSize: "30px",
      }}
    >
      {course.title}
    </h2>

    <br />

    <p
      style={{
        fontSize: "20px",
        lineHeight: "35px",
      }}
    >
      Congratulations on successfully completing the course.
      <br />
      We wish you continued success in your learning journey
      and future career.
    </p>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
      }}
    >
      {/* QR Code */}

      <div style={{ textAlign: "center" }}>
{certificate && (
  <QRCode
    value={`http://localhost:5173/verify-certificate/${certificate.certificateId}`}
    size={75}
    bgColor="#ffffff"
    fgColor="#000000"
  />
)}
                <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          Verify Certificate
        </p>

      </div>

      {/* Certificate Details */}

      <div style={{ textAlign: "center" }}>

        <strong>Date Issued</strong>

        <br />

        {new Date().toLocaleDateString()}

        <br />
        <br />

        <strong>Certificate ID</strong>

        <br />

        <span
          style={{
            color: "#0b3d91",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {certificate
            ? certificate.certificateId
            : "Generating..."}
        </span>

      </div>

      {/* Signature */}

      <div
        style={{
          textAlign: "center",
          width: "180px",
        }}
      >

        <strong
          style={{
            fontSize: "20px",
            color: "#222",
          }}
        >
          Karthik G
        </strong>

        <br />

        <span
          style={{
            fontSize: "15px",
            color: "#666",
          }}
        >
          Founder & CEO
        </span>

        <br />

        <span
          style={{
            fontSize: "17px",
            color: "#1565c0",
            fontWeight: "bold",
          }}
        >
          CourseHub
        </span>

      </div>

    </div>

    {/* Gold Seal */}

    <div
      style={{
        position: "absolute",
        right: "25px",
        bottom: "25px",
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        background: "#d4af37",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold",
        boxShadow: "0 0 15px rgba(0,0,0,.3)",
        fontSize: "16px",
      }}
    >
      <div>
        COURSEHUB
        <br />
        CERTIFIED
      </div>
    </div>
  </div> {/* Certificate End */}

  {/* Buttons */}

  <div className="text-center mt-5">

    <button
      className="btn btn-success btn-lg me-3"
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

  </div>

</div>
  );
}