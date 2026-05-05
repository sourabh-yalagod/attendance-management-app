import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <App />
  </ClerkProvider>,
);
