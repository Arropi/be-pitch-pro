# Pitch-Pro

Gamifikasi untuk website application dengan memanfaatkan Gemini AI untuk menganalisa audio yang diberikan.

## Overview

Pitch-Pro adalah aplikasi berbasis web yang dirancang untuk memberikan pengalaman gamifikasi kepada pengguna. Aplikasi ini memanfaatkan Gemini AI untuk menganalisis audio yang diunggah oleh pengguna, memberikan umpan balik, dan membantu meningkatkan keterampilan presentasi mereka. Dengan fitur seperti pre-test, post-test, dan analisis audio, aplikasi ini bertujuan untuk memberikan pengalaman belajar yang interaktif dan menyenangkan.

## Key Features

- **User Authentication**: Registrasi dan login pengguna dengan validasi menggunakan token JWT.
- **Pre-Test dan Post-Test**: Pengguna dapat mengikuti pre-test dan post-test untuk mengevaluasi kemajuan mereka.
- **Audio Analysis**: Menggunakan Gemini AI untuk menganalisis audio pengguna berdasarkan berbagai metrik seperti intonasi, artikulasi, dan kecepatan.
- **Feedback**: Memberikan umpan balik yang mendalam dan terstruktur untuk membantu pengguna meningkatkan keterampilan mereka.
- **Gamifikasi**: Sistem XP dan lencana untuk memotivasi pengguna.
- **Scenario Management**: Daftar skenario berdasarkan bab yang dapat diakses oleh pengguna.
- **Badge System**: Pengguna dapat melihat dan mengumpulkan lencana berdasarkan pencapaian mereka.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL dengan Prisma ORM
- **AI Integration**: Gemini AI
- **Authentication**: JSON Web Token (JWT)
- **Validation**: Zod
- **File Upload**: Multer
- **Environment Management**: dotenv

## Installation

1. Clone repository ini:
   ```bash
   git clone https://github.com/username/pitch-pro.git
   cd pitch-pro
   ```
2. Install dependencies:
    ```bash
   npm install
   ```
3. Generate Prisma Client:
    ```bash
    npx prisma generate
   ```
4. Jalankan aplikasi: 
    ```bash
    npm start
    ```

## ENV

Buat file `.env` di root folder dengan variabel berikut:

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
