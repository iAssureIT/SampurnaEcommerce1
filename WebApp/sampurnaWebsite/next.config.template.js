module.exports = {
  publicRuntimeConfig: { 
  // Will be available on both server and client
  API_BASE_URL : 'https://devapi.knock-knockeshop.com/',
  // API_BASE_URL : 'http://localhost:3038',
  CURRENT_SITE : 'multivendor',
  PROJECT_TYPE : 'ecommerce',
  SITE_NAME : 'Sampurna',
  SITE_SHORT_NAME: 'Multivendor',
  PORT : 3035,
  NODE_ENV : 'production',
  IMGHeight : '100',
  IMGWIDTH  : '100'
  },
  images: {
      domains: ['devtrollymart-2.s3.amazonaws.com']
  },
  future: {
      webpack5: true,
  },
 
}