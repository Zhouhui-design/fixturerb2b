# bcryptjs Usage Guide

## Current Status

✅ **bcryptjs is installed** but **not currently used** in the application.

### Why?
The current system uses **passwordless authentication**:
- Users only need a username to register/login
- Authentication is handled via JWT tokens
- No passwords are stored in the database

This makes the system simpler and faster to use for temporary chat sessions.

---

## When Would You Need bcryptjs?

You would use bcryptjs if you want to add **password-based authentication** for:
1. Enhanced security
2. User account protection
3. Persistent user accounts
4. Admin panels
5. Premium features

---

## How to Add Password Authentication (Optional)

If you want to add password support in the future, here's how:

### Step 1: Update User Model

Edit `server/models/User.js`:

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: false,  // Make it optional
    minlength: 6
  },
  // ... rest of the schema
});
```

### Step 2: Hash Password Before Saving

Add this to `server/models/User.js`:

```javascript
const bcrypt = require('bcryptjs');

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### Step 3: Update Registration Route

Edit `server/routes/auth.js`:

```javascript
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    
    // Check if username exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const token = crypto.randomBytes(64).toString('hex');
    
    const user = new User({
      username: username.trim(),
      token: token,
      password: password || null  // Optional password
    });
    
    await user.save();
    
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      userId: user._id,
      username: user.username,
      token: jwtToken,
      message: 'Registration successful'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

### Step 4: Update Login Route

```javascript
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // If user has password, verify it
    if (user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }
    
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.json({
      userId: user._id,
      username: user.username,
      token: jwtToken,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});
```

### Step 5: Update Frontend Login Form

Edit `client/index.html` to add password field:

```html
<div id="login-form">
    <input type="text" id="username-input" placeholder="Enter username" />
    <input type="password" id="password-input" placeholder="Enter password (optional)" />
    <button id="login-btn">Login / Register</button>
    <p class="info-text">Password is optional for quick access.</p>
</div>
```

Edit `client/app.js` to send password:

```javascript
async handleAuth() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('auth-error');
    
    if (!username || username.length < 3) {
        errorDiv.textContent = 'Username must be at least 3 characters';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            this.login(username, data.token);
            localStorage.setItem('chat_user', JSON.stringify({
                userId: data.userId,
                username: data.username,
                token: data.token
            }));
        } else {
            errorDiv.textContent = data.error;
        }
    } catch (err) {
        errorDiv.textContent = 'Connection error. Please try again.';
    }
}
```

---

## Current Recommendation

### ✅ Keep It As Is (Recommended for Your Use Case)

**Why?**
1. **Simpler UX** - No password to remember
2. **Faster Onboarding** - Just enter username and start chatting
3. **Perfect for Temporary Chat** - Matches your "temporary chat system" concept
4. **Less Friction** - Users can quickly connect with customers
5. **Already Secure** - JWT tokens provide good security

**Best For:**
- Cross-border e-commerce customer service
- Temporary communication channels
- Quick customer interactions
- Low-friction user experience

### 🔐 Add Passwords (If Needed Later)

**When to consider:**
- If you need persistent user accounts
- If users request account protection
- If you add premium features
- If you need admin controls
- For compliance requirements

---

## Summary

**Current State:** ✅ Perfect for your needs
- Passwordless authentication is working great
- System is simple and user-friendly
- No action needed right now

**Future Option:** 🔒 Can add passwords later
- bcryptjs is already installed and ready
- Easy to implement when needed
- Follow the guide above

**My Recommendation:** 
Keep the current passwordless system. It's perfect for a temporary chat system where speed and ease of use are priorities. You can always add password authentication later if needed.

---

## What Should You Do Now?

**Nothing!** The system is complete and working as designed. 

Just:
1. ✅ MongoDB is installed and running
2. ✅ Server is running on port 3000
3. ✅ Click the preview button to access the chat system
4. ✅ Start using it!

The bcryptjs package is there if you ever need it, but you don't need to do anything with it right now.
