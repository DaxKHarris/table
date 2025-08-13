import MenuBar from "../common/MenuBar";
import SensorData from "../sensors/SensorData";
import Logger from "../logging/Logger";
import Timeline from "../timeline/Timeline";

export default function Dashboard() {
  return (
    <>
      <MenuBar />
      <SensorData />
      <Logger />
      <Timeline />
    </>
  );
}
