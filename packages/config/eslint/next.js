import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import base, { restrictedImports } from "./base.js";

// For Next.js apps: the shared base rules plus Next.js and React hooks rules.
// Apps import their own files through the "@/" alias, so a "../" import can
// never climb out of the app into another one.
export default [
  ...base,
  { ignores: ["next-env.d.ts"] },
  nextPlugin.configs["core-web-vitals"],
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          ...restrictedImports,
          patterns: [
            ...restrictedImports.patterns,
            { group: ["../*", "../**"], message: 'Use the "@/" alias for imports inside an app.' },
          ],
        },
      ],
    },
  },
];
