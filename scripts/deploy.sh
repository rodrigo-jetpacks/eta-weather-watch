
#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Navigate to the build output directory
cd dist

# Initialize git repository
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# Push to gh-pages branch
git push -f git@github.com:yourusername/eta-weather-watch.git main:gh-pages

cd ..
echo "Deployment complete!"
