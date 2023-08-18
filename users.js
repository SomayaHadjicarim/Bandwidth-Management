
import { v4 as uuidv4 } from 'uuid';
import MikroNode  from 'mikronode';
import RestfulMikrotik from 'restful-mikrotik';


// var RestfulMikrotik = require('restful-mikrotik');
// import pkg from 'mikronode-ng';
// const {MikroNode} = pkg;

// import {MikroNode} from 'mikronode';

let users = [];

export const getUsers = (res) => {
    console.log(users);

    res.send(users);
}
export const createUser = (req, res) => {
    const user = req.body;

    const userWithId = { ...user, id: uuidv4()}
    
    res.send('User With the name ${user.firstName} added to the database!');
}
export const getUser = (req, res) => { 
    const { id } = req.params;

    const foundUser = users.find((user) => user.id ==id);

    res.send(foundUser);
}
export const deleteUser = (req, res) => {
    const {id} = req.params;

    users = users.filter((user) => user.id !== id );

    res.send('User with the id ${id} deleted from the database.');
}


// UPDATE USER-------------------------------------------------------------------------->
export const updateUser = async (apiServer, username, updatedData) => {
    try {
      if (!apiServer.connected) {
        console.log('Not connected to Mikrotik');
        return;
      }
  
      // Find the user by username and update their data
      const response = await apiServer.execute('/ppp/secret/print', {
        '?name': username,
      });
  
      if (response.length === 0) {
        console.log(`User ${username} not found`);
        return;
      }
  
      const userId = response[0]['.id'];
  
      // Update user data using the updatedData object
      await apiServer.execute('/ppp/secret/set', {
        '=.id': userId,
        ...updatedData,
      });
  
      console.log(`User ${username} updated successfully`);
    } catch (err) {
      console.error('Error while updating user:', err.message);
    }
  };
  
  // Usage example
  (async () => {
    try {
      const username = 'user-to-update';
      const updatedData = {
        'profile': 'new-profile-name',
        // Add other fields to update here
      };
  
      const apiServer = await connectToMikrotik('your-username', 'your-password');
  
      await updateUser(apiServer, username, updatedData);
  
      await disconnectFromMikrotik(apiServer);
    } catch (err) {
      console.error('Error:', err.message);
    }
  })();
  



// LOGIN PO TO --------------------------------------------------------------------                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ----->
export const connectToMikrotik = async (username, password) => {
  const apiServer = new RestfulMikrotik({
    host: '10.30.0.1',
    user: username,         // Use the provided username
    password: password,     // Use the provided password
    listen_port: 5000, 
    listen_host: '127.0.0.1'
  });

  try {
    await apiServer.connect();
    return apiServer; // Return the connected apiServer object
  } catch (err) {
    throw new Error('Unable to establish connection to Mikrotik');
  }
};


// LOG OUT------------------------------------------------------------------------------>
const disconnectFromMikrotik = async (apiServer) => {
  try {
    if (apiServer && apiServer.connected) {
      await apiServer.disconnect();
      console.log('Disconnected from Mikrotik');
    } else {
      console.log('Not connected to Mikrotik');
    }
  } catch (err) {
    console.error('Error while disconnecting from Mikrotik:', err.message);
  }
};

// Usage example
(async () => {
  try {
    const username = 'your-username';
    const password = 'your-password';

    const apiServer = await connectToMikrotik(username, password);
    // Use the apiServer object for your operations

    // Perform logout by disconnecting from Mikrotik
    await disconnectFromMikrotik(apiServer);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();


// Export the connectToMikrotik function
// module.exports = connectToMikrotik;

// Define your AdminUser route
export const AdminUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const apiServer = await connectToMikrotik(username, password);
    res.json({ message: 'Connection to Mikrotik successful' });
  } catch (error) {
    res.status(401).json({ error: 'Unable to establish connection to Mikrotik' });
    console.error('Connection Error:', error);
  }
};



  

