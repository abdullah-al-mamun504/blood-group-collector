/**
 * Blood Data Management API Server
 * 
 * This Express.js server provides RESTful API endpoints for managing blood donor data.
 * It uses PostgreSQL as the database and includes comprehensive logging for monitoring.
 * 
 * Features:
 * - Create new blood donor records (POST /submit)
 * - Retrieve all blood donor records (GET /data)
 * - Delete specific blood donor records (DELETE /data/:id)
 * - Comprehensive API status logging for Docker monitoring
 */

// Import required dependencies
const express = require('express');        // Web framework for Node.js
const { Pool } = require('pg');           // PostgreSQL client for Node.js
const cors = require('cors');             // Enable Cross-Origin Resource Sharing
require('dotenv').config();               // Load environment variables from .env file

// Initialize Express application
const app = express();

// Server configuration
const PORT = process.env.PORT || 5000;    // Use environment PORT or default to 5000

/**
 * Database Connection Pool Configuration
 * Using connection pooling for better performance and resource management
 */
const pool = new Pool({
    user: process.env.DB_USER,            // Database username from environment
    host: process.env.DB_HOST,            // Database host from environment
    database: process.env.DB_NAME,        // Database name from environment
    password: process.env.DB_PASS,        // Database password from environment
    port: process.env.DB_PORT,            // Database port from environment
});

// Middleware Configuration
app.use(cors());                          // Enable CORS for all routes
app.use(express.json());                  // Parse JSON request bodies

/**
 * API ROUTES
 */

/**
 * POST /submit - Create new blood donor record
 * 
 * Expected request body:
 * {
 *   "name": "John Doe",
 *   "bloodGroup": "A+"
 * }
 * 
 * Responses:
 * - 201: Data saved successfully
 * - 500: Server error
 */
app.post('/submit', async (req, res) => {
    const { name, bloodGroup } = req.body;
    
    try {
        // Insert new record into blood_data table
        await pool.query('INSERT INTO blood_data (name, blood_group) VALUES ($1, $2)', [name, bloodGroup]);
        
        // Send success response
        res.status(201).json({ message: 'Data saved successfully' });
        
        // Trigger logging
        logAPIActivity('POST', '/submit', 'SUCCESS', `Data saved: Name: ${name}, Blood Group: ${bloodGroup}`);
        
    } catch (error) {
        // Send error response
        res.status(500).json({ error: 'Error saving data' });
        
        // Trigger error logging
        logAPIActivity('POST', '/submit', 'ERROR', error.message);
    }
});

/**
 * GET /data - Retrieve all blood donor records
 * 
 * Responses:
 * - 200: Array of blood donor records
 * - 500: Server error
 */
app.get('/data', async (req, res) => {
    try {
        // Query all records from blood_data table
        const result = await pool.query('SELECT * FROM blood_data');
        
        // Send data response
        res.status(200).json(result.rows);
        
        // Trigger logging
        logAPIActivity('GET', '/data', 'SUCCESS', `Retrieved ${result.rows.length} records`);
        
    } catch (error) {
        // Send error response
        res.status(500).json({ error: 'Error fetching data' });
        
        // Trigger error logging
        logAPIActivity('GET', '/data', 'ERROR', error.message);
    }
});

/**
 * DELETE /data/:id - Delete specific blood donor record
 * 
 * URL Parameters:
 * - id: The ID of the record to delete
 * 
 * Responses:
 * - 200: Record deleted successfully
 * - 404: Record not found
 * - 500: Server error
 */
app.delete('/data/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Execute delete query and get result metadata
        const result = await pool.query('DELETE FROM blood_data WHERE id = $1', [id]);
        
        // Check if any record was actually deleted
        if (result.rowCount === 0) {
            // Send not found response
            res.status(404).json({ message: 'Data not found' });
            
            // Trigger not found logging
            logAPIActivity('DELETE', `/data/${id}`, 'NOT FOUND', `No record found with ID: ${id}`);
            return;
        }
        
        // Send success response
        res.status(200).json({ message: 'Data deleted successfully' });
        
        // Trigger success logging
        logAPIActivity('DELETE', `/data/${id}`, 'SUCCESS', `Record deleted with ID: ${id}`);
        
    } catch (error) {
        // Send error response
        res.status(500).json({ error: 'Error deleting data' });
        
        // Trigger error logging
        logAPIActivity('DELETE', `/data/${id}`, 'ERROR', error.message);
    }
});

/**
 * Start the server
 * 
 * Listens on all network interfaces (0.0.0.0) to allow Docker container access
 * Logs server startup confirmation
 */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

/**
 * ============================================================================
 * LOGGING SYSTEM
 * ============================================================================
 * 
 * Centralized logging functionality for API monitoring
 * All console.log statements are managed from this section
 */

// Log levels configuration
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

// Current log level (can be set via environment variable)
const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

/**
 * Base Logger Function with Custom Log Levels
 * 
 * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR)
 * @param {string} category - Log category (API, DB, PERF, etc.)
 * @param {string} message - Log message
 */
function baseLogger(level, category, message) {
    const levelValue = LOG_LEVELS[level];
    if (levelValue >= CURRENT_LOG_LEVEL) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level}] [${category}] ${message}`);
    }
}

/**
 * API Activity Logger
 * 
 * Logs API activities with consistent formatting for Docker monitoring
 * 
 * @param {string} method - HTTP method (GET, POST, DELETE)
 * @param {string} endpoint - API endpoint path
 * @param {string} status - Operation status (SUCCESS, ERROR, NOT FOUND)
 * @param {string} message - Detailed message about the operation
 */
function logAPIActivity(method, endpoint, status, message) {
    const logLevel = status === 'ERROR' ? 'ERROR' : 'INFO';
    baseLogger(logLevel, 'API', `[${method} ${endpoint}] ${status} - ${message}`);
}

/**
 * Database Connection Logger
 * 
 * Logs database connection events and issues
 * 
 * @param {string} event - Connection event (CONNECT, DISCONNECT, ERROR, QUERY)
 * @param {string} message - Detailed message
 */
function logDatabaseActivity(event, message) {
    const logLevel = event === 'ERROR' ? 'ERROR' : 'INFO';
    baseLogger(logLevel, 'DB', `[${event}] ${message}`);
}

/**
 * Performance Monitor Logger
 * 
 * Logs performance metrics and timing information
 * 
 * @param {string} operation - Operation being measured
 * @param {number} duration - Duration in milliseconds
 * @param {object} metadata - Additional performance data
 */
function logPerformance(operation, duration, metadata = {}) {
    const metaString = Object.keys(metadata).length ? ` | ${JSON.stringify(metadata)}` : '';
    baseLogger('INFO', 'PERF', `[${operation}] Duration: ${duration}ms${metaString}`);
}

/**
 * Error Tracker Logger
 * 
 * Logs detailed error information for debugging
 * 
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {object} additionalInfo - Additional debugging information
 */
function logError(error, context, additionalInfo = {}) {
    const errorDetails = {
        message: error.message,
        stack: error.stack,
        context: context,
        ...additionalInfo
    };
    baseLogger('ERROR', 'ERROR', `${context} - ${error.message} | Details: ${JSON.stringify(errorDetails)}`);
}

/**
 * Request/Response Logger
 * 
 * Logs HTTP request and response details
 * 
 * @param {string} type - 'REQUEST' or 'RESPONSE'
 * @param {object} data - Request/Response data
 */
function logRequestResponse(type, data) {
    baseLogger('DEBUG', 'HTTP', `[${type}] ${JSON.stringify(data)}`);
}

/**
 * System Logger
 * 
 * Logs system-level events and information
 * 
 * @param {string} event - System event
 * @param {string} message - Event message
 */
function logSystem(event, message) {
    baseLogger('INFO', 'SYSTEM', `[${event}] ${message}`);
}

/**
 * Debug Logger
 * 
 * Logs debug information (only shown when LOG_LEVEL is DEBUG)
 * 
 * @param {string} context - Debug context
 * @param {string} message - Debug message
 * @param {object} data - Additional debug data
 */
function logDebug(context, message, data = {}) {
    const dataString = Object.keys(data).length ? ` | Data: ${JSON.stringify(data)}` : '';
    baseLogger('DEBUG', 'DEBUG', `[${context}] ${message}${dataString}`);
}

/**
 * Warning Logger
 * 
 * Logs warning messages
 * 
 * @param {string} context - Warning context
 * @param {string} message - Warning message
 */
function logWarning(context, message) {
    baseLogger('WARN', 'WARNING', `[${context}] ${message}`);
}

// Database connection event logging
pool.on('connect', () => {
    logDatabaseActivity('CONNECT', 'New client connected to database');
});

pool.on('error', (err) => {
    logError(err, 'Database Pool Error', { poolSize: pool.totalCount });
});

// Log system startup
logSystem('STARTUP', `Blood Data API Server initializing on port ${PORT}`);
logSystem('CONFIG', `Log level set to: ${Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === CURRENT_LOG_LEVEL)}`);

/**
 * Example Usage of Different Log Levels:
 * 
 * logDebug('API', 'Processing request', { userId: 123, endpoint: '/data' });
 * logSystem('STARTUP', 'Server started successfully');
 * logWarning('DB', 'Connection pool running low');
 * logError(new Error('Database timeout'), 'API Request', { endpoint: '/submit' });
 * logPerformance('Database Query', 145, { query: 'SELECT', rows: 50 });
 * logRequestResponse('REQUEST', { method: 'POST', url: '/submit', body: {...} });
 */
