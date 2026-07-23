import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function VerifyCertificate() {
  const { certificateId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyCertificate();
  }, []);

  const verifyCertificate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/certificate/verify/${certificateId}`
      );

      setCertificate(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">❌ Certificate Not Found</h2>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{ maxWidth: "700px" }}
    >
      <div className="card shadow-lg p-5 text-center">

        <h1 className="text-success">
          ✅ Certificate Verified
        </h1>

        <hr />

        <h3>{certificate.studentName}</h3>

        <h4 className="text-primary">
          {certificate.courseName}
        </h4>

        <br />

        <p>
          <strong>Certificate ID</strong>
        </p>

        <h5>{certificate.certificateId}</h5>

        <br />

        <p>
          <strong>Issue Date</strong>
        </p>

        <h5>
          {new Date(certificate.issueDate).toLocaleDateString()}
        </h5>

        <br />

        <div className="alert alert-success">
          This certificate is valid and officially issued by
          <strong> CourseHub.</strong>
        </div>

      </div>
    </div>
  );
}