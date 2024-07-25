# CSV-Pattern-Tool
This project aims to provide a Django-React-based application for identifying and replacing patterns in CSV or Excel files. It leverages LLMs (Language Model Models) for natural language processing.

### Frontend:
The frontend of this application is built using React, a popular JavaScript library for building user interfaces. It provides a responsive and interactive user interface that allows users to easily interact with the application. The frontend code can be found in the `/frontend` directory.

### Backend:
The backend of this application is built using Django, a high-level Python web framework. It handles the business logic, data processing, and communication with the database. The backend code can be found in the `/backend` directory.

## Features:
- Pattern identification: The application uses advanced algorithms to identify patterns in CSV or Excel files, making it easier to analyze and manipulate data.
- Pattern replacement: Once patterns are identified, users can choose to replace them with desired values, streamlining data cleaning and transformation processes.
- Large File Support: Application supports large file uplaods. 
- Django-React integration: The project combines the power of Django on the backend and React on the frontend, providing a seamless user experience.
- LLMs for NLP: Leveraging Language Model Models, the application can understand and process natural language, enhancing its pattern identification capabilities.
- Data Description and Dummy (Synthetic) Data: Leveraging LLMs, users can generate a short description of uploaded data along with a dummy data, that can be used for training or testing.
- Export Data: Export the modified and synthetic data as CSV or Excel files.


### Running Locally:

To run the application locally, follow these steps:

Remember to have your openai API key setup as "OPENAI_API_KEY" in system.

Frontend:
1. Navigate to the frontend directory: `cd frontend`
2. Install the required dependencies: `npm install`
3. Start the frontend development server: `npm run dev`

Backend:
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
    - On Windows: `venv\Scripts\activate`
    - On macOS and Linux: `source venv/bin/activate`
4. Install the required dependencies: `pip install -r requirements.txt`
5. Set up the database: `python manage.py migrate`
6. Start the backend development server: `python manage.py runserver`

Now you can access the application in your web browser at `http://localhost:5173` (default port) and interact with both the frontend and backend components.

### Using Docker Compose:

To run the application using Docker Compose, follow these steps:

1. Make sure you have Docker and Docker Compose installed on your machine.
2. Create a `.env` file in the root directory of the project and add your API key as `OPENAI_API_KEY=your_api_key`.
3. Run the following command to start the application: `docker-compose up`

Now you can access the application in your web browser at `http://localhost:5173` and interact with the application.

## Usage:
1. Access the application in your web browser at `http://localhost:5173`
2. Upload a CSV / Excel file as well as input a natural language instruction to find a pattern and replace it with some value.
3. Review the uploaded data and identified patterns and choose to replace them if desired.
4. Download the modified file with replaced patterns.
5. [Optional] Generate data description and synthetic data using LLM.

## Demo

Coming soon...

## Contributing:
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-branch`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-branch`
5. Submit a pull request.

## License:
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.