const express = require('express');
const router = express.Router();
const jwtCheck = require('../middlewear/jwtCheck');
const checkPermissions = require('../middlewear/permissionsCheck');

// Verify admin status
router.get('/verify', jwtCheck, checkPermissions, async (req, res) => {
    try {
        // If we get here, it means the user passed both JWT and permissions check
        res.json({
            isAdmin: true,
            message: 'User has admin permissions'
        });
    } catch (error) {
        console.error('Error in admin verification:', error);
        res.status(500).json({
            isAdmin: false,
            message: 'Error verifying admin status'
        });
    }
});

module.exports = router; 