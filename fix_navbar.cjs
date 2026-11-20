const fs = require('fs');
const p = 'C:/Users/abusayeid/Downloads/assignment2_Final/assignment2_Clean_project/portfolio-react/src/components/Navbar.jsx';
let s = fs.readFileSync(p, 'utf8');
const old = '<NavLink to="/qualification">Qualification</NavLink>\n          </li>\n\n          <li>\n            <NavLink to="/project">Project Form</NavLink>\n          </li>\n';
const replacement = '{isAdmin && (\n            <>\n              <li>\n                <NavLink to="/qualification">Qualification</NavLink>\n              </li>\n\n              <li>\n                <NavLink to="/project">Project Form</NavLink>\n              </li>\n            </>\n          )}\n';
if (!s.includes(old)) { console.log('OLD NOT FOUND'); process.exit(1); }
fs.writeFileSync(p, s.replace(old, replacement));
console.log('REPLACED OK');
