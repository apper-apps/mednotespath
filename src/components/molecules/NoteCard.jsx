import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const NoteCard = ({ note, onView, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]",
        className
      )} 
      {...props}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
        <ApperIcon name="FileText" className="w-12 h-12 text-primary/60" />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary line-clamp-2">
            {note.title}
          </h3>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {note.subject}
          </Badge>
        </div>
        
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {note.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
          <span className="flex items-center gap-1">
            <ApperIcon name="FileText" className="w-4 h-4" />
            {note.pageCount} pages
          </span>
          <span className="flex items-center gap-1">
            <ApperIcon name="Eye" className="w-4 h-4" />
            Free: {note.freePages} pages
          </span>
        </div>
        
        <Button 
          onClick={() => onView(note)}
          className="w-full"
          size="sm"
        >
          <ApperIcon name="BookOpen" className="w-4 h-4 mr-2" />
          View Note
        </Button>
      </div>
    </div>
  )
}

export default NoteCard