import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoUrl, onPlayerReady, onPlayerError }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Destroy any existing player instance
    if (playerRef.current) {
      playerRef.current.dispose();
    }

    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      responsive: true,
      sources: [
        {
          src: decodeURIComponent(videoUrl),
          type: 'application/x-mpegURL', // HLS stream
          withCredentials: true, // important for signed cookies
        },
      ],
    });

    player.ready(() => {
      if (onPlayerReady) onPlayerReady(player);
    });

    player.on('error', () => {
      const err = player.error();
      if (onPlayerError) onPlayerError(err);
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrl]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered"
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
