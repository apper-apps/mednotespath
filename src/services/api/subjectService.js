import subjectsData from "@/services/mockData/subjects.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const subjectService = {
  async getAll() {
    await delay(250)
    return [...subjectsData]
  },

  async getById(id) {
    await delay(200)
    const subject = subjectsData.find(s => s.Id === id)
    if (!subject) {
      throw new Error("Subject not found")
    }
    return { ...subject }
  },

  async create(subjectData) {
    await delay(300)
    const maxId = Math.max(...subjectsData.map(s => s.Id), 0)
    const newSubject = {
      Id: maxId + 1,
      ...subjectData
    }
    subjectsData.push(newSubject)
    return { ...newSubject }
  },

  async update(id, subjectData) {
    await delay(300)
    const index = subjectsData.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error("Subject not found")
    }
    subjectsData[index] = { ...subjectsData[index], ...subjectData }
    return { ...subjectsData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = subjectsData.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error("Subject not found")
    }
    const deleted = subjectsData.splice(index, 1)[0]
    return { ...deleted }
  }
}