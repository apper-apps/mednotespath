import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import PDFControls from "@/components/molecules/PDFControls"
import PremiumOverlay from "@/components/molecules/PremiumOverlay"
import Loading from "@/components/ui/Loading"
import { bookmarkService } from "@/services/api/bookmarkService"

const PDFViewer = ({ note }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadBookmarks()
    // Simulate PDF loading
    setTimeout(() => setLoading(false), 1000)
  }, [note.Id])

  const loadBookmarks = async () => {
    try {
      const data = await bookmarkService.getByNoteId(note.Id)
      setBookmarks(data)
    } catch (error) {
      console.error("Failed to load bookmarks:", error)
    }
  }

  const handlePageChange = (page) => {
    const newPage = Math.max(1, Math.min(page, note.pageCount))
    setCurrentPage(newPage)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleBookmark = async () => {
    try {
      const existingBookmark = bookmarks.find(b => b.noteId === note.Id)
      
      if (existingBookmark) {
        await bookmarkService.update(existingBookmark.Id, {
          noteId: note.Id,
          pageNumber: currentPage,
          timestamp: new Date().toISOString()
        })
        toast.success("Bookmark updated!")
      } else {
        await bookmarkService.create({
          noteId: note.Id,
          pageNumber: currentPage,
          timestamp: new Date().toISOString()
        })
        toast.success("Page bookmarked!")
      }
      
      await loadBookmarks()
    } catch (error) {
      toast.error("Failed to save bookmark")
    }
  }

  const handleUpgrade = () => {
    navigate("/premium")
  }

  const isBookmarked = bookmarks.some(b => b.noteId === note.Id)
  const isPremiumContent = currentPage > note.freePages
  const canViewPage = currentPage <= note.freePages

  if (loading) {
    return <Loading variant="pdf" />
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <PDFControls
        currentPage={currentPage}
        totalPages={note.pageCount}
        onPageChange={handlePageChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />
      
      <div className="relative">
        {/* PDF Content Area */}
        <div 
          className="p-8 overflow-auto custom-scrollbar"
          style={{ 
            minHeight: "600px",
            maxHeight: "80vh"
          }}
        >
          <div 
            className="max-w-2xl mx-auto bg-white shadow-sm border"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease"
            }}
          >
            {canViewPage ? (
              // Simulated PDF page
              <div className="aspect-[3/4] bg-white p-8 border">
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                      {note.title}
                    </h1>
                    <p className="text-text-secondary">
                      Page {currentPage} of {note.pageCount}
                    </p>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                    
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center my-6">
                      <span className="text-text-secondary">Medical Diagram {currentPage}</span>
                    </div>
                    
                    <div className="h-4 bg-gray-200 rounded shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
                  </div>
                </div>
              </div>
            ) : (
              // Premium overlay for restricted content
              <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center">
                <PremiumOverlay onUpgrade={handleUpgrade} />
              </div>
            )}
          </div>
        </div>
        
        {/* Premium overlay warning */}
        {isPremiumContent && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-3">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm text-yellow-800">
                This is premium content. You have viewed {note.freePages} of {note.pageCount} free pages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFViewer