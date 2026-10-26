import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // <-- Certifique-se de que este import está presente
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { enUS, ptBR } from "@clerk/localizations";
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { useLanguage } from "./context/Language.js";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function AdaptProviders() {
  const { language } = useLanguage();
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={language === "en" ? enUS : ptBR}>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </ClerkProvider>
  );
}

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
      <LanguageProvider>
        <AdaptProviders />
      </LanguageProvider>
  );
} else {
  throw new Error('Root element not found');
}
