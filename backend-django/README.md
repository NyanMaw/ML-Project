# Personal Project - Getting Started with Django and Docker

- This backend component was made with [Django](https://www.djangoproject.com/).
- The backend and databse is containerised with [Docker Desktop](https://docs.docker.com/desktop/) for ease of collaborative use.

### Setting up
The following steps only needs to be done once, or upon every update to the project's libraries/requirements.

1. Install Docker-Desktop [here](https://www.docker.com/products/docker-desktop/).
2. Open your terminal and navigate to the "backend" folder (same folder as the README.md file).
3. Type the following command:
    `docker-compose build`
    - This will install the relevant backend libraries/requirements and build your project within a new Docker container. This step might take a while. It took me 15mins, as it uses an Ubuntu image.
4. Type the following command:
    `docker-compose run --rm app sh -c "python manage.py makemigrations"`
    - This command is used to check if there are any pending updates/changes within the models.py file to make a migration for.
    - This step only needs to be done whenever there are updates/changes within the models.py.

### Starting the backend server and database
1. Type the following command:
    `docker-compose up`
    - This command will do the following:
        - *migrate*: Migrations.
        - *wait_for_db*: Wait for the databse to be running and available before running the server.
        - *runserver*: Run the Django backend application on [127.0.0.1:8000](127.0.0.1:8000).
2. Open google-chrome and proceed to [127.0.0.1:8000](127.0.0.1:8000).

### Using your OpenAI API key
1. Find the file, openai_api_key.txt
2. Type in your own API key.
3. DO NOT share this key. Ensure this file is under your .gitignore file.

