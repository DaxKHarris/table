import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize,
} from "lucide-react";
import timelapseVideo from "../../assets/video_temp.mp4";

const VideoOverlay = ({ videoSrc, onClose }) => {
  // Configuration variables - easy to change
  const ASSUMED_FPS = 30; // Change this based on your actual video
  const FRAME_SKIP_AMOUNT = 10; // How many frames to skip with the skip buttons

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Calculate frame from time and vice versa
  const timeToFrame = (time) => Math.floor(time * ASSUMED_FPS);
  const frameToTime = (frame) => frame / ASSUMED_FPS;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      setTotalFrames(timeToFrame(duration));
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentFrame(timeToFrame(video.currentTime));
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isDragging]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekToFrame = (frame) => {
    const video = videoRef.current;
    const clampedFrame = Math.max(0, Math.min(frame, totalFrames));
    setCurrentFrame(clampedFrame);
    video.currentTime = frameToTime(clampedFrame);
  };

  const stepFrame = (direction) => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);

    const targetFrame = currentFrame + direction;
    const clampedFrame = Math.max(0, Math.min(targetFrame, totalFrames));

    setCurrentFrame(clampedFrame);
    video.currentTime = frameToTime(clampedFrame);
  };

  const skipFrames = (direction) => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);

    const targetFrame = currentFrame + direction * FRAME_SKIP_AMOUNT;
    const clampedFrame = Math.max(0, Math.min(targetFrame, totalFrames));

    setCurrentFrame(clampedFrame);
    video.currentTime = frameToTime(clampedFrame);
  };

  const handleTimelineClick = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const frame = Math.floor(percentage * totalFrames);
    seekToFrame(frame);
  };

  const handleTimelineDrag = (e) => {
    if (!isDragging) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const frame = Math.floor(percentage * totalFrames);
    seekToFrame(frame);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    videoRef.current.playbackRate = speed;
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleClose = () => {
    videoRef.current?.pause();
    onClose?.();
  };

  // Stop dragging on mouse up anywhere
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleTimelineDrag);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleTimelineDrag);
      };
    }
  }, [isDragging]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Video container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl mx-4 bg-black rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200 group"
        >
          <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Video element with fullscreen button */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoSrc || timelapseVideo}
            className="w-full h-full cursor-pointer"
            onClick={togglePlayPause}
          />

          {/* Fullscreen button */}
          <button
            onClick={handleFullscreen}
            className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/70 hover:scale-110 transition-all duration-200"
            title="Toggle fullscreen"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Custom controls */}
        <div className="bg-gradient-to-t from-black/90 to-black/70 p-6">
          {/* Frame counter */}
          <div className="text-white text-sm font-mono mb-4 text-center">
            Frame {currentFrame} / {totalFrames}
          </div>

          {/* Timeline */}
          <div
            ref={timelineRef}
            className="relative h-2 bg-white/20 rounded-full mb-6 cursor-pointer group"
            onClick={handleTimelineClick}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleTimelineClick(e);
            }}
          >
            {/* Progress bar */}
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
            />

            {/* Scrubber handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-100 group-hover:scale-125"
              style={{
                left: `${(currentFrame / totalFrames) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Skip backward */}
            <button
              onClick={() => skipFrames(-1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title={`Skip ${FRAME_SKIP_AMOUNT} frames backward`}
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Frame step backward */}
            <button
              onClick={() => stepFrame(-1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Previous frame"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            {/* Frame step forward */}
            <button
              onClick={() => stepFrame(1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Next frame"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Skip forward */}
            <button
              onClick={() => skipFrames(1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title={`Skip ${FRAME_SKIP_AMOUNT} frames forward`}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Speed controls */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/60 text-sm">Speed:</span>
            {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                  playbackSpeed === speed
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Simple App component with just the button
const App = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <button onClick={() => setShowOverlay(true)}>Timelapse</button>

      {showOverlay && (
        <VideoOverlay
          videoSrc={timelapseVideo}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </>
  );
};

export default App;
