const admin = require('../firebase');
const path = require('path');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).sendFile(path.join(__dirname, '../../public/html/login.html')); 
  } 

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).sendFile(path.join(__dirname, '../../public/html/login.html'));//D
  }
};

module.exports = verifyToken;
