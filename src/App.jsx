import { useAuth } from "./hooks/useAuth";
import Dashboard from "./components/layout/Dashboard";
import Login from "./components/layout/Login";

export default function App() {
  const { authed, loading, handleLoginSuccess } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or your loading component
  }

  return authed ? <Dashboard /> : <Login onSuccess={handleLoginSuccess} />;
}
