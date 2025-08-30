import Sidebar from "../components/layout/Sidebar";
import PlantDashboard from "./device/SensorData";

export default function DevicePage({ device, onBack, onLogout }) {
  return (
    <>
      <Sidebar />
      {/* Need to insert top part of dashboard still */}
      <PlantDashboard />
    </>
  );
}
