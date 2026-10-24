// The starting point: puts the <App /> into the <div id="root"> in index.html.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FeedbackProvider } from './feedback';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  </StrictMode>
);
