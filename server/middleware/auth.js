import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization'); //from the fe, we are grabbing the token
    if (!token) res.status(403).send('Access Denied');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // middleware will call the next function
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
