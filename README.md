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

# 機能要件定義
1. ユーザー認証
   - ユーザーはアプリケーションにサインインできる
   - ユーザーはアプリケーションからサインアウトできる
   - Amazon Cognitoを使用してユーザー認証を実装する
2. 映画検索
   - ユーザーは映画のタイトルやキーワードで検索できる
   - The Movie Database APIを使用して映画検索を実装する
   - 検索結果は人気度、公開日、タイトルでソートできる
   - 検索結果にはポスター画像、タイトル、あらすじ(5行まで)、コレクション名が表示される
   - 検索結果の表示までの間は検索中であることがユーザーがわかる
   - コレクション名をクリックするとそのコレクションに含まれる映画を検索して表示できる
   - save/savedはGraphQL APIを使用して、映画データの取得して判定する
3. 映画詳細表示
   - 詳細情報には、タイトル、コレクション名、あらすじ、公開日、キャスト、スタッフなどが含まれる
   - 日本語の情報がある場合は、日本語のタイトルとあらすじも表示する
   - 詳細情報は画面真ん中にモーダルウィンドウで表示する
   - モーダルウィンドウは右上のばつ印をクリックするか、モーダルウィンドウの外側をクリックする事で閉じる
4. 映画のお気に入り登録
   - ユーザーはSaveボタンを押すことで映画をお気に入りに登録できる
   - お気に入りに登録した映画は、個人の映画コレクションに保存される
   - ユーザーはSavedボタンを押すことでお気に入りから削除することもできる
5. 映画コレクション管理
   - ユーザーがお気に入りに登録した映画を表示するページを実装する
   - 映画コレクションページでは、登録した映画の一覧が表示される
   - 映画の詳細情報を表示したり、お気に入りから削除したりできる
6. データ管理
   - AWS AppSyncとAmazon DynamoDBを使用してGraphQL APIを実装する
   - 映画データはDynamoDBに保存される
   - GraphQL APIを使用して、映画データの取得、作成、更新、削除を行う

# 非機能要件定義
1. レスポンシブデザイン
   - アプリケーションはレスポンシブデザインで実装する
   - デスクトップ、タブレット、モバイルデバイスに対応する
   - 画面サイズに応じてレイアウトが適切に調整される
2. パフォーマンス
   - 検索結果の表示は高速で行われる
   - 詳細情報の表示は1秒以内に完了する
   - お気に入り登録や削除のアクションは即時反映される
3. セキュリティ
   - ユーザー認証にはAmazon Cognitoを使用し、セキュアな認証を実現する
   - APIへのアクセスは認証されたユーザーのみに許可される
   - データベースへのアクセスはIAMロールによって制御される
4. 可用性
   - アプリケーションは24時間365日利用可能である
   - 定期的なバックアップとディザスタリカバリー対策を実施する
   - 障害発生時の復旧目標時間は1時間以内とする
5. 拡張性
   - アプリケーションアーキテクチャはスケーラブルで拡張性が高い
   - AWSのマネージドサービスを活用し、負荷に応じた自動スケーリングを実現する
   - 将来的な機能追加や変更に対して柔軟に対応できる設計とする
6. ユーザビリティ
   - 直感的で使いやすいユーザーインターフェースを提供する
   - ナビゲーションは分かりやすく、目的のページへ容易にアクセスできる
   - エラーメッセージはわかりやすく、ユーザーが適切な行動を取れるようにする
7. 互換性
   - 主要なWebブラウザ（Chrome、Firefox、Safari、Edge）との互換性を確保する
   - モバイルデバイスではiOSとAndroidに対応する
   - 古いブラウザやデバイスへの対応は限定的とする
8. 保守性
   - コードは読みやすく、適切にコメントを付ける
   - 関数やコンポーネントは単一責任の原則に従い、モジュール化する
   - 自動化されたテストを実装し、バグの早期発見と品質の維持に努める