import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// Boundary rule 1: apps never import from each other, only from packages/.
const appPackages = [
  "@manziltech/hub",
  "@manziltech/hajjandumrah",
  "@manziltech/bookings",
  "@manziltech/studio",
];

export default tseslint.config(
  { ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/.turbo/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: appPackages.map((name) => ({
            name,
            message: "Apps must not import from other apps. Move shared code to packages/.",
          })),
          patterns: [
            {
              group: ["**/apps/*", "**/apps/*/**"],
              message: "Apps must not import from other apps. Move shared code to packages/.",
            },
          ],
        },
      ],
    },
  },
);
