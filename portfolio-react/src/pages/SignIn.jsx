// src/pages/SignIn.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INITIAL = { email: '', password: '' };

function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = 'Enter a valid email';
    if (!formData.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signin(formData.email.trim(), formData.password);
      setStatus({ type: 'success', message: 'Signed in successfully.' });
      setFormData(INITIAL);
      navigate('/');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Sign in failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className="page-title">Sign In</h1>
      <p className="page-intro">Sign in to your account.</p>

      <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate>
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
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: 15 }}>
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}

export default SignIn;
