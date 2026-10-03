import { useState, useEffect } from 'react'
import api from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { FiTrash2, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { cache } from '../../lib/cache'

const Notes = () => {
  const [notes, setNotes] = useState(cache.get('admin-notes') ?? [])
  const [loading, setLoading] = useState(!cache.has('admin-notes'))
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await api.get('/admin/notes')
      setNotes(response.data)
      cache.set('admin-notes', response.data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/admin/note/${noteId}`)
        toast.success('Note deleted successfully')
        fetchNotes()
      } catch (error) {
        toast.error('Failed to delete note')
      }
    }
  }

  const handleViewNote = (note) => {
    setSelectedNote(note)
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      
      <div className="md:ml-70 animate-fade-up p-4 pb-32 md:p-7">
        <h1 className="text-3xl font-bold text-ink mb-8">Manage Notes</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-card shadow-clay rounded-3xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-ink">{note.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewNote(note)}
                      className="text-link relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-bark hover:shadow-clay-sm hover:text-[#eae5d3] p-2"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      // onClick={() => handleDeleteNote(note._id)}
                      className="text-danger-ink relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-bark hover:shadow-clay-sm hover:text-[#eae5d3] p-2"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-ink-2 text-sm mb-4 line-clamp-3">
                  {note.content}
                </p>
                <div className="text-xs text-muted">
                  Owner ID: {note.owner_id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing note */}
      {selectedNote && (
        <div className="fixed inset-0 bg-backdrop backdrop-blur-md animate-fade-in flex items-center justify-center z-50">
          <div className="bg-card shadow-clay rounded-3xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto animate-pop-in">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-muted relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-bark hover:shadow-clay-sm hover:text-[#eae5d3] p-2"
              >
                ✕
              </button>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
            {selectedNote.images?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Images:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedNote.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`note-${idx}`} className="rounded-2xl shadow-clay-sm" />
                  ))}
                </div>
              </div>
            )}
            {selectedNote.videos?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Videos:</h3>
                <ul className="list-disc list-inside">
                  {selectedNote.videos.map((video, idx) => (
                    <li key={idx}>
                      <a href={video} target="_blank" rel="noopener noreferrer" className="text-link">
                        Video {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes