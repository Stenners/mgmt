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
  }
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
};
