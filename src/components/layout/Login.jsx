import InputForm from "../../pages/Login/LoginForm";
import Sidebar from "./Sidebar";

export default function Login({ onSuccess }) {
  return (
    <>
      <Sidebar />
      <InputForm onSuccess={onSuccess} />
    </>
  );
}
