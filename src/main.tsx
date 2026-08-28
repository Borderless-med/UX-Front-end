
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mount React app immediately for best FCP/LCP
createRoot(document.getElementById("root")!).render(<App />);
