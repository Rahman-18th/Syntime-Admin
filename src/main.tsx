import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  ToastProvider,
} from "./components/toast/ToastProvider";

import {
  ConfirmProvider,
} from "./components/confirm/ConfirmProvider";

createRoot(
  document.getElementById(
    "root"
  )!
).render(
  <StrictMode>
    <ToastProvider>
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
</ToastProvider>
  </StrictMode>
);