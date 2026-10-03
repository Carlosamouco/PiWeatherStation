import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), svgr()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: Number(process.env.PORT) || undefined,
    host: true,
  },
});
