module.exports = {
  apps: [
    {
      name: 'api',
      script: 'src/index.ts', // Entry point for your TypeScript app
      interpreter: 'node', // Use Node.js as the interpreter
      interpreter_args: '-r ts-node/register', // Register ts-node to handle TypeScript
      instances: 1, // Set to 1 for single instance or 'max' for all CPU cores
      exec_mode: 'fork', // Use 'fork' mode for single instance or 'cluster' for multiple
      autorestart: true, // Automatically restart on crash
      watch: true, // Enable file watching
      ignore_watch: ['node_modules', 'logs'], // Ignore these directories
      max_memory_restart: '1G', // Restart if memory exceeds 1GB
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};