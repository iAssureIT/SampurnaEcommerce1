module.exports = {
  serverRuntimeConfig: { // Will only be available on the server side
    API_BASE_URL : 'http://qaapi-sampurna-marketplace.iassureit.in/',
  },
  publicRuntimeConfig: { 
  // Will be available on both server and client
  // API_BASE_URL : 'http://qaapi-sampurna-marketplace.iassureit.in/',
  API_BASE_URL : 'http://localhost:3038',
  CURRENT_SITE : 'multivendor',
  PROJECT_TYPE : 'ecommerce',
  SITE_NAME : 'Multivendor',
  SITE_SHORT_NAME: 'Multivendor',
  PORT : 3035,
  NODE_ENV : 'production',
  IMGHeight : '100',
  IMGWIDTH  : '100'
  },
  images: {
      domains: ['sampurna.s3.amazonaws.com'],
  },
  
}
