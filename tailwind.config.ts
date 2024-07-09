import { tailwindTheme } from "./src/lib/theme/mainTheme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: tailwindTheme.extend,
  },
  // @ts-ignore
  darkMode: 'media', // ダークモードを無効にする
  plugins: [],
};

export default config;