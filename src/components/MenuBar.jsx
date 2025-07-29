import { useState } from "react";

function MenuBar() {
  const items = ["Dashboard", "Settings", "Hey", "Larry The Cucumber"];
  const [selected, setSelected] = useState("Dashboard");

  const updateSelected = (item) => {
    setSelected(item);
  };

  return (
    <section className="menu">
      {items.map((item, index) => (
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
