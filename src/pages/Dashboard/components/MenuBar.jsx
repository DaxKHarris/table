import { useState } from "react";
import myImage from './../../../assets/ayt_icon.png';
import myText from './../../../assets/ayt_text.png'
function MenuBar() {
  let auth = false
  const items = ["Dashboard", "Settings", "Hey", "Larry The Cucumber"];
  const [selected, setSelected] = useState("Dashboard");

  const updateSelected = (item) => {
    setSelected(item);
  };

  return (
    <section className="menu">
      <img src={myImage} height="100px"></img>
      <img src={myText} height="100px"></img>
      {auth && items.map((item, index) => (
        <button
          key={index}
          onClick={() => updateSelected(item)}
          style={{
            backgroundColor: item === selected ? "lightblue" : "white",
          }}
        >
          {item}
        </button>
      ))}
    </section>
  );
}

export default MenuBar;
