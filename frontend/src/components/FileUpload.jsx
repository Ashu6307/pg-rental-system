import React, { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ onUpload, accept = 'image/*,application/pdf' }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return setError('Select a file first');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpload(res.data.fileUrl);
      setFile(null);
    } catch (err) {
      setError('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="mb-2">
      <input type="file" accept={accept} onChange={handleChange} className="input" />
      <button type="button" className="btn btn-secondary ml-2" onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
      {error && <div className="text-red-600 mt-1">{error}</div>}
    </div>
  );
}
