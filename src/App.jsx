import React, { useState } from 'react';

import AuthForm from './components/AuthForm';
import VideoPlayer from './components/VideoPlayer';
import { authService, cookieUtils } from './services/authService';
import './App.css';

function App() {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: false,
    message: '',
    error: ''
  });
  
  const [videoUrl, setVideoUrl] = useState('');
  const [requestLog, setRequestLog] = useState(['Application started. Ready for authentication.']);

  const addToLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setRequestLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 10)]);
  };

  const handleAuthenticate = async (formData) => {
    setAuthStatus({
      isAuthenticated: false,
      isLoading: true,
      message: `Starting authentication for tenant: ${formData.tenantDomain}`,
      error: ''
    });

    addToLog(`Starting authentication for tenant: ${formData.tenantDomain}`);

    try {
      // Step 1: Generate signed cookies
      addToLog(`Calling authentication endpoint with API key`);
      
      const authResult = await authService.generateSignedCookies(
        formData.apiKey,
        formData.accountTypeId,
        formData.tenantDomain,
        formData.pathPrefix
      );

      // if (!authResult.success) {
      //   throw new Error(authResult.error);
      // }

      addToLog('Authentication successful. Signed cookies received.');
      console.log(authResult);
      
      // Step 2: Construct video URL
      // const streamUrl = authService.getVideoStreamUrl(formData.tenantDomain, formData.videoId);
      setVideoUrl(authResult.data.sampleHlsUrl);
      
      // addToLog(`Video stream URL constructed: ${streamUrl}`);

      // Step 3: Update authentication status on success
      setAuthStatus({
        isAuthenticated: true,
        isLoading: false,
        message: '✅ Authenticated successfully! Video should start playing automatically.',
        error: '',
      });


      // Step 4: Add success log
      addToLog('Ready to start HLS streaming');

    } catch (error) {
      console.error('Authentication error:', error);
      
      setAuthStatus({
        isAuthenticated: false,
        isLoading: false,
        message: 'Authentication failed. Please check credentials and try again.',
        error: `Error: ${error.message}`
      });

      addToLog(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="app-header">
        <h1 className="app-title">Multi-Tenant Video Streaming</h1>
        <p className="app-subtitle">Secure HLS Streaming with Signed Cookie Authentication</p>
      </div>

      <div className="content">
        <VideoPlayer 
          videoUrl={videoUrl} 
          isAuthenticated={authStatus.isAuthenticated} 
          onPlayerReady={() => {
            addToLog('Video player is ready');
          }}
          onPlayerError={(error) => {
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
            <div className="status info">
              {authStatus.message || 'Processing...'}
            </div>
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