import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const SubjectTabs = ({ subjects, activeSubject, onSubjectChange, className, ...props }) => {
const getSubjectIcon = (name) => {
    const icons = {
      "Anatomy Uncovered": "User",
      "Histology": "Microscope",
      "Embryology": "Dna"
    }
    return icons[name] || "FileText"
  }

  return (
    <div className={cn("border-b border-gray-200 mb-6", className)} {...props}>
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
{subjects.map((subject, index) => (
          <button
            key={subject?.id || subject?.name || index}
            onClick={() => onSubjectChange(subject.name)}
            className={cn(
              "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200",
              activeSubject === subject.name
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
            )}
          >
            <ApperIcon name={getSubjectIcon(subject.name)} className="w-4 h-4" />
            {subject.name}
            <span className="bg-surface text-text-secondary px-2 py-1 rounded-full text-xs">
              {subject.noteCount}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default SubjectTabs