import { type Config } from 'tailwindcss';

const config: Config = {
  darkMode: "class",
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // './node_modules/@t3-org/ui/**/*.{js,ts,jsx,tsx}', // if you use shadcn ui from the T3 org package
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;