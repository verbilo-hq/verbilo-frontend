import React from 'react'
import ReactDOM from 'react-dom/client'
import './theme/tokens.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { IndustryProvider } from './contexts/IndustryContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

if (import.meta.env.DEV) {
  const mockUrl = import.meta.env.VITE_MOCK_COGNITO_URL ?? 'http://localhost:9229';
  window.devLogin = async ({ sub, username } = {}) => {
    const r = await fetch(`${mockUrl}/dev-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sub, username }),
    });
    if (!r.ok) throw new Error(`mock-cognito returned ${r.status}`);
    const { access_token } = await r.json();
    const session = {
      token: access_token,
      user: { username: username ?? 'dev@verbilo.local', isTempPassword: false },
    };
    sessionStorage.setItem('inspire_session', JSON.stringify(session));
    console.log('[devLogin] session set, reloading…');
    location.reload();
  };
  window.devLogout = () => {
    sessionStorage.removeItem('inspire_session');
    location.reload();
  };
  console.log('%c[dev] devLogin() / devLogout() available in this console', 'color:#8b5cf6;font-weight:bold');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <IndustryProvider>
          <App />
        </IndustryProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
