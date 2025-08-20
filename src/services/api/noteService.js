import notesData from "@/services/mockData/notes.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const noteService = {
  async getAll() {
    await delay(300)
    return [...notesData]
  },

  async getById(id) {
    await delay(250)
    const note = notesData.find(n => n.Id === id)
    if (!note) {
      throw new Error("Note not found")
    }
    return { ...note }
  },

  async getBySubject(subject) {
    await delay(300)
    return notesData.filter(n => n.subject === subject).map(n => ({ ...n }))
  },

  async create(noteData) {
    await delay(400)
    const maxId = Math.max(...notesData.map(n => n.Id), 0)
    const newNote = {
      Id: maxId + 1,
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