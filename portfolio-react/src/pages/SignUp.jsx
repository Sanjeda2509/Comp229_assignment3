// src/pages/SignUp.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INITIAL = { name: '', email: '', password: '' };

function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = 'Enter a valid email';
    if (!formData.password) next.password = 'Password is required';
    else if (formData.password.length < 6)
      next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(formData.name.trim(), formData.email.trim(), formData.password);
      setStatus({ type: 'success', message: 'Account created successfully. Please sign in.' });
      setFormData(INITIAL);
      setTimeout(() => navigate('/signin'), 1200);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Sign up failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className="page-title">Sign Up</h1>
      <p className="page-intro">Create your account to manage qualifications and projects.</p>

      <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <small style={{ color: '#c0392b' }}>{errors.name}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <small style={{ color: '#c0392b' }}>{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <small style={{ color: '#c0392b' }}>{errors.password}</small>}
          </div>

          {status && (
            <p style={{ color: status.type === 'success' ? '#1e7e34' : '#c0392b', marginBottom: 12 }}>
              {status.message}
            </p>
          )}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: 15 }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignUp;
