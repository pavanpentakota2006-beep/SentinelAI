const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: c("bg"), surface: c("surface"), raised: c("raised"), line: c("line"),
        ink: c("ink"), muted: c("muted"),
        accent: c("accent"), "accent-ink": c("accent-ink"),
        sev: { critical: c("sev-critical"), high: c("sev-high"), medium: c("sev-medium"), low: c("sev-low"), info: c("sev-info") },
        ok: c("ok"),
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { card: "10px", chip: "4px" },
    },
  },
  plugins: [],
};
