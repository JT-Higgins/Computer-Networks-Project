const { exec } = require('child_process');

const args = process.argv.slice(2); // Skip 'node' and 'start.js'
const SERVER_IP = args[0];
const SERVER_PORT = args[1];

// Error handling
if (!SERVER_IP || !SERVER_PORT) {
  console.error('Error: SERVER_IP and SERVER_PORT must be provided.');
  console.error('Usage: npm start <SERVER_IP> <SERVER_PORT>');
  process.exit(1);
}

console.log(`Starting React app with SERVER_IP=${SERVER_IP} and SERVER_PORT=${SERVER_PORT}`);

const command = `REACT_APP_SERVER_IP=${SERVER_IP} REACT_APP_SERVER_PORT=${SERVER_PORT} react-scripts start`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(stdout);
});