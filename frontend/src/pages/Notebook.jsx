import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { API } from "@/api/notebooks";
// import (useNavigate) from "react-router-dom";

const Notebook = () => {
  const { id } = useParams();
  const [notebook, setNotebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "", tags: [] });
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: [] });
  const [operationLoading, setOperationLoading] = useState(false);
  const navigate = useNavigate();
  console.log("Notebook ID from URL:", id);
  if (id=="69557c8623d599b29c001778") {
    console.log(import.meta.env.VITE_KYA_DHUND_RAHE);
  }
  const fetchNotebook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/notebooks/${id}`);
      setNotebook(res.data);
    } catch (err) {
      console.error("Error fetching notebook:", err);
      setError(err.response?.data?.detail || err.message || "Failed to fetch notebook");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleNoteClick = useCallback((note) => {
    setSelectedNote(note);
    setEditMode(false);
    setEditData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
    });
  }, []);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleTagChange = useCallback((e) => {
    const tags = e.target.value.split(",").map((t) => t.trim()).filter(t => t);
    setEditData(prev => ({ ...prev, tags }));
  }, []);

  const handleSave = async () => {
    if (!editData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (editData.title.length > 200) {
      alert("Title cannot exceed 200 characters");
      return;
    }

    setOperationLoading(true);
    try {
      const payload = {};
      if (editData.title !== selectedNote.title) payload.title = editData.title;
      if (editData.content !== selectedNote.content) payload.content = editData.content;
      if (JSON.stringify(editData.tags) !== JSON.stringify(selectedNote.tags || [])) {
        payload.tags = editData.tags;
      }

      if (Object.keys(payload).length === 0) {
        setEditMode(false);
        return;
      }

      await API.patch(`/notebooks/${id}/notes/${selectedNote._id}`, payload);
      await fetchNotebook();
      
      // Update selected note
      const updatedNote = notebook.notes.find(note => note._id === selectedNote._id);
      setSelectedNote(updatedNote || selectedNote);
      setEditMode(false);
      alert("✅ Note updated successfully!");
    } catch (err) {
      console.error("Error updating note:", err);
      alert(err.response?.data?.detail || "Failed to update note");
    } finally {
      setOperationLoading(false);
    }
  };

  // const handleDeleteNote = async () => {
  //   if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
  //     return;
  //   }

  //   setOperationLoading(true);
  //   try {
  //     await API.delete(`/notebooks/${id}/notes/${selectedNote._id}`);
  //     await fetchNotebook();
  //     setSelectedNote(null);
  //     alert("🗑️ Note deleted successfully!");
  //   } catch (err) {
  //     console.error("Error deleting note:", err);
  //     alert(err.response?.data?.detail || "Failed to delete note");
  //   } finally {
  //     setOperationLoading(false);
  //   }
  // };

  const createNote = async () => {
    if (!newNote.title.trim()) {
      alert("Title is required");
      return;
    }

    if (newNote.title.length > 200) {
      alert("Title cannot exceed 200 characters");
      return;
    }

    setOperationLoading(true);
    try {
      await API.post(`/notebooks/${id}/notes/`, {
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
      });
      setShowCreateNoteModal(false);
      setNewNote({ title: "", content: "", tags: [] });
      await fetchNotebook();
      alert("✅ Note created successfully!");
    } catch (err) {
      console.error("Error creating note:", err);
      alert(err.response?.data?.detail || "Failed to create note");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (selectedNote) setSelectedNote(null);
      if (showCreateNoteModal) setShowCreateNoteModal(false);
    }
  }, [selectedNote, showCreateNoteModal]);

  useEffect(() => {
    fetchNotebook();
  }, [fetchNotebook]);

  useEffect(() => {
    if (selectedNote || showCreateNoteModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleModalKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleModalKeyDown);
    };
  }, [selectedNote, showCreateNoteModal, handleModalKeyDown]);

  const SkeletonLoader = useMemo(() => (
    <div className="space-y-4">
      <div className="h-8 bg-soft rounded-2xl w-1/4 animate-pulse"></div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-line p-4 bg-card shadow-clay rounded-3xl animate-pulse">
            <div className="h-6 bg-soft rounded-2xl w-3/4 mb-3"></div>
            <div className="h-4 bg-soft rounded-2xl w-full mb-2"></div>
            <div className="h-4 bg-soft rounded-2xl w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  ), []);

  const ErrorDisplay = useMemo(() => (
    <div className="p-4 bg-danger/15 border border-danger/30 rounded-2xl mb-6">
      <p className="text-danger-ink mb-2">Error: {error}</p>
      <button 
        onClick={fetchNotebook}
        className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-danger text-white shadow-clay-btn hover:bg-danger-soft hover:text-bark active:shadow-clay-press"
      >
        Retry
      </button>
    </div>
  ), [error, fetchNotebook]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-6 bg-soft rounded-2xl w-1/4 mb-6 animate-pulse"></div>
        {SkeletonLoader}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-ink-2 mb-6 group relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-soft hover:shadow-clay-sm hover:text-hover-ink p-2"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">All Notebooks</span>
        </button>
        {ErrorDisplay}
      </div>
    );
  }

  if (!notebook) return <p className="p-6 text-ink-2">No notebook found.</p>;

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-ink-2 mb-6 group relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl hover:bg-soft hover:shadow-clay-sm hover:text-hover-ink p-2"
        aria-label="Go back to all notebooks"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-medium">All Notebooks</span>
      </button>     
      
      <h1 className="text-2xl font-bold mb-2 truncate">{notebook.title}</h1>
      <p className="text-ink-2 mb-2">{notebook.description || "No description"}</p>
      {/* <p className="text-sm text-muted mb-6">
        Created on: {new Date(notebook.created_at).toLocaleString("en-IN")}
      </p> */}
      
      {/* <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold">🗒️ Notes</h2>
        <button 
          onClick={() => setShowCreateNoteModal(true)}
          className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-success text-white shadow-clay-btn hover:bg-success-soft hover:text-bark active:shadow-clay-press"
          aria-label="Add new note"
        >
          + Add New Note
        </button>
      </div> */}
      
      {notebook.notes && notebook.notes.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {notebook.notes.map((note) => (
            <div
              key={note._id}
              onClick={() => handleNoteClick(note)}
              onKeyDown={(e) => e.key === 'Enter' && handleNoteClick(note)}
              tabIndex={0}
              role="button"
              aria-label={`Open note: ${note.title}`}
              className="border border-line p-4 bg-card rounded-3xl shadow-clay-sm hover:shadow-clay-hover transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 animate-fade-up duration-300 hover:-translate-y-1 hover:scale-105"
            >
              <h3 className="text-lg font-semibold mb-1 truncate">{note.title}</h3>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-accent/40 text-link-hover px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-muted">+{note.tags.length - 3} more</span>
                  )}
                </div>
              )}

              {/* <div className="text-xs text-muted">
                <p>Created: {new Date(note.created_at).toLocaleDateString("en-IN")}</p>
                {note.updated_at && (
                  <p>Updated: {new Date(note.updated_at).toLocaleDateString("en-IN")}</p>
                )}
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted italic mb-4">No notes in this notebook yet.</p>
          <button 
            onClick={() => setShowCreateNoteModal(true)}
            className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-success text-white shadow-clay-btn hover:bg-success-soft hover:text-bark active:shadow-clay-press"
          >
            Create your first note
          </button>
        </div>
      )}

      {selectedNote && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="note-title"
          className="fixed inset-0 bg-page/95 backdrop-blur-sm animate-fade-in z-50 overflow-y-auto p-6"
        >
          <button
            onClick={() => setSelectedNote(null)}
            className="absolute top-4 right-6 text-ink-2 hover:cursor-pointer text-xl p-2 overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-full rounded-xl hover:bg-soft hover:shadow-clay-sm hover:text-hover-ink"
            aria-label="Close note view"
          >
            ✕
          </button>

          {!editMode ? (
            <div className="max-w-3xl mx-auto mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 id="note-title" className="text-3xl font-bold truncate">
                  {selectedNote.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    // onClick={handleEdit}
                    onClick={() => {
                      window.location.href = import.meta.env.VITE_YAHA_KUCH_NAHI_MILEGA;
                    }} 
                    className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-accent text-on-accent shadow-clay-btn hover:bg-accent-hover hover:text-bark active:shadow-clay-press"
                    aria-label="Edit note"
                  >
                    Edit
                  </button>
                  <button
                    // onClick={handleDeleteNote}
                    onClick={() => {
                      window.location.href = import.meta.env.VITE_YAHA_KUCH_NAHI_MILEGA;
                    }}                    
                    disabled={operationLoading}
                    className="px-4 py-2 disabled:opacity-50 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-danger text-white shadow-clay-btn hover:bg-danger-soft hover:text-bark active:shadow-clay-press"
                    aria-label="Delete note"
                  >
                    {operationLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {selectedNote.tags && selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedNote.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-accent/40 text-link-hover px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

<div className="text-ink-2 whitespace-pre-wrap text-lg leading-relaxed prose max-w-none">
  {selectedNote.content}
</div>

              {/* <div className="text-sm text-muted mt-8 pt-4 border-t">
                <p>
                  Created: {new Date(selectedNote.created_at).toLocaleString("en-IN")}
                </p>
                {selectedNote.updated_at && (
                  <p>
                    Updated: {new Date(selectedNote.updated_at).toLocaleString("en-IN")}
                  </p>
                )}
              </div> */}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto mt-10">
              <h2 className="text-2xl font-bold mb-6">✏️ Edit Note</h2>

              <label htmlFor="edit-title" className="block mb-2 font-semibold">
                Title *
              </label>
              <input
                id="edit-title"
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="w-full p-3 mb-4 bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
                maxLength={200}
                required
              />
              <div className="text-sm text-muted mb-6 text-right">
                {editData.title.length}/200 characters
              </div>

              <label htmlFor="edit-content" className="block mb-2 font-semibold">
                Content
              </label>
              <textarea
                id="edit-content"
                name="content"
                value={editData.content}
                onChange={handleChange}
                rows="12"
                className="w-full p-3 mb-4 bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
              />

              <label htmlFor="edit-tags" className="block mb-2 font-semibold">
                Tags (comma separated)
              </label>
              <input
                id="edit-tags"
                type="text"
                name="tags"
                value={editData.tags.join(", ")}
                onChange={handleTagChange}
                className="w-full p-3 mb-6 bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
                placeholder="tag1, tag2, tag3"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-soft text-ink-2 shadow-clay-btn hover:text-hover-ink active:shadow-clay-press"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-success text-white shadow-clay-btn hover:bg-success-soft hover:text-bark active:shadow-clay-press"
                  disabled={operationLoading || !editData.title.trim()}
                >
                  {operationLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showCreateNoteModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="create-note-title"
          className="fixed inset-0 bg-page/95 backdrop-blur-sm animate-fade-in z-50 overflow-y-auto p-6"
        >
          <button
            onClick={() => setShowCreateNoteModal(false)}
            className="absolute top-4 right-6 text-ink-2 text-xl p-2 overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-full rounded-xl hover:bg-soft hover:shadow-clay-sm hover:text-hover-ink"
            aria-label="Close create note modal"
          >
            ✕
          </button>
          
          <div className="max-w-4xl mx-auto mt-10">
            <h2 id="create-note-title" className="text-3xl font-bold mb-6">Create New Note</h2>
            
            <label htmlFor="create-title" className="block mb-2 font-semibold text-lg">
              Title *
            </label>
            <input
              id="create-title"
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              className="w-full p-3 mb-4 text-lg bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
              placeholder="Note title"
              maxLength={200}
              required
            />
            <div className="text-sm text-muted mb-6 text-right">
              {newNote.title.length}/200 characters
            </div>

            <label htmlFor="create-content" className="block mb-2 font-semibold text-lg">
              Content
            </label>
            <textarea
              id="create-content"
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              rows="12"
              className="w-full p-3 mb-6 text-lg bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
              placeholder="Note content"
            />

            <label htmlFor="create-tags" className="block mb-2 font-semibold text-lg">
              Tags (comma separated)
            </label>
            <input
              id="create-tags"
              type="text"
              value={newNote.tags.join(", ")}
              onChange={(e) => setNewNote({...newNote, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t)})}
              className="w-full p-3 mb-8 text-lg bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
              placeholder="tag1, tag2, tag3"
            />

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateNoteModal(false)}
                className="px-6 py-3 text-lg relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-soft text-ink-2 shadow-clay-btn hover:text-hover-ink active:shadow-clay-press"
                disabled={operationLoading}
              >
                Cancel
              </button>
              <button 
                onClick={createNote}
                className="px-6 py-3 text-lg relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-success text-white shadow-clay-btn hover:bg-success-soft hover:text-bark active:shadow-clay-press"
                disabled={operationLoading || !newNote.title.trim()}
              >
                {operationLoading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notebook;