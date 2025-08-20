import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const PDFControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onZoomIn, 
  onZoomOut, 
  onBookmark,
  isBookmarked,
  className,
  ...props 
}) => {
  return (
    <div className={cn("pdf-controls", className)} {...props}>
      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ApperIcon name="ChevronLeft" className="w-4 h-4" />
        </Button>
        
        <span className="text-sm font-medium px-2">
          {currentPage} / {totalPages}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <ApperIcon name="ZoomOut" className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <ApperIcon name="ZoomIn" className="w-4 h-4" />
        </Button>
        
        <Button
          variant={isBookmarked ? "primary" : "ghost"}
          size="sm"
          onClick={onBookmark}
          title="Bookmark this page"
          className={isBookmarked ? "bookmark-pulse" : ""}
        >
          <ApperIcon name="Bookmark" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default PDFControls