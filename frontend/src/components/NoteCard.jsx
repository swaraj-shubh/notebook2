import { FiEdit2, FiTrash2, FiImage, FiVideo } from 'react-icons/fi'

const NoteCard = ({ note, onEdit, onDelete, onPreview }) => {
  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return ''
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
      onClick={() => onPreview(note)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 flex-1">{note.title}</h3>
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(note)
              }}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="Edit"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note._id)
              }}
              className="text-red-600 hover:text-red-700 p-1"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {truncateContent(note.content)}
        </p>

        {/* Media indicators */}
        <div className="flex flex-wrap gap-3 mt-2">
          {note.images && note.images.length > 0 && (
            <div className="flex items-center text-gray-500 text-sm">
              <FiImage className="mr-1" /> {note.images.length} image(s)
            </div>
          )}
          
          {note.videos && note.videos.length > 0 && (
            <div className="flex items-center text-gray-500 text-sm">
              <FiVideo className="mr-1" /> {note.videos.length} video(s)
            </div>
          )}
        </div>

        {/* Show first image thumbnail if exists */}
        {note.images && note.images.length > 0 && (
          <div className="mt-3">
            <img
              src={note.images[0]}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard