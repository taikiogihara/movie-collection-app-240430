# Movie Collection App

This is a movie collection application built with React, AWS Amplify, and the Movie Database API. It allows users to search for movies, view movie details, and save movies to their personal collection.

## Features

- User authentication using Amazon Cognito
- Movie search functionality powered by the Movie Database API
- Movie details page with information such as title, overview, release date, cast, and crew
- Ability to save movies to a personal collection
- View and manage saved movies in the movie collection page
- GraphQL API for storing and retrieving movie data using AWS AppSync and Amazon DynamoDB
- Responsive and modern user interface

## Technologies Used

- React
- AWS Amplify
- Amazon Cognito
- AWS AppSync
- Amazon DynamoDB
- GraphQL
- The Movie Database API
- HTML/CSS
- JavaScript

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository
2. Install the necessary dependencies using `npm install`
3. Set up an AWS Amplify project and configure the required services (Authentication, API)
   - Run `amplify init` to initialize a new Amplify project
   - Run `amplify add auth` to add authentication using Amazon Cognito
   - Run `amplify add api` to create a GraphQL API using AWS AppSync
   - Update the `schema.graphql` file with the necessary data models and queries/mutations
   - Run `amplify push` to deploy the changes to the cloud
4. Obtain an API key from the Movie Database API
5. Update the API key in the `.env` file
6. Run the application using `npm start`

## Folder Structure

- `src/components`: Contains reusable components used throughout the application
- `src/pages`: Contains the main pages of the application (Movie Search, Movie Collection)
- `src/graphql`: Contains GraphQL queries and mutations
- `src/api`: Contains API configuration and utility functions
- `amplify`: Contains AWS Amplify configuration files

## Setup and Configuration

1. Install the required dependencies:

   ```
   Copy code
   
   npm install react react-dom react-icons react-modal react-transition-group axios aws-amplify @aws-amplify/ui-react
   ```

2. Install the development dependencies:

   ```
   Copy code
   
   npm install -D @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader webpack webpack-cli webpack-dev-server
   ```

3. Configure AWS Amplify:

   - Run `amplify configure` to set up your AWS credentials
   - Run `amplify init` to initialize a new Amplify project
   - Follow the prompts to set up your project

4. Add authentication:

   - Run `amplify add auth` to add authentication using Amazon Cognito
   - Choose the default configuration or customize as needed

5. Add the GraphQL API:

   - Run `amplify add api` to create a GraphQL API using AWS AppSync
   - Choose "GraphQL" as the service type
   - Select "API key" as the authorization type for simplicity (you can change this later)
   - Choose "Single object with fields" as the annotation
   - Update the `schema.graphql` file with the necessary data models and queries/mutations

6. Deploy the changes:

   - Run `amplify push` to deploy the changes to the cloud
   - Choose "Y" when asked if you want to generate code for your GraphQL API
   - Select the desired code generation language target (e.g., JavaScript)
   - Choose "Yes" to generate/update all possible GraphQL operations

7. Update the API key:

   - Obtain an API key from the Movie Database API
   - Create a `.env` file in the root of the project
   - Add the following line to the `.env` file: `REACT_APP_TMDB_API_KEY=your_api_key_here`

8. Run the application:

   - Run `npm start` to start the development server
   - Open the application in your browser at `http://localhost:3000`

## Contributing

Contributions to the movie collection application are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [React](https://reactjs.org/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [The Movie Database API](https://www.themoviedb.org/documentation/api)

