import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // <-- Certifique-se de que este import está presente
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { ptBR } from "@clerk/localizations";
import { Provider } from 'react-redux';
import { store } from './app/store.js';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}
      localization={ptBR}>
        <BrowserRouter>
         <Provider store={store}>
            <App />
         </Provider>
        </BrowserRouter>
      </ClerkProvider>
  );
} else {
  throw new Error('Root element not found');
}
