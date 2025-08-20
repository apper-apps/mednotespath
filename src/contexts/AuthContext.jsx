import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '@/services/api/authService'

const AuthContext = createContext(null)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })
      
      const user = await authService.login(email, password)
      dispatch({ type: 'SET_USER', payload: user })
      
      return user
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const signup = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })
      
      const user = await authService.signup(userData)
      dispatch({ type: 'SET_USER', payload: user })
      
      return user
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'SET_USER', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const updateUser = async (updates) => {
    try {
      if (!state.user) throw new Error('No user logged in')
      
      const updatedUser = await authService.updateUser(state.user.Id, updates)
      dispatch({ type: 'SET_USER', payload: updatedUser })
      
      return updatedUser
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const upgradeToPremium = async () => {
    try {
      if (!state.user) throw new Error('No user logged in')
      
      const updatedUser = await authService.upgradeToPremium(state.user.Id)
      dispatch({ type: 'SET_USER', payload: updatedUser })
      
      return updatedUser
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
...state,
    login,
    signup,
    logout,
    updateUser,
    upgradeToPremium,
    clearError,
    isAdmin: state.user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}