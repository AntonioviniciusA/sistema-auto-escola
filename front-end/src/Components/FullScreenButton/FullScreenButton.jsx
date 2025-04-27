import React, { useState } from "react";
import "./FullScreenButton.css";
import { Maximize2, Minimize2 } from "lucide-react";

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <button className="fullscreen-btn" onClick={toggleFullScreen}>
      {isFullScreen ? <Minimize2 size={28} /> : <Maximize2 size={28} />}
    </button>
  );
};

export default FullScreenButton;
