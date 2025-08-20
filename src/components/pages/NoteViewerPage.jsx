import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import PDFViewer from "@/components/organisms/PDFViewer"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { noteService } from "@/services/api/noteService"

const NoteViewerPage = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()
const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const loadNote = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await noteService.getById(parseInt(noteId))
      setNote(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
if (noteId) {
      loadNote()
    }
  }, [noteId])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 shimmer"></div>
            <div className="h-8 bg-gray-200 rounded w-96 mb-2 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-64 shimmer"></div>
          </div>
          <Loading variant="pdf" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            title="Note not found"
            message="The requested study note could not be found. It may have been moved or deleted."
            onRetry={loadNote}
          />
        </div>
      </div>
    )
  }

  if (!note) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/library" className="hover:text-primary transition-colors">
            Library
          </Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <Link 
            to={`/library/${note.subject.toLowerCase()}`}
            className="hover:text-primary transition-colors"
          >
            {note.subject}
          </Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-text-primary font-medium">{note.title}</span>
        </nav>

{/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-text-primary">
                  {note.title}
                </h1>
                <Badge variant="secondary">{note.subject}</Badge>
              </div>
              <p className="text-text-secondary mb-4">
                {note.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <ApperIcon name="FileText" className="w-4 h-4" />
                  {note.pageCount} pages total
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Eye" className="w-4 h-4" />
                  {note.freePages} pages free
                </span>
                {!user && (
                  <span className="flex items-center gap-1 text-primary">
                    <ApperIcon name="User" className="w-4 h-4" />
                    Sign in to bookmark
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 lg:flex-col lg:items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back
              </Button>
{!user && (
                <Button
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  <ApperIcon name="User" className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
              {user && note.freePages < note.pageCount && !user.isPremium && (
                <Button
                  size="sm"
                  onClick={() => navigate("/premium")}
                >
                  <ApperIcon name="Crown" className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <PDFViewer note={note} />
      </div>
    </div>
  )
}

export default NoteViewerPage