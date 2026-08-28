
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Critical: Render app immediately for FCP/LCP
const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(<App />);

// Non-critical: Defer analytics/tracking initialization
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Initialize non-critical services here
    // Analytics, error tracking, etc.
  }, { timeout: 2000 });
} else {
  setTimeout(() => {
    // Fallback for browsers without requestIdleCallback
  }, 1);
}
