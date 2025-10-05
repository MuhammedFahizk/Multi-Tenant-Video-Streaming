import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Video.js HTTP Streaming (HLS) is automatically included in modern video.js versions
// No need to import separately if using video.js v7+

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoElement.classList.add('vjs-default-skin');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        console.log('Player is ready');
        onReady && onReady(player);
      });

    } else {
      // Update existing player
      const player = playerRef.current;
      if (player) {
        player.src(options.sources);
        player.autoplay(options.autoplay);
      }
    }
  }, [options, onReady]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (playerRef.current) {
        if (!playerRef.current.isDisposed()) {
          playerRef.current.dispose();
        }
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;