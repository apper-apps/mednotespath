import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { noteService } from '@/services/api/noteService'
import { cn } from '@/utils/cn'

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

  // Load notes when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadNotes()
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
                <p className="text-text-secondary">Manage medical education notes</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload Note Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 rounded-lg p-2">
                <ApperIcon name="Upload" className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Upload New Note</h2>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <Input
                label="Title"
                value={uploadForm.title}
                onChange={(e) => handleUploadInputChange('title', e.target.value)}
                placeholder="Enter note title"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Category
                </label>
                <select
                  value={uploadForm.subject}
                  onChange={(e) => handleUploadInputChange('subject', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Anatomy">Anatomy</option>
                  <option value="Histology">Histology</option>
                  <option value="Embryology">Embryology</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => handleUploadInputChange('description', e.target.value)}
                  placeholder="Enter note description"
                  rows={4}
                  required
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  PDF File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-text-secondary mb-3">
                    {uploadForm.file ? uploadForm.file.name : 'Click to select a PDF file'}
                  </p>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('pdf-upload').click()}
                  >
                    <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
                    Select PDF
                  </Button>
                </div>
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

          {/* Notes Management Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">Manage Notes</h2>
              </div>
              <Button variant="outline" onClick={loadNotes}>
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {notesLoading && (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            )}

            {notesError && (
              <Error
                message={notesError}
                onRetry={loadNotes}
              />
            )}

            {!notesLoading && !notesError && (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary">
                    <ApperIcon name="FileText" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No notes available</p>
                  </div>
                ) : (
                  notes.map((note) => (
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.Id, note.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage