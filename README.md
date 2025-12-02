# Project Djin

Service that utilizes market information for predictions.

### Deployment instructions

To run project you must have node installed as well as pnpm, and nginx.
The nginx service runs from a config within the project.
First, use the nginx_certs.sh shell script to create new certificates for https
Then run nginx_toggle.sh to run the nginx proxy to allow https for the service.
Then run the deployment of the services through pnpm dev for development platforms
Further instruction on deployment for production platforms when those have been created.
