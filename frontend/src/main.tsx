import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Your global styles
import { AuthProvider } from './context/AuthProvider.tsx';
import './i18n.ts'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <AuthProvider>
      <App />
    </AuthProvider>
    
  </React.StrictMode>,
)