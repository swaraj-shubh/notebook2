import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { noteService } from '../../services/noteService'
import FileUpload from '../../components/FileUpload'
import NotePreviewModal from '../../components/NotePreviewModal'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { FiSave, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CreateNote = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    if (!content.trim()) {
      toast.error('Please enter content')
      return
    }
    
    setLoading(true)
    try {
      await noteService.createNote({ 
        title: title.trim(), 
        content: content.trim(), 
        images, 
        videos 
      })
      toast.success('Note created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to create note:', error)
      toast.error('Failed to create note')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (url) => {
    setImages([...images, url])
    toast.success('Image uploaded!')
  }

  const handleVideoUpload = (url) => {
    setVideos([...videos, url])
    toast.success('Video uploaded!')
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index))
  }

  const previewNote = {
    title: title || 'Untitled Note',
    content: content || 'No content yet...',
    images,
    videos
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create New Note</h1>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center space-x-2"
            >
              <FiEye />
              <span>Preview</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter note title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Write your note here..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <FileUpload type="image" onUpload={handleImageUpload} />
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`upload-${idx}`} className="w-full h-24 object-cover rounded" />
                      <button
                        type="button"
                        // onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <FileUpload type="video" onUpload={handleVideoUpload} />
              
              {videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {videos.map((video, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm truncate flex-1">{video.split('/').pop()}</span>
                      <button
                        type="button"
                        // onClick={() => removeVideo(idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
              >
                <FiSave />
                <span>{loading ? 'Saving...' : 'Save Note'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Preview Modal while creating */}
      <NotePreviewModal
        note={previewNote}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}

export default CreateNote