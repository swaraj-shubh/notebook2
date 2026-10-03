import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiDownload, FiExternalLink, FiMaximize2, FiPlay } from 'react-icons/fi'

// Cloudinary serves a forced download when `fl_attachment` is in the URL
// (the HTML `download` attribute is ignored for cross-origin links).
const downloadUrl = (src) => src.replace('/upload/', '/upload/fl_attachment/')

const iconBtn =
  'bg-card text-ink-2 shadow-clay-sm rounded-full p-2 cursor-pointer transition-all duration-200 hover:bg-bark hover:text-[#eae5d3] hover:scale-110 active:scale-95'

/** An image or video thumbnail with download / open-in-tab / full-screen buttons.
 *  Clicking the media itself opens the full-screen preview. */
const MediaItem = ({ type, src, alt = '' }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative group">
      {type === 'image' ? (
        <img
          src={src}
          alt={alt}
          onClick={() => setOpen(true)}
          className="w-full h-auto rounded-2xl shadow-clay-sm cursor-zoom-in"
        />
      ) : (
        <div className="relative cursor-zoom-in" onClick={() => setOpen(true)}>
          <video src={src} preload="metadata" muted className="w-full rounded-2xl shadow-clay-sm pointer-events-none" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card/90 text-ink rounded-full p-4 shadow-clay-sm"><FiPlay size={22} /></span>
          </span>
        </div>
      )}

      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <a href={downloadUrl(src)} download title="Download" aria-label="Download" className={iconBtn}>
          <FiDownload size={16} />
        </a>
        <a href={src} target="_blank" rel="noopener noreferrer" title="Open in new tab" aria-label="Open in new tab" className={iconBtn}>
          <FiExternalLink size={16} />
        </a>
        <button type="button" onClick={() => setOpen(true)} title="Full screen" aria-label="Full screen" className={iconBtn}>
          <FiMaximize2 size={16} />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] bg-backdrop backdrop-blur-md animate-fade-in flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            {type === 'image' ? (
              <img src={src} alt={alt} className="max-w-full max-h-full rounded-2xl shadow-clay" />
            ) : (
              <video
                src={src}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-2xl shadow-clay"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

export default MediaItem
