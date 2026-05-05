import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { signUp, setActive, isLoaded } = useSignUp();

  const [role, setRole] = useState("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!isLoaded || !signUp) {
      alert("Clerk not ready");
      return;
    }

    try {
      const res = await signUp.create({
        emailAddress: email,
        password,
      });

      await setActive({ session: res.createdSessionId });

      localStorage.setItem("role", role);

      navigate("/");
    } catch (err: any) {
      console.log(err);
      alert(err?.errors?.[0]?.message || "Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 border rounded w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          placeholder="Email"
          className="w-full p-2 border mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full p-2 border mb-4"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="STUDENT">Student</option>
          <option value="TRAINER">Trainer</option>
          <option value="INSTITUTION">Institution</option>
          <option value="PROGRAMME_MANAGER">Programme Manager</option>
          <option value="MONITORING_OFFICER">Monitoring Officer</option>
        </select>

        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white w-full p-2"
        >
          Register
        </button>
      </div>
    </div>
  );
}