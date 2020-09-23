const postDeployCommand = [
  'export RTC_ANNOUNCED_IPV4=`curl ifconfig.co`',
  'npm install',
  'sudo -E pm2 reload ecosystem.config.js --env production',
].join(' && ')

module.exports = {
  apps : [
    {
      name: 'sfu1',
      script: 'server/sfu/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 80
      },
      env_production: {
        NODE_ENV: 'production',
        SSL_KEY_PATH: '/etc/letsencrypt/live/socket.sansoohan.ga/privkey.pem',
        SSL_CERT_PATH: '/etc/letsencrypt/live/socket.sansoohan.ga/fullchain.pem',
        HTTPS_HOST: '0.0.0.0',
        PORT: 443
      },
    },
    {
      name: 'sfu2',
      script: 'server/sfu/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 8000
      },
      env_production: {
        NODE_ENV: 'production',
        SSL_KEY_PATH: '/etc/letsencrypt/live/socket.sansoohan.ga/privkey.pem',
        SSL_CERT_PATH: '/etc/letsencrypt/live/socket.sansoohan.ga/fullchain.pem',
        HTTPS_HOST: '0.0.0.0',
        PORT: 4433
      },
    },
    {
      name: 'socket',
      script: 'server/socket/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      env_production: {
        NODE_ENV: 'production',
        SSL_KEY_PATH: '/etc/letsencrypt/live/socket.sansoohan.ga/privkey.pem',
        SSL_CERT_PATH: '/etc/letsencrypt/live/socket.sansoohan.ga/fullchain.pem',
        HTTPS_HOST: '0.0.0.0',
        PORT: 44333
      },
    }
  ],
  deploy : {
    production : {
      user : 'ubuntu',
      host : 'socket.sansoohan.ga',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no', 'ForwardAgent=yes'],
      ref  : 'origin/master',
      repo : 'git@github.com:sansoohan/mediasoup-broadcast-example.git',
      path : '/home/ubuntu/mediasoup-broadcast-example',
      'post-deploy' : postDeployCommand
    }
  }
};