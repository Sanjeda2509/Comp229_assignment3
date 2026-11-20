import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import libraryImage from "../images/library.webp";
import studyGroupImage from "../images/study_group.webp";
import javaProjectImage from "../images/java_project.webp";

const INITIAL_PROJECT = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: '',
};

function Projects() {
  const [apiProjects, setApiProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(INITIAL_PROJECT);
  const [editStatus, setEditStatus] = useState(null);
  const { isAdmin } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/projects');
      setApiProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchProjects();
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await apiRequest(`/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to delete project');
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
      await apiRequest(`/projects/${id}`, { method: 'PUT', body: payload });
      setEditStatus({ type: 'success', message: 'Project updated successfully.' });
      setEditingId(null);
      setEditFormData(INITIAL_PROJECT);
      fetchProjects();
    } catch (err) {
      setEditStatus({ type: 'error', message: err.message || 'Failed to update project' });
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditFormData({
      title: project.title || '',
      firstname: project.firstname || '',
      lastname: project.lastname || '',
      email: project.email || '',
      completion: project.completion ? project.completion.split('T')[0] : '',
      description: project.description || '',
    });
    setEditStatus(null);
  };

  return (
    <main>
      <h1 className="page-title">My Projects</h1>

      <p className="page-intro">
        Academic projects that show my technical and teamwork skills.
      </p>

      <div className="grid">
        <article className="card">
          <img
            src={libraryImage}
            alt="Library Management System project"
          />

          <h3>Library Management System</h3>

          <p className="tech">
            Oracle SQL Developer | SQL | Database Design | ERD
          </p>

          <p>
            <strong>Description:</strong> The Library Management System was a
            three-member group project developed as part of my Database course.
            The purpose of the project was to design a structured database
            system that could manage library members, books, borrowing records,
            returns, fines, wishlists, and other related information.
          </p>

          <p>
            <strong>My Role:</strong> My main responsibilities included
            designing the Entity Relationship Diagram (ERD), identifying primary
            and foreign keys, defining relationships between tables, and helping
            create the database structure.
          </p>

          <p>
            <strong>Outcome:</strong> The final database included 12
            interconnected tables and demonstrated how relational databases can
            be used to organize and manage real-world information efficiently.
          </p>
        </article>

        <article className="card">
          <img
            src={studyGroupImage}
            alt="Smart Study Group Finder project"
          />

          <h3>Smart Study Group Finder</h3>

          <p className="tech">
            UML | Lucidchart | Requirements Analysis | Use Case Diagram
          </p>

          <p>
            <strong>Description:</strong> The Smart Study Group Finder was a
            group project completed as part of my Software Requirements
            Engineering course. The purpose of the system was to help students
            find and connect with suitable study groups based on their academic
            needs and interests.
          </p>

          <p>
            <strong>My Role:</strong> I created the Use Case Diagram and
            contributed to other system-design activities, including the state
            diagram, sequence diagram, and process flowchart.
          </p>

          <p>
            <strong>Outcome:</strong> The project helped me develop practical
            experience in software requirements, system modelling, user
            interactions, and teamwork.
          </p>
        </article>

        <article className="card">
          <img
            src={javaProjectImage}
            alt="Java Employee Calculator project"
          />

          <h3>Java Employee Calculator</h3>

          <p className="tech">
            Java | Arrays | Loops | Static Methods | Method Overloading
          </p>

          <p>
            <strong>Description:</strong> The Java Employee Calculator is a
            console-based application developed to manage and process employee
            salary information. The program stores salaries in an array and
            calculates information such as average salary and employee bonuses.
          </p>

          <p>
            <strong>My Role:</strong> I developed the program using Java and
            implemented methods for calculating average salary and employee
            bonuses. I also used static variables, arrays, loops, and method
            overloading.
          </p>

          <p>
            <strong>Outcome:</strong> This project strengthened my understanding
            of Java programming, arrays, loops, static methods, method
            overloading, and object-oriented programming concepts.
          </p>
        </article>
      </div>

      {/* ===== Projects from Database ===== */}
      <section className="card" style={{ marginTop: 40 }}>
        <h2 className="page-title">More Projects</h2>
        {loading && <p>Loading projects...</p>}
        {error && <p style={{ color: '#c0392b' }}>{error}</p>}
        {!loading && !error && apiProjects.length === 0 && <p>No projects found.</p>}
        {!loading && !error && apiProjects.length > 0 && (
          <div className="grid">
            {apiProjects.map((project) => (
              <article key={project._id} className="card" style={{ marginBottom: 20 }}>
                {editingId === project._id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, project._id)} noValidate className="edit-form">
                    <div className="form-group">
                      <label htmlFor="edit-project-title">Title *</label>
                      <input id="edit-project-title" name="title" value={editFormData.title} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-project-firstname">First Name *</label>
                      <input id="edit-project-firstname" name="firstname" value={editFormData.firstname} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-project-lastname">Last Name *</label>
                      <input id="edit-project-lastname" name="lastname" value={editFormData.lastname} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-project-email">Email *</label>
                      <input id="edit-project-email" name="email" type="email" value={editFormData.email} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-project-completion">Completion Date</label>
                      <input id="edit-project-completion" name="completion" type="date" value={editFormData.completion} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-project-description">Description</label>
                      <textarea id="edit-project-description" name="description" value={editFormData.description} onChange={handleEditChange} />
                    </div>
                    {editStatus && (
                      <p className={`status-message ${editStatus.type}`}>{editStatus.message}</p>
                    )}
                    <div className="form-actions">
                      <button type="submit" className="btn">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setEditFormData(INITIAL_PROJECT); setEditStatus(null); }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{project.title}</h3>
                    <p><strong>By:</strong> {project.firstname} {project.lastname}</p>
                    <p><strong>Email:</strong> {project.email}</p>
                    {project.completion && <p><strong>Completion:</strong> {new Date(project.completion).toLocaleDateString()}</p>}
                    {project.description && <p><strong>Description:</strong> {project.description}</p>}
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      {isAdmin && (
                        <>
                          <button onClick={() => startEdit(project)} className="btn">Edit</button>
                          <button onClick={() => handleDelete(project._id)} className="btn btn-secondary">Delete</button>
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

export default Projects;