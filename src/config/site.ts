export type SiteConfig = typeof siteConfig;

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Meetings",
    href: "/meetings",
  },
  {
    label: "To-dos",
    href: "/todos",
  },
  
];

export const siteConfig = {
  name: "mgmt",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    ...navItems,
  ],
  navMenuItems: [
    ...navItems,
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
