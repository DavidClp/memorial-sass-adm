// Simple auth utility for token management
const TOKEN_KEY = "eternomemorial_token"

export const authUtils = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  isAuthenticated: () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(TOKEN_KEY)
    }
    return false
  },
}
