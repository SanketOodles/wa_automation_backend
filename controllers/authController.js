const qrcode = require('qrcode');
const whatsapp = require('../sessions/session-two');
const db = require('../models');

// Get models
const Account = db.Account;

// Global variables to track QR codes and clients
let currentQR = null;
let currentClient = null;

// Store multiple clients for different sessions
const activeClients = [];

/**
 * Initialize WhatsApp client and set up event listeners
 * Creates a new client without destroying previous ones
 */
function initializeClient() {
  // We'll create a new client without destroying the previous one
  console.log('Creating new WhatsApp client while keeping previous ones active...');
  
  // Generate a unique ID for this client instance
  const timestamp = Date.now();
  const userId = `user_${timestamp}`;
  const accountId = `account_${timestamp}`;
  const clientId = `${userId}_${accountId}`;
  
  console.log(`Creating new WhatsApp client with ID: ${clientId}...`);
  
  // Create a new client
  currentClient = whatsapp.createClientForAccount(userId, accountId);
  
  // Set up QR code listener
  currentClient.on('qr', (qr) => {
    console.log(`QR code received for client ${clientId}`);
    currentQR = qr;
  });
  
  // Store this client in our active clients array
  activeClients.push({
    client: currentClient,
    clientId: clientId,
    timestamp: timestamp,
    userId: userId,
    accountId: accountId
  });
  
  console.log(`Total active clients: ${activeClients.length}`);
  
  return currentClient;
}

/**
 * Get the current QR code for the most recently created client
 */
function getCurrentQR() {
  return currentQR;
}

/**
 * Get a list of all active clients
 */
function getActiveClientsList() {
  return activeClients.map(item => ({
    clientId: item.clientId,
    timestamp: item.timestamp,
    createdAt: new Date(item.timestamp).toLocaleString()
  }));
}

/**
 * API endpoint to get WhatsApp QR code and store in accounts table
 */
const getDatafromreq = async (req, res) => {
    try {
        // Set CORS headers to prevent issues with frontend
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        console.log('API hit: Creating new WhatsApp client while keeping previous ones active');
        
        // Get IP address from request
        const ip_address = req.headers['x-forwarded-for'] || 
                          req.connection.remoteAddress || 
                          req.socket.remoteAddress ||
                          '127.0.0.1'||
                          (req.connection.socket ? req.connection.socket.remoteAddress : null);
        
        // Get org_id from query parameters or request body
        const org_id = req.query.org_id || (req.body && req.body.org_id) || 1; // Default to 1 if not provided
        
        // Check if client should be initialized based on query param
        const shouldInitialize = req.query.initialize !== 'false';
        
        if (shouldInitialize) {
            // Initialize a new client (without destroying previous ones)
            initializeClient();
            currentQR = null; // Reset current QR code
        }
        
        console.log('Waiting for new QR code...');
        
        // Wait for QR code with timeout
        let qr;
        try {
            qr = await new Promise((resolve, reject) => {
                let attempts = 0;
                const checkQR = () => {
                    attempts++;
                    if (currentQR) {
                        resolve(currentQR);
                    } else {
                        if (attempts < 30) { // Wait up to 30 seconds
                            setTimeout(checkQR, 1000);
                        } else {
                            reject("QR not generated after multiple attempts");
                        }
                    }
                };
                checkQR();
            });
        } catch (error) {
            console.error('Error waiting for QR:', error);
            return res.status(500).json({
                msg: "Failed to generate QR code",
                error: error.toString()
            });
        }
        
        // Final check for QR code
        if (!qr) {
            return res.status(500).json({
                msg: "QR code is not generated",
                error: "QR not generated"
            });
        }

        // Convert QR code to data URL for frontend display
        const qrDataURL = await qrcode.toDataURL(qr);
        console.log("QR code successfully generated");
        
        // Get the most recent client info
        const latestClient = activeClients[activeClients.length - 1];
        
        // Store QR session data in accounts table
        try {
            // Get location from query params or use IP lookup (simplified here)
            const location = req.query.location || 'Gurugram';
            
            // Get current date/time for timestamps
            const currentDateTime = new Date();
            
            // Find the user ID from authentication if available
            const userId = req.user ? req.user.id : null;
            
            // Always create a new account record for each QR code generated
            // This allows an organization to have multiple active accounts
            const account = await Account.create({
                org_id: org_id,
                qr_session: qrDataURL,
                status: 'pending', // Start as pending until authenticated
                ip_address: ip_address,
                location: location,
                created_at: currentDateTime,
                updated_at: currentDateTime,
                created_by_id: userId
            });
            
            console.log(`New account created with ID: ${account.id} for organization ${org_id}`);
            
            // Setup client authenticated listener to update account status
            currentClient.on('authenticated', async (session) => {
                try {
                    // Find the account again to ensure we have the latest data
                    const authAccount = await Account.findByPk(account.id);
                    if (authAccount) {
                        await authAccount.update({
                            status: 'active', // Change status to active when authenticated
                            updated_at: new Date()
                        });
                        console.log(`Account ${account.id} status updated to active after authentication`);
                    }
                } catch (error) {
                    console.error('Error updating account status after authentication:', error);
                }
            });
            
            // Also listen for disconnection events
            currentClient.on('disconnected', async (reason) => {
                try {
                    console.log(`WhatsApp disconnected for account ${account.id}. Reason: ${reason}`);
                    
                    // Find the account again to ensure we have the latest data
                    const disconnectedAccount = await Account.findByPk(account.id);
                    if (disconnectedAccount) {
                        await disconnectedAccount.update({
                            status: 'disconnected',
                            updated_at: new Date(),
                            updated_by_id: userId
                        });
                        console.log(`Account ${account.id} status updated to disconnected`);
                    }
                } catch (error) {
                    console.error('Error updating account status after disconnection:', error);
                }
            });
            
            res.status(200).json({
                msg: "QR code Generated and stored in accounts",
                qrDataURL,
                qrData: qr, // Also provide raw QR data
                account: {
                    id: account.id,
                    org_id: account.org_id,
                    status: account.status
                },
                clientInfo: {
                    clientId: latestClient.clientId,
                    createdAt: new Date(latestClient.timestamp).toLocaleString(),
                    totalActiveClients: activeClients.length
                }
            });
        } catch (dbError) {
            console.error('Database Error:', dbError);
            res.status(500).json({
                msg: "QR code generated but failed to store in database",
                error: dbError.toString(),
                qrDataURL,
                qrData: qr // Still provide QR data even if DB storage fails
            });
        }
    } catch (error) {
        console.error('QR Generation Error:', error);
        res.status(500).json({
            msg: "Error generating QR",
            error: error.toString()
        });
    }
};

/**
 * API endpoint to check client connection status
 */
const getClientStatus = async (req, res) => {
    try {
        // Check if we have any active clients
        if (activeClients.length === 0) {
            return res.status(200).json({
                status: 'no_clients',
                message: 'No WhatsApp clients initialized',
                activeClients: []
            });
        }
        
        // Get status for all active clients
        const clientStatuses = activeClients.map(item => {
            const client = item.client;
            const state = client.info ? 'connected' : 'connecting';
            
            return {
                clientId: item.clientId,
                status: state,
                createdAt: new Date(item.timestamp).toLocaleString(),
                info: client.info || {}
            };
        });
        
        res.status(200).json({
            totalClients: activeClients.length,
            clients: clientStatuses
        });
    } catch (error) {
        console.error('Status Check Error:', error);
        res.status(500).json({
            status: 'error',
            error: error.toString()
        });
    }
};

/**
 * API endpoint to disconnect a specific client
 */
const disconnectClient = async (req, res) => {
    try {
        const { clientId } = req.params || req.query || {};
        
        // If no clientId provided, return list of active clients
        if (!clientId) {
            return res.status(200).json({
                status: 'info',
                message: 'No client ID provided. Please specify a clientId to disconnect.',
                activeClients: getActiveClientsList()
            });
        }
        
        // Find the client with the given ID
        const clientIndex = activeClients.findIndex(item => item.clientId === clientId);
        
        if (clientIndex === -1) {
            return res.status(404).json({
                status: 'not_found',
                message: `No client found with ID: ${clientId}`,
                activeClients: getActiveClientsList()
            });
        }
        
        // Disconnect the client
        const clientToDisconnect = activeClients[clientIndex].client;
        try {
            await clientToDisconnect.destroy();
            console.log(`WhatsApp client ${clientId} disconnected`);
            
            // Remove from active clients array
            activeClients.splice(clientIndex, 1);
            
            // If this was the current client, reset current client and QR
            if (currentClient === clientToDisconnect) {
                currentClient = activeClients.length > 0 ? activeClients[activeClients.length - 1].client : null;
                currentQR = null;
            }
            
            return res.status(200).json({
                status: 'success',
                message: `Client ${clientId} disconnected successfully`,
                remainingClients: activeClients.length,
                activeClients: getActiveClientsList()
            });
        } catch (disconnectError) {
            console.error(`Error disconnecting client ${clientId}:`, disconnectError);
            return res.status(500).json({
                status: 'error',
                message: `Error disconnecting client: ${disconnectError.message}`,
                error: disconnectError.toString()
            });
        }
    } catch (error) {
        console.error('Disconnect Error:', error);
        res.status(500).json({
            status: 'error',
            error: error.toString()
        });
    }
};

/**
 * API endpoint to get a list of all active clients
 */
const listClients = async (req, res) => {
    try {
        res.status(200).json({
            totalClients: activeClients.length,
            clients: getActiveClientsList()
        });
    } catch (error) {
        console.error('List Clients Error:', error);
        res.status(500).json({
            status: 'error',
            error: error.toString()
        });
    }
};

module.exports = { 
    getDatafromreq,
    getClientStatus,
    disconnectClient,
    listClients
};