import "./App.css";
import ReactPlayer from "react-player";
import useVideos from "./useVideos";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

function App() {
  const [videos, setVideos, currentVideoIndex, loadNextVideo] = useVideos();
  const [playing, setPlaying] = useState(true);

  const likeCurrentVideo = () => {
    const newVideos = [...videos];
    newVideos[currentVideoIndex].favourite =
      !newVideos[currentVideoIndex].favourite;
    setVideos(newVideos);
  };

  const [debounceTimeoutId, setDebounceTimeoutId] = useState(-1);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      loadNextVideo(currentVideoIndex + 1);
    },
    onTap: () => {
      // we need to debounce the tap event to distinguish between single and double tap
      clearTimeout(debounceTimeoutId);

      const timeoutId = setTimeout(() => {
        // if double tap...
        if (debounceTimeoutId !== -1) {
          likeCurrentVideo();
        } else {
          setPlaying(!playing);
        }
        setDebounceTimeoutId(-1);
      }, 200); // debounce time

      setDebounceTimeoutId(timeoutId);
    },
  });

  const [muted, setMuted] = useState(true);

  const onClickMute = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setMuted(!muted);
  };

  if (!videos[currentVideoIndex]) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div className="intro-text">SWIPE UP FOR MORE ☝️</div>
      <div className="swipe-container" {...handlers} />
      <div className="player-container">
        <ReactPlayer
          url={videos[currentVideoIndex].url || ""}
          width="100%"
          height="100%"
          muted={muted}
          playing={playing}
          config={{
            youtube: {
              playerVars: { showinfo: 0, controls: 0, modestbranding: 1 },
            },
          }}
        />
        {videos[currentVideoIndex].favourite ? (
          <div className="favourite">❤️</div>
        ) : null}
      </div>
      <div className="mute-control">
        <button onClick={onClickMute}>{muted ? "🔇" : "🔈"}</button>
      </div>
    </>
  );
}

export default App;
