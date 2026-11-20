import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, isAdmin, signout } = useAuth();

  return (
    <header>
      <nav className="navbar">
        <NavLink className="brand" to="/">
          <svg
            className="logo"
            viewBox="0 0 100 100"
            role="img"
            aria-label="SS hexagon logo"
          >
            <polygon
              points="50,4 91,28 91,72 50,96 9,72 9,28"
              fill="#1f6feb"
            />

            <text
              x="50"
              y="63"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="34"
              fontWeight="bold"
              fill="#ffffff"
            >
              SS
            </text>
          </svg>

          <span>Sanjeda Sharmin</span>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          <li>
            <NavLink to="/about">About Me</NavLink>
          </li>

          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>

          <li>
            <NavLink to="/education">Education</NavLink>
          </li>

          <li>
            <NavLink to="/services">Services</NavLink>
          </li>

          <li>
            <NavLink to="/contact">Contact Me</NavLink>
          </li>

          {isAdmin && (
            <>
              <li>
                <NavLink to="/qualification">Qualification</NavLink>
              </li>

              <li>
                <NavLink to="/project">Project Form</NavLink>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
              <li>
                <NavLink to="/signin">Sign In</NavLink>
              </li>
            </>
          )}

          {isAuthenticated && (
            <>
              <li>
                <span style={{ padding: '8px 14px', color: '#1f6feb', fontWeight: 600 }}>
                  {user?.name || user?.email}
                </span>
              </li>
              <li>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={signout}
                  style={{ padding: '8px 14px' }}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
