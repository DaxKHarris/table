import Logger from "./components/Logger.jsx";
import MenuBar from "./components/MenuBar.jsx";
import SensorData from "./components/SensorData.jsx";

function App() {
  return (
    <div>
      <MenuBar />
      <SensorData />
      <Logger />
    </div>
  );
}

export default App;
