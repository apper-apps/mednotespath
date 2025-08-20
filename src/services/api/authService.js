import usersData from '@/services/mockData/users.json'

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  user: {
    Id: 999,
    email: 'admin@mednotes.com',
    name: 'System Administrator',
    role: 'admin',
    isPremium: true,
    createdAt: new Date().toISOString()
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Simple in-memory session storage for demo
let currentUser = null

export const authService = {
  async login(email, password) {
    await delay(500)
    const user = usersData.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error("Invalid email or password")
    }
    
    currentUser = { ...user }
    delete currentUser.password // Don't expose password
    
    // Store in localStorage for demo persistence
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    
    return currentUser
  },

  async signup(userData) {
    await delay(500)
    
    // Check if email already exists
    if (usersData.find(u => u.email === userData.email)) {
      throw new Error("Email already registered")
    }
    
    const maxId = Math.max(...usersData.map(u => u.Id), 0)
    const newUser = {
      Id: maxId + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isPremium: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    usersData.push(newUser)
    
    currentUser = { ...newUser }
    delete currentUser.password
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    
    return currentUser
  },

  async logout() {
    await delay(200)
    currentUser = null
    localStorage.removeItem('currentUser')
  },

  async getCurrentUser() {
    await delay(100)
    
    if (currentUser) {
      return currentUser
    }
    
    // Try to restore from localStorage
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        currentUser = JSON.parse(stored)
        return currentUser
      } catch {
        localStorage.removeItem('currentUser')
      }
    }
    
    return null
  },

  async updateUser(userId, updates) {
    await delay(300)
    
    if (!currentUser || currentUser.Id !== userId) {
      throw new Error("Unauthorized")
    }
    
    const userIndex = usersData.findIndex(u => u.Id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    
    usersData[userIndex] = { ...usersData[userIndex], ...updates }
    currentUser = { ...usersData[userIndex] }
    delete currentUser.password
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    
    return currentUser
  },

  async upgradeToPremium(userId) {
    return this.updateUser(userId, { 
      isPremium: true,
      premiumUpgradedAt: new Date().toISOString()
    })
  }
}