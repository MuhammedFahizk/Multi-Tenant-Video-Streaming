// src/components/VideoPlayer.jsx
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';


const VideoPlayer = ({ videoUrl, isAuthenticated, onPlayerReady, onPlayerError }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentQuality, setCurrentQuality] = useState('360p');
  const [hasError, setHasError] = useState(false); // 🔴 new state

  const qualityOptions = [
    { label: '360p', value: '360p' },
    { label: '480p', value: '480p' }, 
    { label: '720p', value: '720p' },
    { label: '1080p', value: '1080p' }
  ];

  useEffect(() => {
    if (!playerRef.current && videoRef.current && isAuthenticated && videoUrl && !hasError) {
      const videoElement = videoRef.current;

      playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        liveui: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        html5: {
          vhs: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            fastQualityChange: true
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        sources: [{
          src: videoUrl,
          type: 'application/x-mpegURL'
        }]
      }, function() {
        if (onPlayerReady) onPlayerReady();
      });

      // 🔴 handle error and stop retry
      playerRef.current.on('error', function() {
        const error = this.error();
        console.error('Video player error:', error);
        setHasError(true); // lock further calls
        if (onPlayerError) onPlayerError(error);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isAuthenticated, videoUrl, onPlayerReady, onPlayerError, hasError]);

  // Only update src if no error
  useEffect(() => {
    if (playerRef.current && videoUrl && isAuthenticated && !hasError) {
      playerRef.current.src({
        src: videoUrl,
        type: 'application/x-mpegURL'
      });
    }
  }, [videoUrl, isAuthenticated, hasError]);

  const handleQualityChange = (quality) => {
    setCurrentQuality(quality);
    console.log('Quality change requested to:', quality);
  };


  if (!isAuthenticated) {
    return (
      <div className="card video-section">
        <h3>🎬 Video Player</h3>
        <div className="video-container">
          <div style={{ 
            background: '#f8f9fa', 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '10px',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <p style={{ color: '#6c757d', fontSize: '1.2em', textAlign: 'center' }}>
              🔒 Please authenticate to start streaming
            </p>
            <div style={{ 
              background: '#e9ecef', 
              padding: '10px', 
              borderRadius: '5px',
              fontSize: '0.9em',
              color: '#495057',
              textAlign: 'center'
            }}>
              Enter your API credentials and click<br />"Authenticate & Play Video"
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="card video-section">
        <h3>🎬 Video Player</h3>
        <div className="video-container">
          <div style={{ 
            background: '#f8f9fa', 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '10px'
          }}>
            <p style={{ color: '#6c757d', fontSize: '1.2em' }}>
              ⏳ Preparing video stream...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card video-section">
      <h3>🎬 Video Player</h3>
      <div style={{ 
        marginBottom: '15px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span style={{ fontSize: '0.9em', color: '#666' }}>
          Status: <strong style={{ color: '#28a745' }}>Streaming Ready</strong>
        </span>
        <span style={{ fontSize: '0.9em', color: '#666' }}>
          Format: HLS
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.9em', color: '#666' }}>Quality:</span>
          <select 
            value={currentQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            style={{ 
              padding: '5px 10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '0.8em'
            }}
          >
            {qualityOptions.map(quality => (
              <option key={quality.value} value={quality.value}>
                {quality.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="video-container">
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
            controls
            preload="auto"
            playsInline
          >
            <p className="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
                supports HTML5 video
              </a>
            </p>
          </video>
        </div>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#666' }}>
        <div style={{ marginBottom: '5px' }}>
          Stream URL: <code style={{ background: '#f8f9fa', padding: '2px 5px', borderRadius: '3px' }}>
            {videoUrl}
          </code>
        </div>
        <div>
          Current Quality: <strong>{currentQuality}</strong>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer