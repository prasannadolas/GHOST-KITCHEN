// Simple server starter for development
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Ghost Kitchen Server...');

// Start the Node.js server
const server = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

server.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
});