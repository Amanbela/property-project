export const siteConfig = {
  name: "Indore Property Budget Finder",
  description: "Discover the best areas in Indore with budget-based property recommendations and investment insights.",
  url: "https://indorepropertybudgetfinder.com"
};

export function getCanonical(path = ""): string {
  return `${siteConfig.url}${path}`;
}
