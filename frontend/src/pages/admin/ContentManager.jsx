import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../redux/contentSlice';
import { updateContent } from '../../api/contentAPI';

const ContentManager = () => {
  const dispatch = useDispatch();
  const content = useSelector((state) => state.content);
  const [type, setType] = useState('home');
  const [form, setForm] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchContent(type));
  }, [dispatch, type]);

  useEffect(() => {
    setForm({
      title: content[type]?.title || '',
      description: content[type]?.description || '',
    });
  }, [content, type]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContent(type, form);
      setMessage('Content updated successfully!');
      dispatch(fetchContent(type));
    } catch (err) {
      setMessage('Error updating content.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Content Manager</h2>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Page:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded px-2 py-1">
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>
      </form>
      {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
};

export default ContentManager;
