import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import SubjectTabs from "@/components/molecules/SubjectTabs"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import NotesList from "@/components/organisms/NotesList"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { subjectService } from "@/services/api/subjectService"

const LibraryPage = () => {
  const { subject } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")
  
const [subjects, setSubjects] = useState([])
  const [activeSubject, setActiveSubject] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const loadSubjects = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await subjectService.getAll()
      setSubjects([{ id: "all", name: "All", noteCount: data.reduce((sum, s) => sum + s.noteCount, 0) }, ...data])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
const sortOptions = [
    { value: "newest", label: "Newest Notes", icon: "Clock" },
    { value: "popular", label: "Most Popular", icon: "TrendingUp" },
    { value: "bookmarked", label: "Bookmarked", icon: "Bookmark" }
  ]

  useEffect(() => {
    loadSubjects()
  }, [])

  useEffect(() => {
    if (subject) {
      const formattedSubject = subject.charAt(0).toUpperCase() + subject.slice(1)
      setActiveSubject(formattedSubject)
    } else if (!subject && !searchQuery) {
      setActiveSubject("All")
    }
  }, [subject, searchQuery])

const handleSubjectChange = (subjectName) => {
    setActiveSubject(subjectName)
  }

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-96 shimmer"></div>
          </div>
          <div className="mb-6">
            <div className="flex space-x-8 border-b border-gray-200">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded w-24 mb-2 shimmer"></div>
              ))}
            </div>
          </div>
          <Loading variant="cards" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error onRetry={loadSubjects} />
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
            {searchQuery ? `Search Results` : `Study Library`}
          </h1>
          <p className="text-lg text-text-secondary">
            {searchQuery 
              ? `Showing results for "${searchQuery}"`
              : "Comprehensive medical notes for Anatomy, Histology, and Embryology"
            }
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Subject Tabs - hide when searching */}
          {!searchQuery && (
            <SubjectTabs
              subjects={subjects}
              activeSubject={activeSubject}
              onSubjectChange={handleSubjectChange}
            />
          )}

          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(option.value)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name={option.icon} className="w-4 h-4" />
                  {option.label}
                </Button>
              ))}
            </div>
            
            {searchQuery && (
              <div className="text-sm text-text-secondary">
                Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label.toLowerCase()}
              </div>
            )}
          </div>
        </div>

        {/* Notes List */}
<NotesList 
          subject={searchQuery ? null : activeSubject}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />
      </div>
    </div>
  )
}

export default LibraryPage