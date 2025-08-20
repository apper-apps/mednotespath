import notesData from '@/services/mockData/notes.json'
import progressData from '@/services/mockData/progress.json'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock user data for analytics
const usersData = [
  { Id: 1, type: 'premium', lastActive: '2024-01-15', noteViews: 45 },
  { Id: 2, type: 'free', lastActive: '2024-01-14', noteViews: 12 },
  { Id: 3, type: 'premium', lastActive: '2024-01-13', noteViews: 67 },
  { Id: 4, type: 'free', lastActive: '2024-01-12', noteViews: 8 },
  { Id: 5, type: 'premium', lastActive: '2024-01-11', noteViews: 34 },
  { Id: 6, type: 'free', lastActive: '2024-01-10', noteViews: 15 },
  { Id: 7, type: 'premium', lastActive: '2024-01-09', noteViews: 89 },
  { Id: 8, type: 'free', lastActive: '2024-01-08', noteViews: 6 },
  { Id: 9, type: 'premium', lastActive: '2024-01-07', noteViews: 23 },
  { Id: 10, type: 'free', lastActive: '2024-01-06', noteViews: 4 }
]

export const analyticsService = {
  async getReadersPerNote() {
    await delay(500)
    
    const readerStats = notesData.map(note => {
      const readers = progressData.filter(p => p.noteId === note.Id.toString())
      return {
        noteId: note.Id,
        title: note.title.length > 30 ? note.title.substring(0, 30) + '...' : note.title,
        subject: note.subject,
        readers: readers.length,
        totalPages: note.pageCount,
        averageProgress: readers.length > 0 
          ? Math.round(readers.reduce((sum, r) => sum + r.completionPercent, 0) / readers.length)
          : 0
      }
    })
    
    return readerStats.sort((a, b) => b.readers - a.readers)
  },

  async getPremiumVsFreeUsage() {
    await delay(300)
    
    const premiumUsers = usersData.filter(u => u.type === 'premium')
    const freeUsers = usersData.filter(u => u.type === 'free')
    
    const premiumViews = premiumUsers.reduce((sum, u) => sum + u.noteViews, 0)
    const freeViews = freeUsers.reduce((sum, u) => sum + u.noteViews, 0)
    
    return {
      premium: {
        users: premiumUsers.length,
        totalViews: premiumViews,
        averageViewsPerUser: Math.round(premiumViews / premiumUsers.length)
      },
      free: {
        users: freeUsers.length,
        totalViews: freeViews,
        averageViewsPerUser: Math.round(freeViews / freeUsers.length)
      },
      conversionRate: Math.round((premiumUsers.length / usersData.length) * 100)
    }
  },

  async getActiveStudents() {
    await delay(400)
    
    const now = new Date()
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000)
    
    const activeThisWeek = usersData.filter(u => new Date(u.lastActive) >= last7Days)
    const activeThisMonth = usersData.filter(u => new Date(u.lastActive) >= last30Days)
    
    const engagementLevels = {
      high: usersData.filter(u => u.noteViews > 50).length,
      medium: usersData.filter(u => u.noteViews >= 20 && u.noteViews <= 50).length,
      low: usersData.filter(u => u.noteViews < 20).length
    }
    
    return {
      total: usersData.length,
      activeThisWeek: activeThisWeek.length,
      activeThisMonth: activeThisMonth.length,
      engagementLevels,
      retentionRate: Math.round((activeThisMonth.length / usersData.length) * 100)
    }
  },

  async getEngagementTrends() {
    await delay(600)
    
    // Mock weekly engagement data
    const weeklyData = [
      { week: 'Week 1', views: 245, users: 78 },
      { week: 'Week 2', views: 289, users: 85 },
      { week: 'Week 3', views: 312, users: 92 },
      { week: 'Week 4', views: 298, users: 88 }
    ]
    
    return weeklyData
  },

  async getSubjectPopularity() {
    await delay(350)
    
    const subjectStats = {}
    
    progressData.forEach(progress => {
      const note = notesData.find(n => n.Id.toString() === progress.noteId)
      if (note) {
        if (!subjectStats[note.subject]) {
          subjectStats[note.subject] = { views: 0, notes: 0, totalProgress: 0 }
        }
        subjectStats[note.subject].views += 1
        subjectStats[note.subject].totalProgress += progress.completionPercent
      }
    })
    
    // Count notes per subject
    notesData.forEach(note => {
      if (subjectStats[note.subject]) {
        subjectStats[note.subject].notes += 1
      }
    })
    
    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      views: stats.views,
      notes: stats.notes,
      averageProgress: stats.views > 0 ? Math.round(stats.totalProgress / stats.views) : 0
    })).sort((a, b) => b.views - a.views)
  }
}