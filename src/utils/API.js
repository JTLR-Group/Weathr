/**
 * weather react serverless API functions URL
 */
const isProduction = process.env.NODE_ENV === 'production'
export default isProduction
  ? '/api/index'
  : 'https://weather-react-api-dev.now.sh'
