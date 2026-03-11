const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory user database
const users = new Map();
users.set('admin@nexus.ai', { email: 'admin@nexus.ai', username: 'ADMIN', password: '123456' });

// Simple in-memory message storage
const conversations = new Map();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  console.log('LOGIN REQUEST:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = users.get(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    success: true,
    user: {
      email: user.email,
      username: user.username
    },
    token: Buffer.from(email).toString('base64')
  });
});

app.post('/api/auth/signup', (req, res) => {
  console.log('SIGNUP REQUEST:', req.body);
  const { email, username, password, confirmPassword } = req.body;

  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (users.has(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  users.set(email, { email, username: username.toUpperCase(), password });
  console.log('USER CREATED:', email);

  res.json({
    success: true,
    message: 'Account created successfully',
    user: {
      email,
      username: username.toUpperCase()
    },
    token: Buffer.from(email).toString('base64')
  });
});

// Chat Routes
app.post('/api/chat/send', (req, res) => {
  console.log('CHAT REQUEST:', req.body);
  const { message, userEmail } = req.body;

  if (!message || !userEmail) {
    return res.status(400).json({ error: 'Message and user email required' });
  }

  // Initialize conversation for user if not exists
  if (!conversations.has(userEmail)) {
    conversations.set(userEmail, []);
  }

  const userConversation = conversations.get(userEmail);

  // Add user message
  userConversation.push({
    id: `msg_${Date.now()}`,
    text: message,
    sender: 'user',
    timestamp: new Date()
  });

  // Generate bot response based on keywords
  let botResponse = generateBotResponse(message);

  // Add bot message
  const botMessage = {
    id: `msg_${Date.now()}_bot`,
    text: botResponse,
    sender: 'bot',
    timestamp: new Date()
  };

  userConversation.push(botMessage);
  console.log('BOT RESPONSE SENT:', botResponse);

  res.json({
    success: true,
    message: botMessage
  });
});

app.get('/api/chat/history/:userEmail', (req, res) => {
  console.log('HISTORY REQUEST FOR:', req.params.userEmail);
  const { userEmail } = req.params;

  const history = conversations.get(userEmail) || [];

  res.json({
    success: true,
    messages: history
  });
});

// Chatbot response generator
function generateBotResponse(userMessage) {
  const input = userMessage.toLowerCase();

  // Greeting patterns
  if (input.match(/hello|hi|hey|greetings/i)) {
    return '$ NEXUS NEURAL NETWORK ACTIVATED. WELCOME TO THE SYSTEM. HOW MAY I ASSIST YOU?';
  }

  // Help patterns
  if (input.match(/help|how|what|guide/i)) {
    return '$ SYSTEM CAPABILITIES: NATURAL LANGUAGE PROCESSING | DATA ANALYSIS | INFORMATION RETRIEVAL. QUERY YOUR NEEDS.';
  }

  // Status patterns
  if (input.match(/status|working|system|running/i)) {
    return '$ ALL SYSTEMS OPERATIONAL. NEURAL NETWORK ONLINE. PROCESSING CAPACITY AT 100%.';
  }

  // Weather patterns
  if (input.match(/weather|temperature|climate/i)) {
    return '$ ACCESSING WEATHER DATABASE... CURRENT CONDITIONS: OPTIMAL. CONTINUE WITH YOUR REQUEST.';
  }

  // Time patterns
  if (input.match(/time|what time|current time/i)) {
    const now = new Date();
    return `$ SYSTEM TIME: ${now.toLocaleString()}. SYNCHRONIZATION COMPLETE.`;
  }

  // Joke patterns
  if (input.match(/joke|funny|laugh/i)) {
    return '$ HUMOR MODULE ACTIVATED: WHY DID THE PROGRAMMER QUIT HIS JOB? BECAUSE HE DIDN\'T GET ARRAYS. PROCESSING LAUGHTER...';
  }

  // Math patterns
  if (input.match(/calculate|math|equation|plus|minus/i)) {
    return '$ MATHEMATICAL PROCESSOR ENGAGED. PROVIDE EQUATION FOR COMPUTATION. AWAITING INPUT.';
  }

  // Code patterns
  if (input.match(/code|program|javascript|python|java/i)) {
    return '$ CODE COMPILATION ENGINE READY. ENTER YOUR SOURCE CODE FOR ANALYSIS AND OPTIMIZATION.';
  }

  // Default response
  return '$ NEXUS AI PROCESSING... YOUR QUERY HAS BEEN LOGGED. NEURAL NETWORK ANALYZING PARAMETERS. RESPONSE INITIATED.';
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'NEXUS BACKEND ONLINE', timestamp: new Date() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  ◆ NEXUS AI BACKEND ACTIVATED ◆     ║
║  Server running on port ${PORT}        ║
║  Status: ONLINE                       ║
║  All systems operational              ║
║  CORS Enabled - Ready for frontend    ║
╚══════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
    process.exit(1);
  }
});

// Catch all unhandled errors
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
