const https = require('https');

// Render automatically provides RENDER_EXTERNAL_URL for web services.
// If you are testing locally or it's missing, you can replace the fallback with your actual Render URL.
const url = process.env.RENDER_EXTERNAL_URL || "https://your-app-name.onrender.com";

console.log(`Starting keep-alive ping for ${url}`);

// Render free tiers sleep after 15 minutes of inactivity. 
// We will ping the server every 14 minutes (840,000 milliseconds) to keep it awake.
setInterval(() => {
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Pinged ${url} - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Error pinging ${url}:`, err.message);
  });
}, 14 * 60 * 1000);
