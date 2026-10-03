import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "@/api/notebooks";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotebook, setNewNotebook] = useState({ title: "", description: "" });
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  const fetchNotebooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/notebooks");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      setError(error.response?.data?.detail || error.message || "Failed to fetch notebooks");
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotebook = async () => {
    if (!newNotebook.title.trim()) {
      alert("Title is required");
      return;
    }

    if (newNotebook.title.length > 100) {
      alert("Title cannot exceed 100 characters");
      return;
    }

    if (newNotebook.description && newNotebook.description.length > 500) {
      alert("Description cannot exceed 500 characters");
      return;
    }

    try {
      await API.post("/notebooks/", newNotebook);
      setShowCreateModal(false);
      setNewNotebook({ title: "", description: "" });
      fetchNotebooks();
    } catch (error) {
      console.error("Error creating notebook:", error);
      alert(error.response?.data?.detail || "Failed to create notebook");
    }
  };

  // const deleteNotebook = async (notebookId, e) => {
  //   e.stopPropagation();
  //   if (!window.confirm("Are you sure you want to delete this notebook? This action cannot be undone.")) {
  //     return;
  //   }

  //   // Optimistic update
  //   const previousData = [...data];
  //   const filteredData = data.filter(item => item._id !== notebookId);
  //   setData(filteredData);
  //   setDeleteLoading(notebookId);

  //   try {
  //     await API.delete(`/notebooks/${notebookId}`);
  //   } catch (error) {
  //     // Revert on error
  //     setData(previousData);
  //     console.error("Error deleting notebook:", error);
  //     alert(error.response?.data?.detail || "Failed to delete notebook");
  //   } finally {
  //     setDeleteLoading(null);
  //   }
  // };

  const handleNotebookClick = useCallback((notebookId) => {
    navigate(`/notebook/${notebookId}`);
  }, [navigate]);

  const handleKeyDown = useCallback((e, notebookId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNotebookClick(notebookId);
    }
  }, [handleNotebookClick]);

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  const handleModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowCreateModal(false);
    }
  }, []);

  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleModalKeyDown);
      
      // Focus first input when modal opens
      setTimeout(() => {
        const firstInput = document.querySelector('#notebook-title-input');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleModalKeyDown);
    };
  }, [showCreateModal, handleModalKeyDown]);

  const EmptyState = useMemo(() => (
    <div className="text-center py-10" data-testid="empty-state">
      <p className="text-muted mb-4">No notebooks found.</p>
      <button 
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-accent text-on-accent shadow-clay-btn hover:bg-accent-hover hover:text-bark active:shadow-clay-press"
      >
        Create your first notebook
      </button>
    </div>
  ), []);

  const SkeletonLoader = useMemo(() => (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" data-testid="skeleton-loader">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-line p-5 bg-card shadow-clay rounded-3xl animate-pulse">
          <div className="h-6 bg-soft rounded-2xl w-3/4 mb-4"></div>
          <div className="h-4 bg-soft rounded-2xl w-full mb-2"></div>
          <div className="h-4 bg-soft rounded-2xl w-1/2"></div>
        </div>
      ))}
    </div>
  ), []);

  const ErrorDisplay = useMemo(() => (
    <div className="p-4 bg-danger/15 border border-danger/30 rounded-2xl mb-6" data-testid="error-display">
      <p className="text-danger-ink mb-2">Error: {error}</p>
      <p className="text-danger-ink mb-2">or kindly wait for a minute to fetch the data</p>
      <button 
        onClick={fetchNotebooks}
        className="px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-danger text-white shadow-clay-btn hover:bg-danger-soft hover:text-bark active:shadow-clay-press"
      >
        Retry
      </button>
    </div>
  ), [error, fetchNotebooks]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📒 All Notebooks</h1>
        {SkeletonLoader}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📒 All Notebooks</h1>
      
      {error && ErrorDisplay}
      
      <button 
        onClick={() => setShowCreateModal(true)}
        className="mb-6 px-4 py-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-accent text-on-accent shadow-clay-btn hover:bg-accent-hover hover:text-bark active:shadow-clay-press"
        aria-label="Create new notebook"
      >
        + Create Notebook
      </button>
      
      {data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((notebook) => (
            <div
              key={notebook._id}
              onClick={() => handleNotebookClick(notebook._id)}
              onKeyDown={(e) => handleKeyDown(e, notebook._id)}
              tabIndex={0}
              role="button"
              aria-label={`Open notebook: ${notebook.title}`}
              className="border border-line p-5 shadow-clay-sm hover:shadow-clay-hover transition-all bg-card rounded-3xl cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 animate-fade-up duration-300 hover:-translate-y-1 hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-1 truncate">{notebook.title}</h2>
              <p className="text-ink-2 mb-2 line-clamp-2">
                {notebook.description || "No description provided."}
              </p>
              {/* <p className="text-sm text-muted mb-4">
                Created: {new Date(notebook.created_at).toLocaleString("en-IN")}
              </p> */}

              <button 
                // onClick={(e) => deleteNotebook(notebook._id, e)}
                onClick={() => {
                      window.location.href = import.meta.env.VITE_YAHA_KUCH_NAHI_MILEGA;
                }}
                disabled={deleteLoading === notebook._id}
                className="absolute top-2 right-2 mt-2 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 rounded-2xl bg-danger text-white shadow-clay-btn hover:bg-danger-soft hover:text-bark active:shadow-clay-press"
                aria-label={`Delete notebook: ${notebook.title}`}
              >
                {deleteLoading === notebook._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        !error && EmptyState
      )}

      {showCreateModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-title"
          className="fixed inset-0 bg-page/95 backdrop-blur-sm animate-fade-in z-50 overflow-y-auto p-6"
        >
          <div className="max-w-2xl mx-auto mt-20">
            <h2 id="modal-title" className="text-3xl font-bold mb-6">Create New Notebook</h2>
            
            <label htmlFor="notebook-title-input" className="block mb-2 font-semibold text-lg">
              Notebook Title *
            </label>
            <input
              id="notebook-title-input"
              type="text"
              placeholder="Enter notebook title"
              value={newNotebook.title}
              onChange={(e) => setNewNotebook({...newNotebook, title: e.target.value})}
              className="w-full p-3 mb-4 text-lg bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
              maxLength={100}
              required
            />
            <div className="text-sm text-muted mb-6 text-right">
              {newNotebook.title.length}/100 characters
            </div>
            
            <label htmlFor="notebook-description-input" className="block mb-2 font-semibold text-lg">
              Description (optional)
            </label>
            <textarea
              id="notebook-description-input"
              placeholder="Enter notebook description"
              value={newNotebook.description}
              onChange={(e) => setNewNotebook({...newNotebook, description: e.target.value})}
              className="w-full p-3 mb-4 text-lg bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted"
              rows="4"
              maxLength={500}
            />
            <div className="text-sm text-muted mb-8 text-right">
              {newNotebook.description.length}/500 characters
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-lg relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-soft text-ink-2 shadow-clay-btn hover:text-hover-ink active:shadow-clay-press"
              >
                Cancel
              </button>
              <button 
                onClick={createNotebook}
                className="px-6 py-3 text-lg relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-success text-white shadow-clay-btn hover:bg-success-soft hover:text-bark active:shadow-clay-press"
                disabled={!newNotebook.title.trim()}
              >
                Create Notebook
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(false)}
            className="absolute top-4 right-6 text-ink-2 text-xl p-2 overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-full rounded-xl hover:bg-soft hover:shadow-clay-sm hover:text-hover-ink"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;