import { useRef, useState } from "react";
import getUserAuth from "../../services/authService";

export default function LoginForm({ onSuccess }) {
  const userRef = useRef();
  const passRef = useRef();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const username = userRef.current.value;
    const password = passRef.current.value;
    try {
      await getUserAuth(username, password);

      onSuccess?.();
      if (passRef.current) passRef.current.value = "";
    } catch (err) {
      if (err.code === "INVALID_CREDENTIALS") {
        setError("Invalid username or password");
      } else if (err.message?.startsWith("Login Failed")) {
        setError(err.message);
      } else {
        console.log("You are here", err);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={userRef} placeholder="Username" />
      <input type="password" ref={passRef} placeholder="Password" />
      <button>Login</button>
    </form>
  );
}
