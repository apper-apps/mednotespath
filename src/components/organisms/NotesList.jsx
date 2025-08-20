import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import NoteCard from "@/components/molecules/NoteCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { noteService } from "@/services/api/noteService"

const NotesList = ({ subject, searchQuery, sortBy = "newest" }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

const loadNotes = async () => {
    try {
      setLoading(true)
      setError("")
      
      let data
      if (searchQuery) {
        // Use search method when searching
        data = await noteService.search(searchQuery, sortBy)
      } else if (subject && subject !== "All") {
        // Get by subject and then sort
        data = await noteService.getBySubject(subject)
        data = await noteService.sortNotes(data, sortBy)
      } else {
        // Get all notes and sort
        data = await noteService.getAll()
        data = await noteService.sortNotes(data, sortBy)
      }
      
      setNotes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadNotes()
  }, [subject, searchQuery, sortBy])
  const handleViewNote = (note) => {
    navigate(`/note/${note.Id}`)
  }

  if (loading) {
    return <Loading variant="cards" />
  }

  if (error) {
    return <Error onRetry={loadNotes} />
  }

  if (notes.length === 0) {
    const emptyTitle = searchQuery 
      ? "No notes found" 
      : subject && subject !== "All" 
        ? `No ${subject} notes found`
        : "No notes available"
    
    const emptyMessage = searchQuery 
      ? `No notes match "${searchQuery}". Try adjusting your search terms.`
      : subject && subject !== "All"
        ? `There are no ${subject} notes available at the moment.`
        : "There are no study notes available at the moment."

    return (
      <Empty 
        title={emptyTitle}
        message={emptyMessage}
        icon="BookOpen"
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard 
          key={note.Id}
          note={note}
          onView={handleViewNote}
        />
      ))}
    </div>
  )
}

export default NotesList