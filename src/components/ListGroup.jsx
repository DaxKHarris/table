import { useEffect, useState } from "react";

function SensorRow({ name, value, setValue, type }) {
  return (
    <tr className="sensor-row">
      <td>{name}:</td> <td>{value}</td> <td>{setValue}</td>
      <td>
        <span className="sensor-indicator">a</span>
      </td>
      {type === "sensor" && (
        <>
          <td>
            <button
              className="edit-button"
              onClick={() => console.log(`${type}"sensor"it button clicked!`)}
            >
              edit
            </button>
          </td>
          <td>
            <button className="info-hover">i</button>
          </td>
        </>
      )}
    </tr>
  );
}

// api call
// useEffect(() => {
//   console.log("Component mounted!");
// }, []);

// Temp values
const sensor = "Acid";
const currentValue = 6.3;
const targetValue = 6.5;

function SensorContainer() {
  return (
    <div className="sensor-container">
      <table>
        <SensorRow name="Name" value="Value" setValue="Target" />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
        <SensorRow
          name={sensor}
          value={currentValue}
          setValue={targetValue}
          type="sensor"
        />
      </table>
    </div>
  );
}

export default SensorContainer;

// 7 sensors
//
