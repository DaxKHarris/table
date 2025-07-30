import Logger from "./components/Logger.jsx";
import MenuBar from "./components/MenuBar.jsx";
import SensorData from "./components/SensorData.jsx";
import Timeline from "./components/Timeline.jsx";

function App() {
  return (
    <div>
      <MenuBar />
      <SensorData />
      <Logger />
      <Timeline />
    </div>
  );
}

export default App;
