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
      className="bg-card shadow-clay rounded-3xl hover:shadow-clay-hover cursor-pointer animate-fade-up transition-all duration-300 hover:-translate-y-1 hover:scale-105"
      onClick={() => onPreview(note)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-ink flex-1">{note.title}</h3>
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(note)
              }}
              className="text-link p-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-bark hover:shadow-clay-sm hover:text-[#eae5d3]"
              title="Edit"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note._id)
              }}
              className="text-danger-ink p-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-bark hover:shadow-clay-sm hover:text-[#eae5d3]"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-ink-2 mb-4">
          {truncateContent(note.content)}
        </p>

        {/* Media indicators */}
        <div className="flex flex-wrap gap-3 mt-2">
          {note.images && note.images.length > 0 && (
            <div className="flex items-center text-muted text-sm">
              <FiImage className="mr-1" /> {note.images.length} image(s)
            </div>
          )}
          
          {note.videos && note.videos.length > 0 && (
            <div className="flex items-center text-muted text-sm">
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
              className="w-full h-40 object-cover rounded-2xl shadow-clay-sm"
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