- Source code resides in /src directory
- Commands:
  - npm install
    - install dependencies needed for the project
    - need to be executed for first time / any new dependencies changes in git
  - npm run start:dev
    - start up service for development, with source code changes listener
  - npm run start
    - start up service without source code changes listener
  - npm run build
    - build Typescript project, into /dist directory (need to be ran when deploying to Render)
- Point to notice:
  - create you own ".env" file which stored the environment variables
    - `PORT, MONGO_URL etc`
    - .gitignore was configured to ignore the .env file, as secrets should not be committed to git
  - default port of the application was set to "3000", i.e. access the web app in http://localhost:3000