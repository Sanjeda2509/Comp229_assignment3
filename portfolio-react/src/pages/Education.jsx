import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

const INITIAL_QUALIFICATION = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: '',
};

function Education() {
  const [apiQualifications, setApiQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(INITIAL_QUALIFICATION);
  const [editStatus, setEditStatus] = useState(null);
  const { isAdmin } = useAuth();

  const fetchQualifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/qualifications');
      setApiQualifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load qualifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchQualifications();
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this qualification?')) return;
    try {
      await apiRequest(`/qualifications/${id}`, { method: 'DELETE' });
      fetchQualifications();
    } catch (err) {
      setError(err.message || 'Failed to delete qualification');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setEditStatus(null);
    try {
      const payload = {
        title: editFormData.title.trim(),
        firstname: editFormData.firstname.trim(),
        lastname: editFormData.lastname.trim(),
        email: editFormData.email.trim(),
        completion: editFormData.completion || undefined,
        description: editFormData.description.trim() || undefined,
      };
      await apiRequest(`/qualifications/${id}`, { method: 'PUT', body: payload });
      setEditStatus({ type: 'success', message: 'Qualification updated successfully.' });
      setEditingId(null);
      setEditFormData(INITIAL_QUALIFICATION);
      fetchQualifications();
    } catch (err) {
      setEditStatus({ type: 'error', message: err.message || 'Failed to update qualification' });
    }
  };

  const startEdit = (qualification) => {
    setEditingId(qualification._id);
    setEditFormData({
      title: qualification.title || '',
      firstname: qualification.firstname || '',
      lastname: qualification.lastname || '',
      email: qualification.email || '',
      completion: qualification.completion ? qualification.completion.split('T')[0] : '',
      description: qualification.description || '',
    });
    setEditStatus(null);
  };

  return (
    <main>
      <h1 className="page-title">Education & Qualifications</h1>

      <p className="page-intro">
        My academic and professional development journey.
      </p>

      <article className="card edu-card">
        <h3>
          Artificial Intelligence – Software Engineering Technology
          (Advanced Diploma)
        </h3>

        <p className="dates">
          Sept 2025 – Present | Centennial College, Toronto, Ontario, Canada
        </p>

        <p>
          Currently studying software development, artificial intelligence, web
          application development, databases, programming, software design, and
          related technologies.
        </p>

        <ul>
          <li>Python Programming</li>
          <li>Java Programming</li>
          <li>C# Programming</li>
          <li>Database Concepts and SQL</li>
          <li>Web Application Development</li>
          <li>Software Requirements Engineering</li>
          <li>Introduction to Artificial Intelligence</li>
          <li>AI System Design</li>
        </ul>
      </article>

      <article className="card edu-card">
        <h3>Master of Science in Environmental Science and Management</h3>

        <p className="dates">
          Jahangirnagar University, Bangladesh
        </p>

        <p>
          Completed graduate-level studies in environmental science and
          management, developing research, analytical, and problem-solving
          skills.
        </p>
      </article>

      <article className="card edu-card">
        <h3>Bachelor of Science (Honours) in Mathematics</h3>

        <p className="dates">
          National University, Bangladesh
        </p>

        <p>
          Completed undergraduate studies in Mathematics, developing a strong
          foundation in logical thinking, quantitative analysis, and
          problem-solving.
        </p>
      </article>

      {/* ===== Qualifications from Database ===== */}
      <section className="card" style={{ marginTop: 40 }}>
        <h2 className="page-title">More Qualifications</h2>
        {loading && <p>Loading qualifications...</p>}
        {error && <p style={{ color: '#c0392b' }}>{error}</p>}
        {!loading && !error && apiQualifications.length === 0 && <p>No qualifications found.</p>}
        {!loading && !error && apiQualifications.length > 0 && (
          <div className="grid">
            {apiQualifications.map((qualification) => (
              <article key={qualification._id} className="card edu-card" style={{ marginBottom: 20 }}>
                {editingId === qualification._id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, qualification._id)} noValidate className="edit-form">
                    <div className="form-group">
                      <label htmlFor="edit-qual-title">Title *</label>
                      <input id="edit-qual-title" name="title" value={editFormData.title} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-qual-firstname">First Name *</label>
                      <input id="edit-qual-firstname" name="firstname" value={editFormData.firstname} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-qual-lastname">Last Name *</label>
                      <input id="edit-qual-lastname" name="lastname" value={editFormData.lastname} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-qual-email">Email *</label>
                      <input id="edit-qual-email" name="email" type="email" value={editFormData.email} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-qual-completion">Completion Date</label>
                      <input id="edit-qual-completion" name="completion" type="date" value={editFormData.completion} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-qual-description">Description</label>
                      <textarea id="edit-qual-description" name="description" value={editFormData.description} onChange={handleEditChange} />
                    </div>
                    {editStatus && (
                      <p className={`status-message ${editStatus.type}`}>{editStatus.message}</p>
                    )}
                    <div className="form-actions">
                      <button type="submit" className="btn">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setEditFormData(INITIAL_QUALIFICATION); setEditStatus(null); }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{qualification.title}</h3>
                    <p><strong>By:</strong> {qualification.firstname} {qualification.lastname}</p>
                    <p><strong>Email:</strong> {qualification.email}</p>
                    {qualification.completion && <p><strong>Completion:</strong> {new Date(qualification.completion).toLocaleDateString()}</p>}
                    {qualification.description && <p><strong>Description:</strong> {qualification.description}</p>}
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      {isAdmin && (
                        <>
                          <button onClick={() => startEdit(qualification)} className="btn">Edit</button>
                          <button onClick={() => handleDelete(qualification._id)} className="btn btn-secondary">Delete</button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Education;