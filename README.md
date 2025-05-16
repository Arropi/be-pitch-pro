# Pitch-Pro

Gamification for a web application utilizing Gemini AI to analyze provided audio.

## Overview

Pitch-Pro is a web-based application designed to provide users with a gamified experience. The application leverages Gemini AI to analyze audio uploaded by users, deliver feedback, and help improve their presentation skills. With features such as pre-tests, post-tests, and audio analysis, this app aims to deliver an engaging and interactive learning experience.

## Key Features

- **User Authentication**: User registration and login with JWT-based token validation.
- **Pre-Test dan Post-Test**: Users can take pre-tests and post-tests to assess their progress.
- **Audio Analysis**: Uses Gemini AI to analyze user audio based on various metrics such as intonation, articulation, and speed.
- **Feedback**: Provides in-depth and structured feedback to help users enhance their skills.
- **Gamifikasi**: XP and badge system to motivate users.
- **Scenario Management**:  A list of scenarios categorized by chapters, accessible to users.
- **Badge System**: Users can view and collect badges based on their achievements.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: Gemini AI
- **Authentication**: JSON Web Token (JWT)
- **Validation**: Zod
- **File Upload**: Multer
- **Environment Management**: dotenv

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/username/pitch-pro.git
   cd pitch-pro
   ```
2. Install the dependencies:
    ```bash
   npm install
   ```
3. Generate Prisma Client:
    ```bash
    npx prisma generate
   ```
4. Run the application: 
    ```bash
    npm start
    ```

## ENV

Create a `.env` file in the root directory with the following variables:

```env
GEMINI_API_KEY=<Your Gemini API Key>
PORT=3000
DATABASE_URL=<Your PostgreSQL Database URL>
SECRET_TOKEN=<Your JWT Secret Token>
```

## Project Structure

```bash
pitch-pro/
├── .env                # Environment variables
├── .gitignore          # Files to ignore in Git
├── [index.js]            # Entry point of the application
├── [package.json]        # Project metadata and dependencies
├── prisma/
│   ├── [schema.prisma]   # Prisma schema for database models
├── controllers/        # Route controllers
│   ├── [authController.js]
│   ├── [postTestController.js]
│   ├── [preTestController.js]
│   ├── commonFeature/
│       ├── [badgeController.js]
│       ├── [profileController.js]
│       ├── [storiesController.js]
├── repository/         # Database interaction logic
│   ├── [authRepository.js]
│   ├── [postTestRepository.js]
│   ├── [preTest.Repository.js]
│   ├── commonFeature/
│       ├── [badgeRepository.js]
│       ├── [profileRepository.js]
│       ├── [storiesRepository.js]
├── services/           # Business logic
│   ├── [authService.js]
│   ├── [postTestService.js]
│   ├── [preTestService.js]
│   ├── commonFeature/
│       ├── [badgeService.js]
│       ├── [profileService.js]
│       ├── [storiesService.js]
│   ├── [connection.js]   # Prisma client connection
├── [vercel.json]         # Vercel deployment configuration
```

## 📝 License

MIT License  
Copyright (c) 2025 **Pitch Pro**

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.**
