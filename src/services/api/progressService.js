import progressData from "@/services/mockData/progress.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const progressService = {
  async getAll() {
    await delay(250)
    return [...progressData]
  },

  async getById(id) {
    await delay(200)
    const progress = progressData.find(p => p.Id === id)
    if (!progress) {
      throw new Error("Progress not found")
    }
    return { ...progress }
  },

  async getByNoteId(noteId) {
    await delay(250)
    const progress = progressData.find(p => p.noteId === noteId.toString())
    return progress ? { ...progress } : null
  },

  async create(progressItem) {
    await delay(300)
    const maxId = Math.max(...progressData.map(p => p.Id), 0)
    const newProgress = {
      Id: maxId + 1,
      ...progressItem
    }
    progressData.push(newProgress)
    return { ...newProgress }
  },

  async update(id, progressItem) {
    await delay(300)
    const index = progressData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Progress not found")
    }
    progressData[index] = { ...progressData[index], ...progressItem }
    return { ...progressData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = progressData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Progress not found")
    }
    const deleted = progressData.splice(index, 1)[0]
    return { ...deleted }
  }
}