const redis = require('redis');

// Redis database configration
const client = redis.createClient({
    port: 6379,
    host: 'localhost',
});
client.on('error', (err) => {
    console.log('Redis client error:', err);
});
client.on('connect', () => {
    console.log('Redis client connected');
});
client.on('end', function() {
    console.log('\nRedis client disconnected');
    console.log('Server is going down now...');
    process.exit();
});
client.connect();

module.exports = client;