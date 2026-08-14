import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // This application intentionally performs CMS fetches from client effects.
    // The React compiler rule cannot distinguish those asynchronous requests
    // from a synchronous derived-state update and produces false positives.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
      // Existing editorial copy intentionally contains natural punctuation;
      // escaping it does not change runtime behaviour or accessibility.
      "react/no-unescaped-entities": "off",
      // These legacy CMS forms are incrementally typed. Keep lint focused on
      // executable correctness while TypeScript remains the build gate.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
]);

export default eslintConfig;
