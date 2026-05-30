import { useState, useEffect } from 'react'
import api from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { FiTrash2, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await api.get('/admin/notes')
      setNotes(response.data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  // const handleDeleteNote = async (noteId) => {
  //   if (window.confirm('Are you sure you want to delete this note?')) {
  //     try {
  //       await api.delete(`/admin/note/${noteId}`)
  //       toast.success('Note deleted successfully')
  //       fetchNotes()
  //     } catch (error) {
  //       toast.error('Failed to delete note')
  //     }
  //   }
  // }

  const handleViewNote = (note) => {
    setSelectedNote(note)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Notes</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewNote(note)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {note.content}
                </p>
                <div className="text-xs text-gray-500">
                  Owner ID: {note.owner_id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing note */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-500 hover:text-gray-700"
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
                <div className="grid grid-cols-3 gap-2">
                  {selectedNote.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`note-${idx}`} className="rounded" />
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
                      <a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-600">
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