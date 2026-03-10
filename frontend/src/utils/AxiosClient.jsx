import axios from 'axios'

const apiPort = process.env.NEXT_PUBLIC_API_PORT || '1234';
const explicitBaseURL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;
const isLoopbackUrl = (url) => /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(url || '');

function resolveBaseURL() {
  if (typeof window !== 'undefined') {
    const hostBasedURL = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/v1`;

    // If env URL points to localhost, it breaks on phones/other devices.
    if (explicitBaseURL && !isLoopbackUrl(explicitBaseURL)) {
      return explicitBaseURL;
    }

    return hostBasedURL;
  }

  return explicitBaseURL || `http://localhost:${apiPort}/api/v1`;
}

export const axiosClient = axios.create({
  baseURL: resolveBaseURL(),
});
