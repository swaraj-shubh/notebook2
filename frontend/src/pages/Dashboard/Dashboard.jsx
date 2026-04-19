import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { noteService } from '../../services/noteService'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import NotesList from './NotesList'
import NotePreviewModal from '../../components/NotePreviewModal'
import { FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const data = await noteService.getNotes()
      setNotes(data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(noteId)
        toast.success('Note deleted successfully')
        fetchNotes()
      } catch (error) {
        console.error('Failed to delete note:', error)
        toast.error('Failed to delete note')
      }
    }
  }

  const handleEdit = (note) => {
    navigate(`/edit-note/${note._id}`)
  }

  const handlePreview = (note) => {
    setSelectedNote(note)
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setSelectedNote(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
          <Link
            to="/create-note"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
          >
            <FiPlus />
            <span>Create Note</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <NotesList 
            notes={notes} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}
      </div>

      {/* Preview Modal */}
      <NotePreviewModal
        note={selectedNote}
        isOpen={isPreviewOpen}
        onClose={closePreview}
      />
    </div>
  )
}

export default Dashboard