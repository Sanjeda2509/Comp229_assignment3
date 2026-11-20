// src/pages/Contact.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

const INITIAL = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
};

function Contact() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

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
    if (!formData.firstName.trim()) next.firstName = 'First name is required';
    if (!formData.lastName.trim()) next.lastName = 'Last name is required';
    if (!formData.phone.trim()) next.phone = 'Contact number is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = 'Enter a valid email';
    if (!formData.message.trim()) next.message = 'Message is required';
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
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        email: formData.email.trim(),
      };
      await apiRequest('/contacts', { method: 'POST', body: payload });
      setStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
      setFormData(INITIAL);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className="page-title">Contact Me</h1>

      <p className="page-intro">
        Thank you for visiting my portfolio. I am interested in opportunities
        to learn, collaborate, and gain professional experience in software
        development, web development, databases, and artificial intelligence.
        Please feel free to contact me using the form below or connect with me
        through LinkedIn.
      </p>

      <div className="contact-layout">
        <aside className="card contact-info">
          <h2>Contact Information</h2>

          <ul>
            <li>
              <strong>Name:</strong> Sanjeda Sharmin
            </li>

            <li>
              <strong>Location:</strong> Toronto, Ontario, Canada
            </li>

            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:sshar731@my.centennialcollege.ca">
                sshar731@my.centennialcollege.ca
              </a>
            </li>

            <li>
              <strong>LinkedIn:</strong>{" "}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            </li>
          </ul>
        </aside>

        <section className="card contact-form">
          <h2>Send Me a Message</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="first-name">First Name *</label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <small style={{ color: '#c0392b' }}>{errors.firstName}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="last-name">Last Name *</label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <small style={{ color: '#c0392b' }}>{errors.lastName}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Contact Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <small style={{ color: '#c0392b' }}>{errors.phone}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
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
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
              {errors.message && <small style={{ color: '#c0392b' }}>{errors.message}</small>}
            </div>

            {status && (
              <p style={{ color: status.type === 'success' ? '#1e7e34' : '#c0392b', marginBottom: 12 }}>
                {status.message}
              </p>
            )}

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Contact;