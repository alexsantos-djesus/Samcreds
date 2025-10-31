/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://samcreds.debuguei.com.br",
  generateRobotsTxt: true,
  changefreq: "monthly",
  priority: 0.7,
  exclude: ["/api/*"],
};
