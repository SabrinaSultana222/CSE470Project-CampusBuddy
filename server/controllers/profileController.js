const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.params.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.params.userId;
    console.log('📝 Updating profile for user:', userId);
    console.log('📦 Update data:', req.body);
    
    // server-side validation for name
    if ('name' in req.body && (!req.body.name || !req.body.name.trim())) return res.status(400).json({ error: 'Name cannot be empty' });
    if ('studentId' in req.body && req.body.studentId && !req.body.studentId.trim()) return res.status(400).json({ error: 'Student ID cannot be empty' });
    if ('email' in req.body && req.body.email && (!req.body.email.trim() || !req.body.email.includes('@'))) return res.status(400).json({ error: 'Valid email is required' });
    
    const allowed = ['name', 'email', 'studentId', 'major', 'year', 'gender', 'bio', 'avatarUrl'];
    const updates = {};
    allowed.forEach((k) => { 
      if (k in req.body) {
        // Allow empty strings for optional fields
        updates[k] = req.body[k];
      }
    });
    
    console.log('✍️ Applying updates:', updates);
    const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    console.log('✅ Profile updated successfully');
    res.json({ success: true, user: updated });
  } catch (err) {
    console.error('❌ Profile update error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    console.log('🔑 Password change request for user:', userId);
    
    // Expecting field names to match front-end: currentPassword / newPassword
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    console.log('🔍 Verifying current password...');
    // Use matchPassword method (not comparePassword)
    const ok = await user.matchPassword(currentPassword);
    if (!ok) {
      console.log('❌ Current password incorrect');
      return res.status(400).json({ error: 'Current password incorrect' });
    }
    
    console.log('✅ Current password verified');
    user.password = newPassword;
    await user.save();
    console.log('✅ Password changed successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Password change error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    console.log('📸 Avatar upload request received');
    console.log('👤 User ID:', req.user?._id);
    console.log('📁 File:', req.file ? req.file.filename : 'No file');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userId = req.user._id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    console.log('💾 Saving avatar URL to database:', avatarUrl);
    const updated = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true }).select('-password');
    
    console.log('✅ Avatar saved successfully');
    res.json({ success: true, avatarUrl, user: updated });
  } catch (err) {
    console.error('❌ Avatar upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
