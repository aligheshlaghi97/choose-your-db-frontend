export const config = {
  // Base URL for API endpoints - change this as needed
  API_BASE_URL: 'https://www.choose-your-db-backend.hekimed.com',
  
  // API endpoints
  ENDPOINTS: {
    QUESTIONS: '/questions',
    RECOMMEND: '/recommend'
  }
} as const

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`
}
