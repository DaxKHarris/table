import MenuBar from "../common/MenuBar";
import InputForm from "../forms/LoginForm";

export default function Login({ onSuccess }) {
  return (
    <>
      <MenuBar />
      <InputForm onSuccess={onSuccess} />
    </>
  );
}
