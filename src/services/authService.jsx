// src/services/authService.js
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:4000"; // Your backend base URL

export const authService = {
  // Generate signed cookies for CloudFront
  async generateSignedCookies(apiKey, accountTypeId, tenantDomain, path) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/business_website/class_room/media/signed_cookies`,
        {
          accountTypeId,
          path,
          expiresInSeconds: 3600, // 1 hour
          tenantDomain,

          // ipRange: optional
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          withCredentials: true, // Important for cookies to be set
        }
      );

      return {
        success: true,
        data: response.data,
        cookies: response.headers["set-cookie"],
      };
    } catch (error) {
      console.error("Auth service error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Authentication failed",
      };
    }
  },

  async generateSignedToken(apiKey, accountTypeId, tenantDomain, path) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/business_website/class_room/media/generate_jwt`,
        {
          accountTypeId,
          path,
          expiresInSeconds: 3600, // 1 hour
          tenantDomain,

          // ipRange: optional
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          withCredentials: true, // Important for cookies to be set
        }
      );

      return {
        success: true,
        data: response.data,
        cookies: response.headers["set-cookie"],
      };
    } catch (error) {
      console.error("Auth service error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Authentication failed",
      };
    }
  },
  async generateSignedUrl(apiKey, accountTypeId, tenantDomain, path) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/business_website/class_room/media/signed_url`,
        {
          accountTypeId,
          path,
          expiresInSeconds: 3600, // 1 hour
          tenantDomain,
          isFolder: true,
          playlistFile : "1758719155895-BigBuckBunny.m3u8",
          // ipRange: optional
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          withCredentials: true, // Important for cookies to be set
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Auth service error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Authentication failed",
      };
    }
  },
  // Get video stream URL based on your HLS structure
  getVideoStreamUrl(tenantDomain, videoId, quality = "360p") {
    // Format: hls/{uploadId}/hls/{videoId}-{filename}_{quality}.m3u8
    return `https://media.${tenantDomain}/hls/1759300486531/hls/${videoId}-14271205_640_360_60fps_${quality}.m3u8`;
  },

  // Verify if cookies are set and valid
  checkCookiesSet(tenantDomain) {
    const requiredCookies = [
      "CloudFront-Key-Pair-Id",
      "CloudFront-Signature",
      "CloudFront-Expires",
    ];

    return requiredCookies.every((cookieName) => {
      return Cookies.get(cookieName) || document.cookie.includes(cookieName);
    });
  },

  // Clear cookies (for logout)
  clearCookies(tenantDomain) {
    const cookies = [
      "CloudFront-Key-Pair-Id",
      "CloudFront-Signature",
      "CloudFront-Expires",
    ];
    cookies.forEach((cookieName) => {
      Cookies.remove(cookieName, { domain: `.${tenantDomain}`, path: "/" });
      Cookies.remove(cookieName, { path: "/" }); // Also remove without domain
    });
  },
};

// Utility to extract cookies from response
export const cookieUtils = {
  parseSetCookies(headers) {
    const cookies = {};
    const setCookieHeader = headers["set-cookie"];

    if (setCookieHeader) {
      setCookieHeader.forEach((cookie) => {
        const parts = cookie.split(";")[0].split("=");
        if (parts.length >= 2) {
          cookies[parts[0].trim()] = parts[1].trim();
        }
      });
    }

    return cookies;
  },
};
