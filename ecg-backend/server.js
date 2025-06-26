// Import necessary modules
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Initialize WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');

// Set up serial port communication with Arduino
const port = new SerialPort({
  path: 'COM5', // Replace with your actual port
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send welcome message as JSON
  ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));

  // Optional: Handle messages from the client
  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    // Echo back as JSON
    ws.send(JSON.stringify({ type: 'echo', message: `Server received: ${message}` }));
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast serial data as JSON to all connected WebSocket clients
parser.on('data', (data) => {
  const trimmedData = data.trim();
  console.log(`Serial Data: ${trimmedData}`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // Send ECG data as JSON
      client.send(JSON.stringify({ type: 'ecg', value: trimmedData }));
    }
  });
});
