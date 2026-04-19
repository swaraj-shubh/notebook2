import { useEffect } from 'react'
import { FiX, FiImage, FiVideo, FiDownload } from 'react-icons/fi'

const NotePreviewModal = ({ note, isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !note) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition bg-white rounded-full p-1"
          >
            <FiX size={24} />
          </button>

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 pr-8">{note.title}</h3>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Main Content */}
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700">
                {note.content}
              </div>
            </div>

            {/* Images Section */}
            {note.images && note.images.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiImage className="mr-2" /> Images ({note.images.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {note.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                        }}
                      />
                      <a
                        href={img}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition shadow-md"
                      >
                        <FiDownload size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {note.videos && note.videos.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiVideo className="mr-2" /> Videos ({note.videos.length})
                </h4>
                <div className="space-y-4">
                  {note.videos.map((video, idx) => (
                    <div key={idx} className="space-y-2">
                      <video
                        controls
                        className="w-full rounded-lg shadow-md"
                        src={video}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <a
                        href={video}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <FiDownload size={14} />
                        <span>Download video {idx + 1}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No media message */}
            {(!note.images || note.images.length === 0) && (!note.videos || note.videos.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <p>No images or videos attached to this note.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotePreviewModal