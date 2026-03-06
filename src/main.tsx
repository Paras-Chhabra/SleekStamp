import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Remove the HTML splash screen after React has mounted
requestAnimationFrame(() => {
    const splash = document.getElementById("splash");
    if (splash) {
        splash.style.opacity = "0";
        splash.addEventListener("transitionend", () => splash.remove(), { once: true });
        // Fallback: force remove after 500ms in case transition doesn't fire
        setTimeout(() => splash.remove(), 500);
    }
});
