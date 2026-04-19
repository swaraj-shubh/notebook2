import api from './api'
import toast from 'react-hot-toast'

export const noteService = {
  async createNote(noteData) {
    try {
      const response = await api.post('/notes', noteData)
      toast.success('Note created successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create note'
      toast.error(message)
      throw error
    }
  },

  async getNotes() {
    try {
      const response = await api.get('/notes')
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to fetch notes'
      toast.error(message)
      throw error
    }
  },

  async updateNote(noteId, noteData) {
    try {
      const response = await api.put(`/notes/${noteId}`, noteData)
      toast.success('Note updated successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update note'
      toast.error(message)
      throw error
    }
  },

  async deleteNote(noteId) {
    try {
      const response = await api.delete(`/notes/${noteId}`)
      toast.success('Note deleted successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to delete note'
      toast.error(message)
      throw error
    }
  }
}