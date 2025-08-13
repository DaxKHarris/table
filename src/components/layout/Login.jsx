import MenuBar from "../common/MenuBar";
import InputForm from "../forms/InputForm";

export default function Login({ onSuccess }) {
  return (
    <>
      <MenuBar />
      <InputForm onSuccess={onSuccess} />
    </>
  );
}
