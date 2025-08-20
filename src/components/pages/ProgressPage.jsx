import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { bookmarkService } from "@/services/api/bookmarkService"
import { progressService } from "@/services/api/progressService"
import { noteService } from "@/services/api/noteService"

const ProgressPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [bookmarksData, progressData] = await Promise.all([
        bookmarkService.getAll(),
        progressService.getAll()
      ])
      
      // Enrich bookmarks with note details
      const enrichedBookmarks = await Promise.all(
        bookmarksData.map(async (bookmark) => {
          try {
            const note = await noteService.getById(parseInt(bookmark.noteId))
            return { ...bookmark, note }
          } catch {
            return bookmark
          }
        })
      )
      
      // Enrich progress with note details
      const enrichedProgress = await Promise.all(
        progressData.map(async (prog) => {
          try {
            const note = await noteService.getById(parseInt(prog.noteId))
            return { ...prog, note }
          } catch {
            return prog
          }
        })
      )
      
      setBookmarks(enrichedBookmarks.filter(b => b.note))
      setProgress(enrichedProgress.filter(p => p.note))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleContinueReading = (bookmark) => {
    navigate(`/note/${bookmark.noteId}`)
  }

  const handleViewNote = (noteId) => {
    navigate(`/note/${noteId}`)
  }

  const getSubjectColor = (subject) => {
    const colors = {
      "Anatomy": "text-blue-700 bg-blue-50",
      "Histology": "text-green-700 bg-green-50", 
      "Embryology": "text-purple-700 bg-purple-50"
    }
    return colors[subject] || "text-gray-700 bg-gray-50"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-96 shimmer"></div>
          </div>
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            My Progress
          </h1>
          <p className="text-lg text-text-secondary">
            Track your study progress and continue where you left off
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bookmarked Notes */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-surface px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                <ApperIcon name="Bookmark" className="w-5 h-5 text-primary" />
                Bookmarked Notes
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Continue reading from where you left off
              </p>
            </div>
            
            <div className="p-6">
              {bookmarks.length === 0 ? (
                <Empty 
                  title="No bookmarks yet"
                  message="Start reading notes and bookmark your progress to see them here."
                  icon="Bookmark"
                  action={() => navigate("/library")}
                  actionLabel="Browse Notes"
                />
              ) : (
                <div className="space-y-4">
                  {bookmarks.map((bookmark) => (
                    <div 
                      key={bookmark.Id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary mb-1 line-clamp-1">
                            {bookmark.note.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSubjectColor(bookmark.note.subject)}>
                              {bookmark.note.subject}
                            </Badge>
                            <span className="text-sm text-text-secondary">
                              Page {bookmark.pageNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          Bookmarked {format(new Date(bookmark.timestamp), "MMM d, yyyy")}
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => handleContinueReading(bookmark)}
                        >
                          <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reading Progress */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-surface px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
                Reading Progress
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Your study completion status
              </p>
            </div>
            
            <div className="p-6">
              {progress.length === 0 ? (
                <Empty 
                  title="No progress tracked"
                  message="Start reading notes to track your progress and completion status."
                  icon="TrendingUp"
                  action={() => navigate("/library")}
                  actionLabel="Start Reading"
                />
              ) : (
                <div className="space-y-4">
                  {progress.map((prog) => (
                    <div 
                      key={prog.Id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary mb-1 line-clamp-1">
                            {prog.note.title}
                          </h3>
                          <Badge className={getSubjectColor(prog.note.subject)}>
                            {prog.note.subject}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-text-secondary">Progress</span>
                          <span className="font-medium text-primary">
                            {prog.completionPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                            style={{ width: `${prog.completionPercent}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          Last read: Page {prog.lastViewedPage}
                        </span>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewNote(prog.noteId)}
                        >
                          <ApperIcon name="BookOpen" className="w-4 h-4 mr-1" />
                          View Note
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Study Statistics */}
        {(bookmarks.length > 0 || progress.length > 0) && (
          <div className="mt-8 bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Study Statistics
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="Bookmark" className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  {bookmarks.length}
                </div>
                <div className="text-sm text-text-secondary">
                  Bookmarked Notes
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="BookOpen" className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  {progress.length}
                </div>
                <div className="text-sm text-text-secondary">
                  Notes in Progress
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="Award" className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(progress.reduce((sum, p) => sum + p.completionPercent, 0) / (progress.length || 1))}%
                </div>
                <div className="text-sm text-text-secondary">
                  Average Progress
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressPage