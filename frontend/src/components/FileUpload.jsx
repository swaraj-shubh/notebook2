import { useState } from 'react'
import { uploadService } from '../services/uploadService'
import { FiUpload, FiX, FiImage, FiVideo } from 'react-icons/fi'

const FileUpload = ({ onUpload, type = 'image' }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview for images
    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }

    setUploading(true)
    try {
      const url = type === 'image' 
        ? await uploadService.uploadImage(file)
        : await uploadService.uploadVideo(file)
      
      onUpload(url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
      setPreview(null)
    }
  }

  return (
    <div className="relative">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-2xl cursor-pointer hover:border-accent transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          ) : (
            <>
              {type === 'image' ? <FiImage size={32} /> : <FiVideo size={32} />}
              <p className="mt-2 text-sm text-muted">
                Click to upload {type}
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {preview && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <button
            onClick={() => setPreview(null)}
            className="p-1 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-full bg-danger text-white shadow-clay-btn hover:bg-danger-soft hover:text-bark active:shadow-clay-press"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload