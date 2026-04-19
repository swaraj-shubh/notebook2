import api from './api'
import toast from 'react-hot-toast'

export const uploadService = {
  async uploadImage(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      toast.success('Image uploaded successfully!')
      return response.data.url
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload image')
      throw error
    }
  },

  async uploadVideo(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      toast.success('Video uploaded successfully!')
      return response.data.url
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload video')
      throw error
    }
  }
}