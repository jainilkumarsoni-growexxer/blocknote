// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         "background-deep": "#020203",
//         "background-base": "#050506",
//         "background-elevated": "#0a0a0c",
//         surface: "rgba(255,255,255,0.05)",
//         "surface-hover": "rgba(255,255,255,0.08)",
//         foreground: "#EDEDEF",
//         "foreground-muted": "#8A8F98",
//         "foreground-subtle": "rgba(255,255,255,0.60)",
//         accent: "#5E6AD2",
//         "accent-bright": "#6872D9",
//         "accent-glow": "rgba(94,106,210,0.3)",
//         border: {
//           DEFAULT: "rgba(255,255,255,0.06)",
//           hover: "rgba(255,255,255,0.10)",
//           accent: "rgba(94,106,210,0.30)",
//         },
//       },
//       boxShadow: {
//         card: "0 0 0 1px rgba(255,255,255,0.06), 0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
//         "card-hover":
//           "0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(94,106,210,0.1)",
//         glow: "0 0 0 1px rgba(94,106,210,0.5), 0 4px 12px rgba(94,106,210,0.3), inset 0 1px 0 0 rgba(255,255,255,0.2)",
//         "inner-highlight": "inset 0 1px 0 0 rgba(255,255,255,0.1)",
//       },
//       keyframes: {
//         float: {
//           "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
//           "50%": { transform: "translateY(-20px) rotate(1deg)" },
//         },
//         "float-slow": {
//           "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
//           "50%": { transform: "translateY(-30px) rotate(-1deg)" },
//         },
//         shimmer: {
//           "0%": { backgroundPosition: "200% 0" },
//           "100%": { backgroundPosition: "-200% 0" },
//         },
//         "fade-up": {
//           "0%": { opacity: 0, transform: "translateY(24px)" },
//           "100%": { opacity: 1, transform: "translateY(0)" },
//         },
//       },
//       animation: {
//         float: "float 8s ease-in-out infinite",
//         "float-slow": "float-slow 10s ease-in-out infinite",
//         shimmer: "shimmer 3s linear infinite",
//         "fade-up": "fade-up 0.6s ease-out forwards",
//       },
//       transitionTimingFunction: {
//         "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
//       },
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//       },
//     },
//   },
//   plugins: [],
// };






/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "background-deep": "#020203",
        "background-base": "#050506",
        "background-elevated": "#0a0a0c",
        surface: "rgba(255,255,255,0.05)",
        "surface-hover": "rgba(255,255,255,0.08)",
        foreground: "#EDEDEF",
        "foreground-muted": "#8A8F98",
        "foreground-subtle": "rgba(255,255,255,0.60)",
        accent: "#5E6AD2",
        "accent-bright": "#6872D9",
        "accent-glow": "rgba(94,106,210,0.3)",
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.10)",
          accent: "rgba(94,106,210,0.30)",
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
        "card-hover": "0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(94,106,210,0.1)",
        glow: "0 0 0 1px rgba(94,106,210,0.5), 0 4px 12px rgba(94,106,210,0.3), inset 0 1px 0 0 rgba(255,255,255,0.2)",
        "inner-highlight": "inset 0 1px 0 0 rgba(255,255,255,0.1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-30px) rotate(-1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-slow": "float-slow 10s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};