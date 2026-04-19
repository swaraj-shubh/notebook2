import NoteCard from '../../components/NoteCard'

const NotesList = ({ notes, onEdit, onDelete, onPreview }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No notes yet.</p>
        <p className="text-gray-400">Click "Create Note" to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      ))}
    </div>
  )
}

export default NotesList