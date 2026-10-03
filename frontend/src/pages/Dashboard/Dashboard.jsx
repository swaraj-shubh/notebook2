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
import { cache } from '../../lib/cache'

const Dashboard = () => {
  const [notes, setNotes] = useState(cache.get('notes') ?? [])
  const [loading, setLoading] = useState(!cache.has('notes'))
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
      cache.set('notes', data)
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
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      
      <div className="md:ml-70 animate-fade-up p-4 pb-24 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-ink">My Notes</h1>
          <Link
            to="/create-note"
            className="px-4 py-2 flex items-center space-x-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-accent text-on-accent shadow-clay-btn hover:bg-accent-hover hover:text-[#eae5d3] active:shadow-clay-press"
          >
            <FiPlus />
            <span>Create Note</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
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