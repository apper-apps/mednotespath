import bookmarksData from "@/services/mockData/bookmarks.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const bookmarkService = {
  async getAll() {
    await delay(250)
    return [...bookmarksData]
  },

  async getAllByUser(userId) {
    await delay(250)
    return bookmarksData.filter(b => b.userId === userId).map(b => ({ ...b }))
  },

  async getById(id) {
    await delay(200)
    const bookmark = bookmarksData.find(b => b.Id === id)
    if (!bookmark) {
      throw new Error("Bookmark not found")
    }
    return { ...bookmark }
  },

  async getByNoteId(noteId) {
    await delay(250)
    return bookmarksData.filter(b => b.noteId === noteId.toString()).map(b => ({ ...b }))
  },

  async getByUserAndNote(userId, noteId) {
    await delay(250)
    return bookmarksData.filter(b => 
      b.userId === userId && b.noteId === noteId.toString()
    ).map(b => ({ ...b }))
  },

  async create(bookmarkData) {
    await delay(300)
    const maxId = Math.max(...bookmarksData.map(b => b.Id), 0)
    const newBookmark = {
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      ...bookmarkData
    }
    bookmarksData.push(newBookmark)
    return { ...newBookmark }
  },

  async update(id, bookmarkData) {
    await delay(300)
    const index = bookmarksData.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error("Bookmark not found")
    }
    bookmarksData[index] = { ...bookmarksData[index], ...bookmarkData }
    return { ...bookmarksData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = bookmarksData.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error("Bookmark not found")
    }
    const deleted = bookmarksData.splice(index, 1)[0]
    return { ...deleted }
  }
}