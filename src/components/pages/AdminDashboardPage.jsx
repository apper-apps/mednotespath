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
  
  // Edit note state
  const [editingNote, setEditingNote] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    subject: 'Anatomy'
  })
  const [editLoading, setEditLoading] = useState(false)
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
                <p className="text-text-secondary">Manage medical education notes</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </Button>
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