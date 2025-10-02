// src/components/AuthForm.jsx
import React, { useState } from 'react';

const AuthForm = ({ onAuthenticate, isLoading, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    apiKey: '',
    accountTypeId: '',
    tenantDomain: 'tenant-domain.in',
    videoId: '1759300483732',
    pathPrefix: 'hls/1759300486531/hls/'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate(formData);
  };

  return (
    <div className="card">
      <h3>🔐 Authentication Configuration</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apiKey">API Key *</label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            placeholder="Enter your Bearer token / API key"
            required
            disabled={isAuthenticated}
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountTypeId">Account Type ID *</label>
          <input
            type="text"
            id="accountTypeId"
            name="accountTypeId"
            value={formData.accountTypeId}
            onChange={handleChange}
            placeholder="Enter accountTypeId from AWS Integration"
            required
            disabled={isAuthenticated}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenantDomain">Tenant Domain</label>
          <input
            type="text"
            id="tenantDomain"
            name="tenantDomain"
            value={formData.tenantDomain}
            onChange={handleChange}
            placeholder="e.g., tenant-domain.in"
            required
            disabled={isAuthenticated}
          />
        </div>

        <div className="form-group">
          <label htmlFor="videoId">Video ID</label>
          <input
            type="text"
            id="videoId"
            name="videoId"
            value={formData.videoId}
            onChange={handleChange}
            placeholder="Enter video ID (e.g., 1759300483732)"
            required
            disabled={isAuthenticated}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pathPrefix">Path Prefix</label>
          <input
            type="text"
            id="pathPrefix"
            name="pathPrefix"
            value={formData.pathPrefix}
            onChange={handleChange}
            placeholder="e.g., hls/1759300486531/hls/"
            required
            disabled={isAuthenticated}
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={isLoading || isAuthenticated}
        >
          {isLoading ? '🔄 Authenticating...' : '🔑 Authenticate & Play Video'}
        </button>
      </form>

      <div className="step">
        <div className="step-number">1</div>
        <div>
          <strong>Enter Credentials</strong><br />
          API Key and Account Type ID
        </div>
      </div>

      <div className="step">
        <div className="step-number">2</div>
        <div>
          <strong>Configure Tenant</strong><br />
          Set domain and video parameters
        </div>
      </div>

      <div className="step">
        <div className="step-number">3</div>
        <div>
          <strong>Get Signed Cookies</strong><br />
          Backend sets CloudFront cookies
        </div>
      </div>
    </div>
  );
};

export default AuthForm;