const Tenant = require('../models/Tenant');

module.exports = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  try {
    const tenant = await Tenant.findOne({ apiKey });
    if (!tenant) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
    
    req.tenant = tenant;
    next();
  } catch (err) {
    console.error('Tenant middleware error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
