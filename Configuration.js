const configureBandwidthAndPriority = async (apiServer, username, uploadSpeed, downloadSpeed, priority1, priority2) => {
    try {
      if (!apiServer.connected) {
        console.log('Not connected to Mikrotik');
        return;
      }
  
      // Find the user by username
      const response = await apiServer.execute('/ppp/secret/print', {
        '?name': username,
      });
  
      if (response.length === 0) {
        console.log(`User ${username} not found`);
        return;
      }
  
      const userId = response[0]['.id'];
  
      // Configure bandwidth settings for the user
      await apiServer.execute('/queue/simple/set', {
        '=.id': userId,
        'max-limit': `${downloadSpeed}/${uploadSpeed}`, // Format: download/upload
        'priority': `${priority1},${priority2}`, // Format: priority1,priority2
      });
  
      console.log(`Bandwidth and priority settings configured for user ${username}`);
    } catch (err) {
      console.error('Error while configuring bandwidth and priority:', err.message);
    }
  };
  
  // Usage example
  (async () => {
    try {
      const username = 'user-to-configure';
      const uploadSpeed = '1M'; // Example upload speed
      const downloadSpeed = '5M'; // Example download speed
      const priority1 = 1; // Example priority 1
      const priority2 = 2; // Example priority 2
  
      const apiServer = await connectToMikrotik('your-username', 'your-password');
  
      await configureBandwidthAndPriority(apiServer, username, uploadSpeed, downloadSpeed, priority1, priority2);
  
      await disconnectFromMikrotik(apiServer);
    } catch (err) {
      console.error('Error:', err.message);
    }
  })();
  