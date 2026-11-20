import jwt from 'jsonwebtoken';

const requireSignin = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Sign in required' });
  try {
    req.auth = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.auth || req.auth.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' });
  next();
};

export { requireSignin, requireAdmin };