import { useState, useEffect, useCallback } from 'react';
import './LostFound.css';
import { getToken, authFetch } from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectField from '../components/SelectField';
import { useToast } from '../context/ToastContext';
import SearchBar from '../components/SearchBar';

const LostFound = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // Search and filter state
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    filters: { status: 'open' },
    sortBy: ''
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });
  
  // Filters (keeping for backward compatibility)
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: 'open',
    search: '',
  });
  
  // Form state
  const [form, setForm] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'others',
    location: '',
    date: '',
    contactMethod: 'email',
    contactInfo: '',
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  
  const { showToast } = useToast();
  const token = getToken();
  
  const categoryOptions = [
    { value: 'id', label: '🆔 Student ID' },
    { value: 'electronics', label: '📱 Electronics' },
    { value: 'books', label: '📚 Books' },
    { value: 'keys', label: '🔑 Keys' },
    { value: 'wallet', label: '💳 Wallet' },
    { value: 'clothing', label: '👔 Clothing' },
    { value: 'others', label: '📦 Others' },
  ];
  
  const contactMethodOptions = [
    { value: 'email', label: '📧 Email' },
    { value: 'chat', label: '💬 Chat' },
    { value: 'phone', label: '📞 Phone' },
  ];
  
  useEffect(() => {
    loadPosts();
  }, [searchParams, pagination.page]);
  
  const handleSearch = useCallback(({ searchTerm, filters, sortBy }) => {
    setSearchParams({ searchTerm, filters, sortBy });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  }, []);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchParams.searchTerm) params.append('search', searchParams.searchTerm);
      if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);
      if (searchParams.filters.status) params.append('status', searchParams.filters.status);
      if (searchParams.filters.type) params.append('type', searchParams.filters.type);
      if (searchParams.filters.category) params.append('category', searchParams.filters.category);
      if (searchParams.filters.dateFrom) params.append('dateFrom', searchParams.filters.dateFrom);
      if (searchParams.filters.dateTo) params.append('dateTo', searchParams.filters.dateTo);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      const queryString = params.toString();
      const url = `/api/lost-found${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const text = await response.text();
      const result = text ? JSON.parse(text) : [];
      
      // Handle both old format (array) and new format (object with data/pagination)
      if (Array.isArray(result)) {
        setPosts(result);
      } else {
        setPosts(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load posts', err);
      showToast('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.date) newErrors.date = 'Date is required';
    return newErrors;
  };
  
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!token) {
      showToast('Please login to create a post', 'error');
      return;
    }
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (selectedImage) formData.append('image', selectedImage);
      
      const response = await fetch('/api/lost-found', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!response.ok) throw new Error(data.error || 'Failed to create post');
      
      showToast(`${form.type === 'lost' ? 'Lost' : 'Found'} item posted successfully`, 'success');
      setShowCreateModal(false);
      resetForm();
      loadPosts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditPost = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (selectedImage) formData.append('image', selectedImage);
      
      const response = await fetch(`/api/lost-found/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!response.ok) throw new Error(data.error || 'Failed to update post');
      
      showToast('Post updated successfully', 'success');
      setShowEditModal(false);
      setEditingPost(null);
      resetForm();
      loadPosts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await authFetch(`/api/lost-found/${postId}`, { method: 'DELETE' });
      setSelectedPost(null);
      showToast('Post deleted successfully', 'success');
      loadPosts();
    } catch (err) {
      showToast(err.error || err.message || 'Failed to delete post', 'error');
    }
  };
  
  const handleResolvePost = async (postId) => {
    try {
      await authFetch(`/api/lost-found/${postId}/resolve`, { method: 'PATCH' });
      showToast('Post marked as resolved', 'success');
      loadPosts();
    } catch (err) {
      showToast(err.message || 'Failed to resolve post', 'error');
    }
  };
  
  const openEditModal = (post) => {
    setEditingPost(post);
    setForm({
      type: post.type,
      title: post.title,
      description: post.description,
      category: post.category,
      location: post.location,
      date: post.date.split('T')[0],
      contactMethod: post.contactMethod,
      contactInfo: post.contactInfo || '',
    });
    setImagePreview(post.imageUrl || null);
    setShowEditModal(true);
  };
  
  const resetForm = () => {
    setForm({
      type: 'lost',
      title: '',
      description: '',
      category: 'others',
      location: '',
      date: '',
      contactMethod: 'email',
      contactInfo: '',
    });
    setSelectedImage(null);
    setImagePreview(null);
    setErrors({});
  };
  
  const loadSuggestions = async (postId) => {
    try {
      const response = await fetch(`/api/lost-found/${postId}/suggestions`);
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setSuggestions(data || []);
    } catch (err) {
      console.error('Failed to load suggestions', err);
    }
  };
  
  const openPostDetails = (post) => {
    setSelectedPost(post);
    setCommentText('');
    setEditingComment(null);
    loadSuggestions(post._id);
    loadComments(post._id);
  };
  
  const loadComments = async (postId) => {
    try {
      setLoadingComments(true);
      const response = await fetch(`/api/comments/${postId}`);
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments', err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };
  
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      showToast('Comment cannot be empty', 'warning');
      return;
    }
    
    if (!token) {
      showToast('Please login to comment', 'info');
      return;
    }
    
    try {
      const response = await authFetch(`/api/comments/${selectedPost._id}`, {
        method: 'POST',
        body: { text: commentText }
      });
      setComments([response, ...comments]);
      setCommentText('');
      showToast('Comment added successfully', 'success');
    } catch (err) {
      showToast(err.error || 'Failed to add comment', 'error');
    }
  };
  
  const handleAddReply = async (parentCommentId) => {
    if (!replyText.trim()) {
      showToast('Reply cannot be empty', 'warning');
      return;
    }
    
    if (!token) {
      showToast('Please login to reply', 'info');
      return;
    }
    
    try {
      const response = await authFetch(`/api/comments/${selectedPost._id}`, {
        method: 'POST',
        body: { text: replyText, parentId: parentCommentId }
      });
      
      // Add reply to the parent comment's replies array
      setComments(comments.map(c => 
        c._id === parentCommentId 
          ? { ...c, replies: [...(c.replies || []), response] }
          : c
      ));
      
      setReplyText('');
      setReplyingTo(null);
      showToast('Reply added successfully', 'success');
    } catch (err) {
      showToast(err.error || 'Failed to add reply', 'error');
    }
  };
  
  const handleUpdateComment = async () => {
    if (!editingCommentText.trim()) {
      showToast('Comment cannot be empty', 'warning');
      return;
    }
    
    try {
      const response = await authFetch(`/api/comments/${editingComment._id}`, {
        method: 'PUT',
        body: { text: editingCommentText }
      });
      setComments(comments.map(c => c._id === editingComment._id ? response : c));
      setEditingComment(null);
      setEditingCommentText('');
      showToast('Comment updated', 'success');
    } catch (err) {
      showToast(err.error || 'Failed to update comment', 'error');
    }
  };
  
  const handleDeleteComment = async (commentId, parentId = null) => {
    if (!window.confirm('Delete this comment?')) return;
    
    try {
      await authFetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      
      if (parentId) {
        // Delete reply from parent comment's replies array
        setComments(comments.map(c => 
          c._id === parentId
            ? { ...c, replies: c.replies.filter(r => r._id !== commentId) }
            : c
        ));
      } else {
        // Delete top-level comment
        setComments(comments.filter(c => c._id !== commentId));
      }
      
      showToast('Comment deleted', 'success');
    } catch (err) {
      showToast(err.error || 'Failed to delete comment', 'error');
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      id: '🆔',
      electronics: '📱',
      books: '📚',
      keys: '🔑',
      wallet: '💳',
      clothing: '👔',
      others: '📦'
    };
    return icons[category] || '📦';
  };

  // SearchBar filter configuration
  const searchFilters = [
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'lost', label: '❌ Lost' },
        { value: 'found', label: '✅ Found' },
      ]
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        ...categoryOptions
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'open', label: '🔓 Open' },
        { value: 'resolved', label: '✅ Resolved' },
      ]
    },
    {
      name: 'date',
      label: 'Date',
      type: 'dateRange'
    }
  ];

  return (
    <div className="lostfound-page">
      <div className="lostfound-container">
        <div className="lostfound-header">
          <h1>🔍 Lost & Found</h1>
          <p>Help your fellow students find their lost items</p>
        </div>
        
        {/* Modern SearchBar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by item name, description, or location..."
          filters={searchFilters}
          showSort={true}
        />
        
        {/* Create Post Button */}
        {token && (
          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              ➕ Create Post
            </Button>
          </div>
        )}
        
        {/* Old Filters (keeping for backward compatibility) - can be removed later */}
        <div className="lostfound-filters" style={{ display: 'none' }}>
          <Input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="🔍 Search items..."
          />
          
          <SelectField
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            options={[
              { value: '', label: 'All Types' },
              { value: 'lost', label: '❌ Lost' },
              { value: 'found', label: '✅ Found' },
            ]}
          />
          
          <SelectField
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            options={[
              { value: '', label: 'All Categories' },
              ...categoryOptions
            ]}
          />
          
          <SelectField
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: 'open', label: '🟢 Open' },
              { value: 'resolved', label: '✅ Resolved' },
              { value: '', label: 'All Status' },
            ]}
          />
          
          {token && (
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              ➕ Create Post
            </Button>
          )}
        </div>
        
        {/* Posts Grid */}
        {loading ? (
          <div className="lostfound-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="lostfound-empty">
            <div className="empty-icon">📭</div>
            <h3>No items found</h3>
            <p>{searchParams.searchTerm || Object.keys(searchParams.filters).length > 1 ? 'No items match your search criteria' : 'Be the first to post a lost or found item'}</p>
          </div>
        ) : (
          <div className="lostfound-grid">
            {posts.map(post => (
              <div 
                key={post._id} 
                className={`lostfound-card ${post.status === 'resolved' ? 'resolved' : ''}`}
                onClick={() => openPostDetails(post)}
              >
                {post.imageUrl && (
                  <div className="card-image">
                    <img src={post.imageUrl} alt={post.title} />
                  </div>
                )}
                
                <div className="card-content">
                  <div className="card-badges">
                    <span className={`badge badge-${post.type}`}>
                      {post.type === 'lost' ? '❌ Lost' : '✅ Found'}
                    </span>
                    <span className="badge badge-category">
                      {getCategoryIcon(post.category)} {post.category}
                    </span>
                    {post.status === 'resolved' && (
                      <span className="badge badge-resolved">✅ Resolved</span>
                    )}
                  </div>
                  
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-description">{post.description}</p>
                  
                  <div className="card-meta">
                    <span className="meta-item">📍 {post.location}</span>
                    <span className="meta-item">📅 {formatDate(post.date)}</span>
                  </div>
                  
                  <div className="card-footer">
                    <span className="posted-by">
                      Posted by: <strong>{post.userId?.name || 'Unknown'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
              disabled={pagination.page === pagination.pages}
            >
              Next →
            </button>
          </div>
        )}
        
        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Post</h2>
                <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleCreatePost} className="modal-form">
                <SelectField
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  options={[
                    { value: 'lost', label: '❌ Lost Item' },
                    { value: 'found', label: '✅ Found Item' },
                  ]}
                  label="Post Type"
                  required
                />
                
                <Input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  label="Item Name"
                  placeholder="e.g., Black wallet"
                  error={errors.title}
                  required
                />
                
                <SelectField
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  options={categoryOptions}
                  label="Category"
                  required
                />
                
                <div className="form-group">
                  <label className="input-label">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="textarea"
                    rows="4"
                    placeholder="Provide details about the item..."
                    required
                  />
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>
                
                <Input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  label="Location"
                  placeholder="e.g., Near cafeteria"
                  error={errors.location}
                  required
                />
                
                <Input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  label="Date"
                  error={errors.date}
                  required
                />
                
                <SelectField
                  name="contactMethod"
                  value={form.contactMethod}
                  onChange={handleFormChange}
                  options={contactMethodOptions}
                  label="Contact Method"
                />
                
                <Input
                  type="text"
                  name="contactInfo"
                  value={form.contactInfo}
                  onChange={handleFormChange}
                  label="Contact Info (Optional)"
                  placeholder="Phone number or email"
                />
                
                <div className="form-group">
                  <label className="input-label">Upload Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
                
                <div className="modal-actions">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="success" isLoading={loading}>
                    Create Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Edit Post Modal */}
        {showEditModal && editingPost && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Post</h2>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleEditPost} className="modal-form">
                <SelectField
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  options={[
                    { value: 'lost', label: '❌ Lost Item' },
                    { value: 'found', label: '✅ Found Item' },
                  ]}
                  label="Post Type"
                  required
                />
                
                <Input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  label="Item Name"
                  error={errors.title}
                  required
                />
                
                <SelectField
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  options={categoryOptions}
                  label="Category"
                  required
                />
                
                <div className="form-group">
                  <label className="input-label">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="textarea"
                    rows="4"
                    required
                  />
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>
                
                <Input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  label="Location"
                  error={errors.location}
                  required
                />
                
                <Input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  label="Date"
                  error={errors.date}
                  required
                />
                
                <SelectField
                  name="contactMethod"
                  value={form.contactMethod}
                  onChange={handleFormChange}
                  options={contactMethodOptions}
                  label="Contact Method"
                />
                
                <Input
                  type="text"
                  name="contactInfo"
                  value={form.contactInfo}
                  onChange={handleFormChange}
                  label="Contact Info"
                />
                
                <div className="form-group">
                  <label className="input-label">Upload New Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
                
                <div className="modal-actions">
                  <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="success" isLoading={loading}>
                    Update Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Post Details Modal */}
        {selectedPost && (
          <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Post Details</h2>
                <button className="modal-close" onClick={() => setSelectedPost(null)}>×</button>
              </div>
              
              <div className="post-details">
                {selectedPost.imageUrl && (
                  <div className="detail-image">
                    <img src={selectedPost.imageUrl} alt={selectedPost.title} />
                  </div>
                )}
                
                <div className="detail-badges">
                  <span className={`badge badge-${selectedPost.type}`}>
                    {selectedPost.type === 'lost' ? '❌ Lost' : '✅ Found'}
                  </span>
                  <span className="badge badge-category">
                    {getCategoryIcon(selectedPost.category)} {selectedPost.category}
                  </span>
                  {selectedPost.status === 'resolved' && (
                    <span className="badge badge-resolved">✅ Resolved</span>
                  )}
                </div>
                
                <h2>{selectedPost.title}</h2>
                <p className="detail-description">{selectedPost.description}</p>
                
                <div className="detail-info">
                  <div className="info-row">
                    <span className="info-label">📍 Location:</span>
                    <span>{selectedPost.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">📅 Date:</span>
                    <span>{formatDate(selectedPost.date)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">👤 Posted by:</span>
                    <span>{selectedPost.userId?.name} {selectedPost.userId?.studentId && `(ID: ${selectedPost.userId.studentId})`}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">📧 Contact:</span>
                    <span>{selectedPost.contactMethod}</span>
                  </div>
                  {selectedPost.contactInfo && (
                    <div className="info-row">
                      <span className="info-label">ℹ️ Contact Info:</span>
                      <span>{selectedPost.contactInfo}</span>
                    </div>
                  )}
                </div>
                
                {/* Owner Actions */}
                {token && selectedPost.userId?._id && (
                  (() => {
                    const currentUser = JSON.parse(localStorage.getItem('campusbuddy.user') || '{}');
                    const isOwner = selectedPost.userId._id === currentUser._id;
                    return isOwner && (
                      <div className="detail-actions">
                        {selectedPost.status === 'open' && (
                          <Button onClick={() => handleResolvePost(selectedPost._id)} variant="success">
                            ✅ Mark as Resolved
                          </Button>
                        )}
                        <Button onClick={() => openEditModal(selectedPost)} variant="primary">
                          ✏️ Edit
                        </Button>
                        <Button onClick={() => handleDeletePost(selectedPost._id)} variant="danger">
                          🗑️ Delete
                        </Button>
                      </div>
                    );
                  })()
                )}
                
                {/* Matching Suggestions */}
                {suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <h3>🔗 Similar {selectedPost.type === 'lost' ? 'Found' : 'Lost'} Items</h3>
                    <div className="suggestions-grid">
                      {suggestions.map(sug => (
                        <div key={sug._id} className="suggestion-card" onClick={() => openPostDetails(sug)}>
                          <span className={`badge badge-${sug.type}`}>
                            {sug.type === 'lost' ? '❌ Lost' : '✅ Found'}
                          </span>
                          <h4>{sug.title}</h4>
                          <p>{sug.location}</p>
                          <small>By: {sug.userId?.name}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Comments Section */}
                <div className="comments-section">
                  <h3>💬 Comments ({comments.length})</h3>
                  
                  {/* Add Comment */}
                  {token && (
                    <div className="add-comment">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment... (max 500 characters)"
                        maxLength="500"
                        className="comment-textarea"
                      />
                      <div className="comment-actions">
                        <span className="char-count">{commentText.length}/500</span>
                        <Button 
                          onClick={handleAddComment} 
                          variant="primary"
                          disabled={!commentText.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="comments-loading">Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div className="no-comments">No comments yet. Be the first to comment!</div>
                  ) : (
                    <div className="comments-list">
                      {comments.map(comment => (
                        <div key={comment._id} className="comment-item">
                          <div className="comment-header">
                            <div className="comment-user">
                              {comment.userId?.avatarUrl && (
                                <img src={comment.userId.avatarUrl} alt={comment.userId.name} className="comment-avatar" />
                              )}
                              <div className="comment-user-info">
                                <strong>{comment.userId?.name}</strong>
                                {comment.userId?.studentId && (
                                  <span className="comment-id">(ID: {comment.userId.studentId})</span>
                                )}
                                <small className="comment-time">
                                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </small>
                              </div>
                            </div>
                            
                            {/* Comment Actions */}
                            {token && comment.userId?._id === JSON.parse(localStorage.getItem('campusbuddy.user') || '{}')._id && (
                              <div className="comment-actions-icons">
                                <button 
                                  className="comment-btn edit-btn"
                                  onClick={() => {
                                    setEditingComment(comment);
                                    setEditingCommentText(comment.text);
                                  }}
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="comment-btn delete-btn"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Edit Mode */}
                          {editingComment?._id === comment._id ? (
                            <div className="edit-comment">
                              <textarea
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                maxLength="500"
                                className="comment-textarea"
                              />
                              <div className="comment-actions">
                                <span className="char-count">{editingCommentText.length}/500</span>
                                <Button 
                                  onClick={handleUpdateComment}
                                  variant="success"
                                  size="sm"
                                >
                                  Save
                                </Button>
                                <Button 
                                  onClick={() => setEditingComment(null)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="comment-text">{comment.text}</p>
                              
                              {/* Reply Button */}
                              {token && (
                                <button 
                                  className="reply-btn"
                                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                >
                                  💬 Reply
                                </button>
                              )}
                              
                              {/* Reply Input */}
                              {replyingTo === comment._id && (
                                <div className="reply-input-container">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    maxLength="500"
                                    placeholder="Write a reply..."
                                    className="comment-textarea"
                                  />
                                  <div className="comment-actions">
                                    <span className="char-count">{replyText.length}/500</span>
                                    <Button 
                                      onClick={() => handleAddReply(comment._id)}
                                      variant="primary"
                                      size="sm"
                                    >
                                      Reply
                                    </Button>
                                    <Button 
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }}
                                      variant="secondary"
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Nested Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="replies-list">
                                  {comment.replies.map(reply => (
                                    <div key={reply._id} className="reply-item">
                                      <div className="comment-header">
                                        <div className="comment-user">
                                          {reply.userId?.avatarUrl && (
                                            <img src={reply.userId.avatarUrl} alt={reply.userId.name} className="comment-avatar" />
                                          )}
                                          <div className="comment-user-info">
                                            <strong>{reply.userId?.name}</strong>
                                            {reply.userId?.studentId && (
                                              <span className="comment-id">(ID: {reply.userId.studentId})</span>
                                            )}
                                            <small className="comment-time">
                                              {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}
                                            </small>
                                          </div>
                                        </div>
                                        
                                        {/* Reply Actions */}
                                        {token && reply.userId?._id === JSON.parse(localStorage.getItem('campusbuddy.user') || '{}')._id && (
                                          <div className="comment-actions-icons">
                                            <button 
                                              className="comment-btn delete-btn"
                                              onClick={() => handleDeleteComment(reply._id, comment._id)}
                                              title="Delete"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <p className="comment-text">{reply.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFound;
