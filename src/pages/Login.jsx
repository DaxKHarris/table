import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "./Login/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const handleLoginSuccess = () => {
    navigate(returnUrl, { replace: true });
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
