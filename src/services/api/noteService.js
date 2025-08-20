import notesData from "@/services/mockData/notes.json"
import { bookmarkService } from "@/services/api/bookmarkService"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const noteService = {
  async getAll() {
    await delay(300)
    return [...notesData].map(note => ({
      ...note,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      viewCount: Math.floor(Math.random() * 1000) + 10
    }))
  },

  async getById(id) {
    await delay(250)
    const note = notesData.find(n => n.Id === id)
    if (!note) {
      throw new Error("Note not found")
    }
    return { 
      ...note,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      viewCount: Math.floor(Math.random() * 1000) + 10
    }
  },

  async getBySubject(subject) {
    await delay(300)
    return notesData.filter(n => n.subject === subject).map(n => ({
      ...n,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      viewCount: Math.floor(Math.random() * 1000) + 10
    }))
  },

  async search(query, sortBy = "newest") {
    await delay(300)
    let results = notesData.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.description.toLowerCase().includes(query.toLowerCase()) ||
      note.subject.toLowerCase().includes(query.toLowerCase())
    ).map(note => ({
      ...note,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      viewCount: Math.floor(Math.random() * 1000) + 10
    }))

    return await this.sortNotes(results, sortBy)
  },

  async sortNotes(notes, sortBy) {
    await delay(100)
    const notesCopy = [...notes]
    
    switch (sortBy) {
      case "newest":
        return notesCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      case "popular":
        return notesCopy.sort((a, b) => b.viewCount - a.viewCount)
      
      case "bookmarked":
        try {
          const bookmarks = await bookmarkService.getAll()
          const bookmarkedNoteIds = new Set(bookmarks.map(b => parseInt(b.noteId)))
          
          return notesCopy.sort((a, b) => {
            const aBookmarked = bookmarkedNoteIds.has(a.Id)
            const bBookmarked = bookmarkedNoteIds.has(b.Id)
            
            if (aBookmarked && !bBookmarked) return -1
            if (!aBookmarked && bBookmarked) return 1
            return new Date(b.createdAt) - new Date(a.createdAt) // Secondary sort by date
          })
        } catch (error) {
          // Fallback to newest if bookmark service fails
          return notesCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }
      
      default:
        return notesCopy
    }
  },

async create(noteData) {
    await delay(400)
    const maxId = Math.max(...notesData.map(n => n.Id), 0)
    const newNote = {
      Id: maxId + 1,
      title: noteData.title || "Untitled Note",
      description: noteData.description || "",
      subject: noteData.subject || "Anatomy",
      fileUrl: noteData.fileUrl || `https://example.com/pdfs/${noteData.title?.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      createdAt: new Date().toISOString(),
      viewCount: 0,
      ...noteData
    }
    notesData.push(newNote)
    return { ...newNote }
  },

  async update(id, noteData) {
    await delay(350)
    const index = notesData.findIndex(n => n.Id === id)
    if (index === -1) {
      throw new Error("Note not found")
    }
    notesData[index] = { ...notesData[index], ...noteData }
    return { ...notesData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = notesData.findIndex(n => n.Id === id)
    if (index === -1) {
      throw new Error("Note not found")
    }
    const deleted = notesData.splice(index, 1)[0]
    return { ...deleted }
  }
}