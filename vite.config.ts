import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  // server: { host: true, https: false, strictPort: true, allowedHosts: true },
  plugins: [react(), basicSsl()],
});
