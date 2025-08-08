import Logger from "./components/Logger.jsx";
import MenuBar from "./components/MenuBar.jsx";
import SensorData from "./components/SensorData.jsx";
import Timeline from "./components/Timeline.jsx";
import InputForm from "./components/InputForm.jsx";
let auth = true;
function App() {
  return (
    <>
      {auth ? Dashboard(): Login()}
    </>
  );
}

export default App;

function Dashboard() {
  return (
    <>
      <MenuBar />
      <SensorData />
      <Logger />
      <Timeline />
    </>
  )
}

function Login(){
  return (
    <>
    <MenuBar />
    <InputForm />
    </>
  )
}