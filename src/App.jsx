import Sidebar from "./components/layout/Sidebar";
import { useAuth } from "./hooks/useAuth";
import PlantDashboard from "./pages/device/SensorData";
import MainBoard from "./pages/Dashboard";
import Login from "./pages/Login";
export default function App() {
  let userAuthed = true;
  return <>{userAuthed ? <MainBoard /> : <Login />}</>;
}
