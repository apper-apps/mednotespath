import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { noteService } from "@/services/api/noteService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

function AdminDashboardPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: 'Anatomy',
    file: null
  })
  const [uploadLoading, setUploadLoading] = useState(false)

// Notes management state
const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [notesError, setNotesError] = useState(null)
  
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    readersPerNote: [],
    premiumVsFree: null,
    activeStudents: null,
    engagementTrends: [],
    subjectPopularity: []
  })
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState(null)
  
  // Edit note state
  const [editingNote, setEditingNote] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    subject: 'Anatomy'
  })
  const [editLoading, setEditLoading] = useState(false)

  // Load notes and analytics when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadNotes()
      loadAnalytics()
}
  }, [isAuthenticated])

  async function loadNotes() {
    setNotesLoading(true)
    setNotesError(null)
    try {
      const data = await noteService.getAll()
      setNotes(data)
    } catch (error) {
      setNotesError(error.message)
      toast.error('Failed to load notes')
    } finally {
setNotesLoading(false)
    }
  }

  async function loadAnalytics() {
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    try {
      const { analyticsService } = await import('@/services/api/analyticsService')
      
      const [readersData, usageData, studentsData, trendsData, popularityData] = await Promise.all([
        analyticsService.getReadersPerNote(),
        analyticsService.getPremiumVsFreeUsage(),
        analyticsService.getActiveStudents(),
        analyticsService.getEngagementTrends(),
        analyticsService.getSubjectPopularity()
      ])
      
      setAnalyticsData({
        readersPerNote: readersData,
        premiumVsFree: usageData,
        activeStudents: studentsData,
        engagementTrends: trendsData,
        subjectPopularity: popularityData
      })
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalyticsError('Failed to load analytics data')
      toast.error('Failed to load analytics data')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginLoading(true)

    // Simulate admin authentication
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true)
      toast.success('Successfully logged in as admin')
    } else {
      toast.error('Invalid credentials. Use admin/admin123')
    }
    setLoginLoading(false)
  }
  function handleLoginInputChange(field, value) {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

function handleUploadInputChange(field, value) {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleEditInputChange(field, value) {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleEditNote(note) {
    setEditingNote(note)
    setEditForm({
      title: note.title,
      description: note.description,
      subject: note.subject
    })
  }

  function handleCancelEdit() {
    setEditingNote(null)
    setEditForm({
      title: '',
      description: '',
      subject: 'Anatomy'
    })
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    if (!editingNote) return

    setEditLoading(true)
    try {
      await noteService.update(editingNote.Id, editForm)
      await loadNotes()
      handleCancelEdit()
      toast.success(`Updated "${editForm.title}"`)
    } catch (error) {
      toast.error('Failed to update note: ' + error.message)
    } finally {
      setEditLoading(false)
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setUploadForm(prev => ({
        ...prev,
        file: file
      }))
      toast.info(`Selected: ${file.name}`)
    } else {
      toast.error('Please select a valid PDF file')
    }
  }

  async function handleUploadSubmit(e) {
    e.preventDefault()
    
    if (!uploadForm.title || !uploadForm.description || !uploadForm.file) {
      toast.error('Please fill in all fields and select a PDF file')
      return
    }

    setUploadLoading(true)

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newNote = await noteService.create({
        title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        fileUrl: `https://example.com/uploads/${uploadForm.file.name}`
      })

      // Reset form
      setUploadForm({
        title: '',
        description: '',
        subject: 'Anatomy',
        file: null
      })

      // Reset file input
      const fileInput = document.getElementById('pdf-upload')
      if (fileInput) fileInput.value = ''

      // Reload notes
      await loadNotes()

      toast.success(`Successfully uploaded "${newNote.title}"`)
    } catch (error) {
      toast.error('Failed to upload note: ' + error.message)
    } finally {
      setUploadLoading(false)
    }
  }
async function handleDeleteNote(noteId, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await noteService.delete(noteId)
      await loadNotes()
      toast.success(`Deleted "${title}"`)
    } catch (error) {
      toast.error('Failed to delete note: ' + error.message)
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setLoginForm({ username: '', password: '' })
    toast.info('Logged out successfully')
  }

  function getSubjectColor(subject) {
    const colors = {
      Anatomy: "text-blue-700 bg-blue-100",
      Histology: "text-green-700 bg-green-100", 
      Embryology: "text-purple-700 bg-purple-100"
    }
    return colors[subject] || "text-gray-700 bg-gray-100"
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-light/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-primary/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ApperIcon name="Shield" className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">Login to manage medical notes</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Username"
              type="text"
              value={loginForm.username}
              onChange={(e) => handleLoginInputChange('username', e.target.value)}
              placeholder="Enter admin username"
              required
            />
            <Input
              label="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => handleLoginInputChange('password', e.target.value)}
              placeholder="Enter admin password"
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-text-secondary text-center">
              <strong>Demo credentials:</strong><br />
              Username: admin<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Admin dashboard
return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-light/10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <ApperIcon name="Shield" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
                <p className="text-text-secondary">Manage medical education notes & analytics</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 rounded-full p-2">
                <ApperIcon name="BarChart" className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Analytics Dashboard</h2>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-text-secondary">Loading analytics...</span>
                </div>
              </div>
            ) : analyticsError ? (
              <div className="text-center py-12">
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{analyticsError}</p>
                <Button onClick={loadAnalytics} className="mt-4">
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 rounded-lg p-2">
                        <ApperIcon name="Users" className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-700">{analyticsData.activeStudents?.total || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 rounded-lg p-2">
                        <ApperIcon name="Crown" className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-green-600 text-sm font-medium">Premium Users</p>
                        <p className="text-2xl font-bold text-green-700">{analyticsData.premiumVsFree?.premium.users || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 rounded-lg p-2">
                        <ApperIcon name="Activity" className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Active This Week</p>
                        <p className="text-2xl font-bold text-purple-700">{analyticsData.activeStudents?.activeThisWeek || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 rounded-lg p-2">
                        <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Retention Rate</p>
                        <p className="text-2xl font-bold text-orange-700">{analyticsData.activeStudents?.retentionRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Readers Per Note */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Readers Per Note</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {analyticsData.readersPerNote.map((note, index) => (
                        <div key={note.noteId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{note.title}</p>
                            <p className="text-xs text-text-secondary">{note.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={note.readers > 2 ? 'success' : 'secondary'}>
                              {note.readers} readers
                            </Badge>
                            <span className="text-xs text-text-secondary">{note.averageProgress}% avg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Premium vs Free Usage */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Premium vs Free Usage</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border-l-4 border-primary">
                        <div>
                          <p className="font-medium text-text-primary">Premium Users</p>
                          <p className="text-sm text-text-secondary">{analyticsData.premiumVsFree?.premium.averageViewsPerUser || 0} avg views/user</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{analyticsData.premiumVsFree?.premium.users || 0}</p>
                          <p className="text-sm text-text-secondary">{analyticsData.premiumVsFree?.premium.totalViews || 0} total views</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border-l-4 border-gray-400">
                        <div>
                          <p className="font-medium text-text-primary">Free Users</p>
                          <p className="text-sm text-text-secondary">{analyticsData.premiumVsFree?.free.averageViewsPerUser || 0} avg views/user</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-600">{analyticsData.premiumVsFree?.free.users || 0}</p>
                          <p className="text-sm text-text-secondary">{analyticsData.premiumVsFree?.free.totalViews || 0} total views</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-text-secondary">Conversion Rate</p>
                        <p className="text-xl font-bold text-primary">{analyticsData.premiumVsFree?.conversionRate || 0}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Subject Popularity */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Subject Popularity</h3>
                    <div className="space-y-3">
                      {analyticsData.subjectPopularity.map((subject, index) => {
                        const colors = {
                          Anatomy: 'bg-blue-500',
                          Histology: 'bg-green-500', 
                          Embryology: 'bg-purple-500'
                        }
                        return (
                          <div key={subject.subject} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${colors[subject.subject] || 'bg-gray-500'}`} />
                              <span className="font-medium text-text-primary">{subject.subject}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                              <span>{subject.views} views</span>
                              <span>{subject.notes} notes</span>
                              <span>{subject.averageProgress}% avg progress</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Engagement Levels */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Student Engagement</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                          <ApperIcon name="Zap" className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-text-primary">High Engagement</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{analyticsData.activeStudents?.engagementLevels.high || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center gap-3">
                          <ApperIcon name="Minus" className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-text-primary">Medium Engagement</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{analyticsData.activeStudents?.engagementLevels.medium || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                          <ApperIcon name="TrendingDown" className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-text-primary">Low Engagement</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{analyticsData.activeStudents?.engagementLevels.low || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 rounded-full p-2">
                <ApperIcon name="Upload" className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Upload New Note</h2>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <Input
                label="Title"
                type="text"
                value={uploadForm.title}
                onChange={(e) => handleUploadInputChange('title', e.target.value)}
                placeholder="Enter note title"
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => handleUploadInputChange('description', e.target.value)}
                  placeholder="Enter note description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Subject
                </label>
                <select
                  value={uploadForm.subject}
                  onChange={(e) => handleUploadInputChange('subject', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Anatomy">Anatomy</option>
                  <option value="Histology">Histology</option>
                  <option value="Embryology">Embryology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  PDF File
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
                {uploadForm.file && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {uploadForm.file.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                    Upload Note
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Edit Form */}
          {editingNote && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <ApperIcon name="Edit" className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">Edit Note</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <Input
                  label="Title"
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleEditInputChange('title', e.target.value)}
                  placeholder="Enter note title"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    placeholder="Enter note description"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <select
                    value={editForm.subject}
                    onChange={(e) => handleEditInputChange('subject', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Anatomy">Anatomy</option>
                    <option value="Histology">Histology</option>
                    <option value="Embryology">Embryology</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                        Update Note
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 rounded-full p-2">
              <ApperIcon name="BookOpen" className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">All Notes</h2>
            <Badge variant="secondary" className="ml-auto">
              {notes.length} notes
            </Badge>
          </div>

          {notesLoading ? (
            <Loading message="Loading notes..." />
          ) : notesError ? (
            <Error message={notesError} onRetry={loadNotes} />
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ApperIcon name="FileX" className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-text-secondary">No notes uploaded yet</p>
              <p className="text-sm text-text-secondary mt-1">Upload your first medical note to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.Id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary truncate">
                        {note.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                        {note.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge 
                          variant="secondary"
                          className={getSubjectColor(note.subject)}
                        >
                          {note.subject}
                        </Badge>
                        <span className="text-xs text-text-secondary">
                          ID: {note.Id}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.Id, note.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage