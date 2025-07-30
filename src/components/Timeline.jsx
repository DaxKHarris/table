import { useRef, useState, useEffect } from "react";

function Timeline() {
  const endTime = 720;
  const tickCount = 13;
  const sidePadding = 100;

  const [tickSpacing, setTickSpacing] = useState(0);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const usableWidth = screenWidth - sidePadding * 2;
    const spacing = usableWidth / (tickCount - 1) - 2;
    setTickSpacing(spacing);
  }, []);

  return (
    <div className="timeline">
      {tickSpacing > 0 && (
        <>
          {Ticks(endTime, tickCount, tickSpacing)}
          {Events(endTime, tickCount, tickSpacing)}
        </>
      )}
    </div>
  );
}

function Ticks(endTime, tickCount, tickSpacing) {
  const ticks = [];

  for (let i = 0; i < tickCount; i++) {
    const left = Math.round(i * tickSpacing);

    ticks.push(<div key={i} className="tick" style={{ left: `${left}px` }} />);
  }

  return ticks;
}

function Events(endTime, tickCount, tickSpacing) {
  const events = [
    { name: "Heyo", time: 360 },
    { name: "yes", time: 60 },
  ];

  return events.map((event, i) => {
    if (event.time > endTime) return null;

    const progress = event.time / endTime;
    const left = Math.round(progress * (tickSpacing * (tickCount - 1)));

    return (
      <div
        key={i}
        className="event"
        title={event.name}
        style={{ left: `${left}px` }}
      />
    );
  });
}

export default Timeline;
