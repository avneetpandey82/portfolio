#!/bin/sh

# Create a JavaScript file with environment variables
echo "window.env = {" > /usr/share/nginx/html/env-config.js
echo "  VITE_API_KEY: '$VITE_API_KEY'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_AUTH_DOMAIN: '$VITE_AUTH_DOMAIN'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_PROJECT_ID: '$VITE_PROJECT_ID'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_STORAGE_BUCKET: '$VITE_STORAGE_BUCKET'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_MESSAGING_SENDER_ID: '$VITE_MESSAGING_SENDER_ID'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_APP_ID: '$VITE_APP_ID'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_MEASUREMENT_ID: '$VITE_MEASUREMENT_ID'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_EMAILJS_SERVICE_ID: '$VITE_EMAILJS_SERVICE_ID'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_EMAILJS_TEMPLATE_ID: '$VITE_EMAILJS_TEMPLATE_ID'," >> /usr/share/nginx/html/env-config.js
echo "  VITE_EMAILJS_PUBLIC_KEY: '$VITE_EMAILJS_PUBLIC_KEY'," >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js

# Start nginx
nginx -g 'daemon off;' 