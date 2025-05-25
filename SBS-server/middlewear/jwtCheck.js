const { auth } = require('express-oauth2-jwt-bearer');

/**
 * JWT authentication middleware
 * Verifies that incoming requests have a valid JWT token from Auth0
 * This middleware should be applied to all routes that require authentication¨¨
 */



const jwtCheck = auth({
  audience: 'klubbsida.onrender.com/api',
  issuerBaseURL: 'https://dev-nwurgok5vi3aouh3.eu.auth0.com/',
  tokenSigningAlg: 'RS256'
});