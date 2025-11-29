const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const jwt = require('jsonwebtoken');

// Middleware to verify token (Inline for now)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

router.use(verifyToken);

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.post('/:id/approve', projectController.approveProject);
router.post('/:id/complete', projectController.completeProject);

module.exports = router;
