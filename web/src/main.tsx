import React from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./app/AppShell";
const root = document.getElementById("root")!;
createRoot(root).render(<React.StrictMode><AppShell/></React.StrictMode>);
