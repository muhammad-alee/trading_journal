#!/bin/bash

# Deployment script for Trading Journal application

echo "Packaging Trading Journal application for deployment..."

# Create deployment directory
DEPLOY_DIR="/home/ubuntu/trading_journal_deploy"
mkdir -p $DEPLOY_DIR

# Copy backend files
echo "Copying backend files..."
mkdir -p $DEPLOY_DIR/backend
cp -r /home/ubuntu/trading_journal/backend/src $DEPLOY_DIR/backend/
cp /home/ubuntu/trading_journal/backend/server.js $DEPLOY_DIR/backend/
cp /home/ubuntu/trading_journal/backend/package.json $DEPLOY_DIR/backend/
cp /home/ubuntu/trading_journal/backend/.env $DEPLOY_DIR/backend/

# Build frontend
echo "Building frontend..."
cd /home/ubuntu/trading_journal/frontend
npm run build

# Copy frontend build
echo "Copying frontend build..."
mkdir -p $DEPLOY_DIR/frontend
cp -r /home/ubuntu/trading_journal/frontend/build/* $DEPLOY_DIR/frontend/

# Copy scripts and README
echo "Copying scripts and documentation..."
cp /home/ubuntu/trading_journal/start.sh $DEPLOY_DIR/
cp /home/ubuntu/trading_journal/test.sh $DEPLOY_DIR/
cp /home/ubuntu/trading_journal/README.md $DEPLOY_DIR/

# Create production .env file
echo "Creating production environment configuration..."
cat > $DEPLOY_DIR/backend/.env.production << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trading_journal
JWT_SECRET=trading_journal_production_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
EOL

# Create deployment instructions
echo "Creating deployment instructions..."
cat > $DEPLOY_DIR/DEPLOYMENT.md << EOL
# Trading Journal Deployment Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Nginx or another web server (for production deployment)

## Production Deployment Steps

### 1. Database Setup
1. Install MongoDB if not already installed
2. Start MongoDB service:
   \`\`\`
   sudo systemctl start mongod
   sudo systemctl enable mongod
   \`\`\`
3. Create a database for the application:
   \`\`\`
   mongosh
   > use trading_journal
   > exit
   \`\`\`

### 2. Backend Setup
1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Configure environment variables:
   - Rename \`.env.production\` to \`.env\` or update the existing \`.env\` file
   - Update the MongoDB connection string if needed
   - Change the JWT secret to a secure random string
4. Start the backend server:
   \`\`\`
   node server.js
   \`\`\`
   
   For production, it's recommended to use a process manager like PM2:
   \`\`\`
   npm install -g pm2
   pm2 start server.js --name trading-journal-backend
   pm2 save
   pm2 startup
   \`\`\`

### 3. Frontend Setup
1. The frontend is pre-built and ready to be served
2. Configure Nginx to serve the frontend files:

   Create a new Nginx configuration file:
   \`\`\`
   sudo nano /etc/nginx/sites-available/trading-journal
   \`\`\`

   Add the following configuration:
   \`\`\`
   server {
       listen 80;
       server_name your-domain.com;

       root /path/to/frontend;
       index index.html;

       location / {
           try_files \$uri \$uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_cache_bypass \$http_upgrade;
       }
   }
   \`\`\`

3. Enable the site and restart Nginx:
   \`\`\`
   sudo ln -s /etc/nginx/sites-available/trading-journal /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   \`\`\`

### 4. SSL Setup (Recommended)
For a secure HTTPS connection, install Certbot and obtain an SSL certificate:
\`\`\`
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

### 5. Firewall Configuration
Allow HTTP, HTTPS, and SSH traffic:
\`\`\`
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
\`\`\`

## Troubleshooting
- Check backend logs: \`pm2 logs trading-journal-backend\`
- Check Nginx logs: \`sudo tail -f /var/log/nginx/error.log\`
- Ensure MongoDB is running: \`sudo systemctl status mongod\`
EOL

# Create a zip file of the deployment package
echo "Creating deployment zip file..."
cd /home/ubuntu
zip -r trading_journal_deployment.zip trading_journal_deploy

echo "Deployment package created successfully at /home/ubuntu/trading_journal_deployment.zip"
echo "Follow the instructions in DEPLOYMENT.md to deploy the application to your server."
