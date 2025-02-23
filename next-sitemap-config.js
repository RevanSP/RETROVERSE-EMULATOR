module.exports = {
  siteUrl: 'https://retroverse-emulator.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,

  robotsTxtOptions: {
    additionalSitemaps: [
      'https://retroverse-emulator.vercel.app/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/', 
      },
    ],
  },

  additionalPaths: async () => {
    return []; 
  },
};