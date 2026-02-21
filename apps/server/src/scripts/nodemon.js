import nodemon from 'nodemon';
import { exec } from 'child_process';
import { env } from '../config/env.js';

const PORT = env.PORT || 4000;

const killPort = (port) => {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}`
      : `lsof -i tcp:${port} | grep LISTEN | awk '{print $2}'`;

    exec(command, (err, stdout) => {
      if (err || !stdout) {
        resolve();
        return;
      }

      const lines = stdout.trim().split('\n');
      const pids = new Set();

      lines.forEach(line => {
        if (process.platform === 'win32') {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          // Filter out header lines or empty pids
          if (pid && !isNaN(pid) && pid !== '0') pids.add(pid);
        } else {
          pids.add(line.trim());
        }
      });

      if (pids.size === 0) {
        resolve();
        return;
      }

      const pidArray = Array.from(pids);
      console.log(`[nodemon] Found process(es) ${pidArray.join(', ')} on port ${port}. Cleaning up...`);

      const killPromises = pidArray.map(pid => {
        return new Promise((killResolve) => {
          const killCommand = process.platform === 'win32'
            ? `taskkill /F /PID ${pid}`
            : `kill -9 ${pid}`;
          
          exec(killCommand, (killErr) => {
            if (killErr) {
              // Sometimes process is already gone, which is fine
            }
            killResolve();
          });
        });
      });

      Promise.all(killPromises).then(() => {
        // Small delay to let OS release socket
        setTimeout(resolve, 500);
      });
    });
  });
};

const startNodemon = async () => {
  await killPort(PORT);

  nodemon({
    script: 'src/server.js',
    ext: 'js json',
    watch: ['src/'],
    env: { 'NODE_ENV': 'development' }
  });

  nodemon.on('start', () => {
    console.log('[nodemon] App has started');
  }).on('quit', () => {
    console.log('[nodemon] App has quit');
    process.exit();
  }).on('restart', async (files) => {
    console.log('[nodemon] App restarted due to: ', files);
    // Before restarting, nodemon kills the child. 
    // We can add an extra safety check here if needed, 
    // but the graceful shutdown in server.js should handle most cases.
    await killPort(PORT);
  });
};

startNodemon();
