const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
exports.viewProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { profilePicture, bio } = req.body;

    // Build profile object
    const profileFields = {};
    if (profilePicture) profileFields.profilePicture = profilePicture;
    if (bio) profileFields.bio = bio;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
