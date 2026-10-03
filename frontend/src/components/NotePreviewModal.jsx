import { useEffect, useState } from 'react'
import { FiImage, FiVideo, FiDownload, FiMaximize2 } from 'react-icons/fi'

const NotePreviewModal = ({ note, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(null) // { type: 'image' | 'video', src }
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
        className="fixed inset-0 bg-backdrop backdrop-blur-md animate-fade-in transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card shadow-clay rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-pop-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-line">
            <h3 className="text-xl font-semibold text-ink pr-8">{note.title}</h3>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Main Content */}
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-ink-2">
                {note.content}
              </div>
            </div>

            {/* Images Section */}
            {note.images && note.images.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-ink mb-3 flex items-center">
                  <FiImage className="mr-2" /> Images ({note.images.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {note.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-auto rounded-2xl cursor-zoom-in shadow-clay-sm"
                        onClick={() => setZoom({ type: 'image', src: img })}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                        }}
                      />
                      <a
                        href={img}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-card shadow-clay-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
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
                <h4 className="text-lg font-semibold text-ink mb-3 flex items-center">
                  <FiVideo className="mr-2" /> Videos ({note.videos.length})
                </h4>
                <div className="space-y-4">
                  {note.videos.map((video, idx) => (
                    <div key={idx} className="space-y-2 relative">
                      <button
                        onClick={() => setZoom({ type: 'video', src: video })}
                        className="absolute top-2 right-2 z-10 p-2 overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-full bg-soft text-ink-2 shadow-clay-btn hover:bg-bark hover:text-[#eae5d3] active:shadow-clay-press"
                        title="Full screen"
                      >
                        <FiMaximize2 size={16} />
                      </button>
                      <video
                        controls
                        className="w-full rounded-2xl shadow-clay"
                        src={video}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <a
                        href={video}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-link hover:text-link-hover"
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
              <div className="text-center text-muted py-8">
                <p>No images or videos attached to this note.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-soft2 border-t border-line rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm focus:outline-none relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-soft text-ink-2 shadow-clay-btn hover:bg-bark hover:text-[#eae5d3] active:shadow-clay-press"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-[60] bg-backdrop backdrop-blur-md animate-fade-in flex items-center justify-center p-4"
          onClick={() => setZoom(null)}
        >
          {zoom.type === 'image' ? (
            <img src={zoom.src} alt="Full screen" className="max-w-full max-h-full rounded-2xl shadow-clay-sm" />
          ) : (
            <video src={zoom.src} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-clay" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </div>
  )
}

export default NotePreviewModal