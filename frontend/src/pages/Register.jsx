import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const res = await axios.post(
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/register",
  {
    name,
    email,
    password
  }
);
      alert("Registered Successfully 🚀");
      console.log(res.data);

      // Clear input fields
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={registerUser}>
        Register
      </button>
    </div>
  );
}