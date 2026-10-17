// Neutral placeholder tokens. Branding is not decided yet: swap these values
// when it is, and keep the names so components do not change.
export const tokens = {
  color: {
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#1a1a1a",
    muted: "#5c5c5c",
    border: "#e0e0e0",
    accent: "#1a1a1a",
  },
  font: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
    xl: "4rem",
  },
  radius: {
    md: "0.5rem",
  },
  width: {
    content: "72rem",
  },
} as const;

export type Tokens = typeof tokens;

// Flattens the tokens into CSS custom properties: tokens.color.text becomes --mt-color-text.
export function cssVariables(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [group, values] of Object.entries(tokens)) {
    for (const [name, value] of Object.entries(values)) {
      vars[`--mt-${group}-${name}`] = value;
    }
  }
  return vars;
}
