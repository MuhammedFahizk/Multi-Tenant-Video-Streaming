import React from 'react';
import VideoJS from './VideoJS';

const VideoPlayer = ({ videoUrl, isAuthenticated, onPlayerReady, onPlayerError }) => {
  const playerRef = React.useRef(null);

  // Video.js options with HLS support
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    liveui: true,
    html5: {
      vhs: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true
      }
    },
    sources: videoUrl ? [{
      src: videoUrl,
      type: 'application/x-mpegURL'
    }] : []
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // Handle player events
    player.on('waiting', () => {
      console.log('Player is waiting');
    });

    player.on('loadeddata', () => {
      console.log('Video data loaded');
    });

    player.on('error', (e) => {
      console.error('Player error:', e);
      const error = player.error();
      onPlayerError && onPlayerError({
        message: error ? error.message : 'Unknown video player error',
        code: error ? error.code : 0
      });
    });

    player.on('loadedmetadata', () => {
      console.log('Video metadata loaded');
    });

    onPlayerReady && onPlayerReady();
  };

  return (
    <div className="video-player-container">
      <h3>Video Player</h3>
      {!isAuthenticated ? (
        <div className="video-placeholder">
          <p>🔒 Please authenticate to load the video stream</p>
        </div>
      ) : !videoUrl ? (
        <div className="video-placeholder">
          <p>⏳ Loading video URL...</p>
        </div>
      ) : (
        <>
          <div className="video-url-info">
            <small>Stream URL: {videoUrl}</small>
          </div>
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;