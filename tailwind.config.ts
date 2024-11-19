import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-1': '0px 1px 3px 0px rgba(0, 0, 0, 0.1)', // box-shadow: 0px 1px 3px 0px #0000001A;
        'custom-2': '0px 1px 2px -1px rgba(0, 0, 0, 0.1)', // box-shadow: 0px 1px 2px -1px #0000001A;
        'custom-shadow': '0px 0px 40px 0px rgba(0, 0, 0, 0.1215686275)', 
      },
      backgroundImage:{
        'admin-lg': "url('/admin-lg.png')",
      },
  
        colors: {
        'blue-start': 'rgba(57, 72, 227, 0.65)',
        'blue-end': 'rgba(10, 180, 216, 0.65)',
      },
    },
  },
  plugins: [],
};
export default config;



