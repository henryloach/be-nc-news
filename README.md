# Northcoders News API

## Description

This project provides api endpoints for a backend server of a news article service. 
Available endpoints are listed in the `endpoints.json` file.

## Setup Instructions 

Those wishing to create a copy of this project should create the following .env. files depending on requirements.

`.env.development` containing:
    
    PGDATABASE=yourDevelopmentDatabaseName

`.env.test` containing:
    
    PGDATABASE=yourTestDatabaseName

`.env.production` containing:
    
    DATABASE_URL=urlToYourHostedDatabase

Install dependecies using the command:
    
    npm install

Run the server using the commands:
    
    npm run setup-dbs
    npm run seed
    npm start

You must have postgres installed and a server running.

## Links

The GitHub repo for this project can be found here: https://github.com/henryloach/be-nc-news

The database for this project is hosted here: https://supabase.com/dashboard/project/wrxnrrnhpyaxmlqatvhy

The express server for this project is hosted here: https://dashboard.render.com/web/srv-cqcdi2g8fa8c73cnrc4g

Endpoints can be accessed at: https://be-nc-news-uc0d.onrender.com/api 

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)