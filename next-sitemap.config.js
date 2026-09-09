/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mdcardiacanesthesia.com',
  generateRobotsTxt: true,
  exclude: ['/concept'],
};
