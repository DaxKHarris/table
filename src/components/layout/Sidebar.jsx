/*
This is the nav bar that will be on the side of any display.
It should have no changes unless... you are an admin?

The sun moon is dark theme light theme but is not vital.
    It will be located to the right of the bar at the bottom
    It will also fade as the bar expands

The logo will be the only part in sight and when the user hovers
    over the nav bar it will expand to show the logo text.

    ^^ We can also move the logo to the top... We can test
    and see what we like

Also a profile picture will be visible above the logo icon.

All icons will have names appear when the user hovers the nav bar
    to increase the usability of the application
*/

import {
  Sprout,
  EllipsisVertical,
  Moon,
  Sun,
  Plus,
  History,
  Settings2,
} from "lucide-react";
import myImage from "../../assets/combined_icon.png";
import myIcon from "../../assets/dax_icon.jpg";

export default function Sidebar() {
  return (
    <section className="side-bar">
      <Sprout />
      <Settings2 />
      <History />
      <Plus />
      <EllipsisVertical />

      <div className="profile">
        <img src={myIcon} height="25px"></img>
        <p style={{ display: "inline" }}>DaxKHarris</p>{" "}
        {/* Replace profile dynamically */}
        {/*Make the image a circle later*/}
      </div>
      <img src={myImage} height="50px"></img>
      <div className="theme">
        <Moon />
        <Sun />
      </div>
    </section>
  );
}
