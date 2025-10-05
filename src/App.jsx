import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import VideoPlayer from './components/VideoPlayer'; // Make sure this import path is correct
import { authService } from './services/authService';
import './App.css';

function App() {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: false,
    message: '',
    error: '',
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [requestLog, setRequestLog] = useState(['Application started. Ready for authentication.']);

  const addToLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
    setRequestLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 10)]);
  };

  const handleAuthenticate = async (formData) => {
    setAuthStatus({
      isAuthenticated: false,
      isLoading: true,
      message: `Starting authentication for tenant: ${formData.tenantDomain}`,
      error: '',
    });
    addToLog(`Starting authentication for tenant: ${formData.tenantDomain}`);

    try {
      // Step 1: Generate signed URL for folder-level access
      addToLog(`Calling endpoint to generate signed URL for folder: ${formData.path}`);
      const authResult = await authService.generateSignedUrl(
        formData.apiKey,
        formData.accountTypeId,
        formData.tenantDomain,
        formData.path // e.g., "/hls_content/"
      );

      if (!authResult.success) {
        throw new Error(authResult.error || 'Failed to generate signed URL');
      }

      const { authUrl, playlistUrl, expiresAt } = authResult.data;
      if (!authUrl || !playlistUrl) {
        throw new Error('Invalid response: missing authUrl or playlistUrl');
      }

      // Log the URLs for debugging
      addToLog(`authUrl: ${authUrl}`);
      addToLog(`playlistUrl: ${playlistUrl}`);

      // Step 2: Call authUrl to set signed cookies
      addToLog(`Calling authUrl to set signed cookies: ${authUrl}`);
      const cookieResponse = await fetch(authUrl, {
        method: 'GET',
        credentials: 'include', // Ensure cookies are set in the browser
      });

      if (!cookieResponse.ok) {
        throw new Error(`Failed to set signed cookies: ${cookieResponse.status} ${cookieResponse.statusText}`);
      }

      // Verify cookies were set
      const storedCookies = document.cookie;
      addToLog(`Stored cookies: ${storedCookies}`);

      // Step 3: Set the playlist URL for the video player
      setVideoUrl(playlistUrl);
      addToLog(`HLS stream URL set: ${playlistUrl}`);

      // Step 4: Update authentication status
      setAuthStatus({
        isAuthenticated: true,
        isLoading: false,
        message: `✅ Authenticated successfully! Video should start playing automatically. (Expires at: ${new Date(expiresAt).toLocaleString()})`,
        error: '',
      });
      addToLog('Ready to start HLS streaming with signed URL');

    } catch (error) {
      console.error('Authentication error:', error);
      let errorMessage = 'Authentication failed. Please check credentials and try again.';
      if (error.message.includes('signed cookies')) {
        errorMessage = 'Failed to set signed cookies. Please check the auth URL configuration.';
      } else if (error.message.includes('signed URL')) {
        errorMessage = 'Failed to generate signed URL. Please verify your credentials.';
      } else if (error.message.includes('fetch playlist')) {
        errorMessage = 'Failed to access the HLS playlist. Ensure cookies are sent with the request.';
      }
      setAuthStatus({
        isAuthenticated: false,
        isLoading: false,
        message: errorMessage,
        error: `Error: ${error.message}`,
      });
      addToLog(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="app-header">
        <h1 className="app-title">Multi-Tenant Video Streaming</h1>
        <p className="app-subtitle">Secure HLS Streaming with Signed URL Authentication</p>
      </div>

      <div className="content">
        <VideoPlayer
          videoUrl={videoUrl}
          isAuthenticated={authStatus.isAuthenticated}
          onPlayerReady={() => {
            addToLog('Video player is ready');
          }}
          onPlayerError={(error) => {
            addToLog(`Video player error: ${error.message || error}`);
          }}
        />

        <AuthForm
          onAuthenticate={handleAuthenticate}
          isLoading={authStatus.isLoading}
          isAuthenticated={authStatus.isAuthenticated}
        />

        <div className="card">
          <h3>Authentication Status & Logs</h3>
          {authStatus.isLoading && (
            <div className="status info">{authStatus.message || 'Processing...'}</div>
          )}
          {!authStatus.isLoading && authStatus.message && (
            <div className={`status ${authStatus.error ? 'error' : 'success'}`}>
              {authStatus.message}
            </div>
          )}
          <div className="log-container">
            {requestLog.map((log, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;