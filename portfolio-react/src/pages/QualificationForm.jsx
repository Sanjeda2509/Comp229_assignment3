// src/pages/QualificationForm.jsx
import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INITIAL = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: '',
};

function QualificationForm() {
  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = 'Title is required';
    if (!formData.firstname.trim()) next.firstname = 'First name is required';
    if (!formData.lastname.trim()) next.lastname = 'Last name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = 'Enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        completion: formData.completion || undefined,
        description: formData.description.trim() || undefined,
      };
      await apiRequest('/qualifications', { method: 'POST', body: payload });
      setStatus({ type: 'success', message: 'Qualification created successfully.' });
      setFormData(INITIAL);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to create qualification' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className="page-title">Add Qualification</h1>
      <p className="page-intro">Create a new qualification record.</p>

      <section className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required />
            {errors.title && <small className="form-error">{errors.title}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="firstname">First Name *</label>
            <input id="firstname" name="firstname" type="text" value={formData.firstname} onChange={handleChange} required />
            {errors.firstname && <small className="form-error">{errors.firstname}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Last Name *</label>
            <input id="lastname" name="lastname" type="text" value={formData.lastname} onChange={handleChange} required />
            {errors.lastname && <small className="form-error">{errors.lastname}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <small className="form-error">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="completion">Completion Date</label>
            <input id="completion" name="completion" type="date" value={formData.completion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} />
          </div>

          {status && (
            <p style={{ color: status.type === 'success' ? '#1e7e34' : '#c0392b', marginBottom: 12 }}>
              {status.message}
            </p>
          )}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Qualification'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default QualificationForm;
