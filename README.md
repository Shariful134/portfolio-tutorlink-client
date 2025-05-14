
# tutor-client
## 🛠️ Technologies Used

- **react**
- **TypeScript**
- **next js**
- **tailwnd css**
- **Multer**
- **react dom**
- **shadcn**
- **daisyui**
- **magic ui**
- **zod**

 ## Fronted Setup
1.Install All dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
3.Set up environment variables in a .env.local file:
```bash
CLOUDINARY_CLOUD_NAME=dhobkuiqj 
CLOUDINARY_API_KEY=342361686225584
CLOUDINARY_API_SECRET=K4AhK_3bvJSMKNsRfCJrGrvgTIo
NEXT_PUBLIC_BASE_URL=https://tutorlink-server-side.vercel.app/api/v1
```
3.Start the build your code:
``` bash
npm run build
```
4.Start the development Frontend:
``bash
npm run dev
```


## TutorLink 🎓 – Find & Connect with the Best Tutors

TutorLink is an end-to-end educational platform designed to help students discover qualified tutors, book personalized sessions, and manage their learning journey. Tutors can create detailed profiles, list subjects, manage availability, and interact with students. An optional admin panel can be implemented to supervise the platform.

## 🌐 Live Demo
👉 [Frontend (Vercel)](https://job-placement-tutorlink-client.vercel.app/)  


## 📌 Table of Contents

- [Features](#-features)
- [User Roles](#-user-roles)
- [Public Routes](#-public-routes)
- [Private Routes](#-private-routes)
- [Payment Workflow](#-payment-workflow)
- [Tech Stack](#-tech-stack)
- [Database Models](#-database-models)
- [Setup Instructions](#-setup-instructions)
- [Deployment](#-deployment)



## 🚀 Features

- 🔍 Tutor Discovery with filters by subject, rating, rate, availability
- 📅 Session Booking and calendar-based scheduling
- 💳 Secure Payments via Stripe/SSLCommerz
- 🌟 Reviews & Ratings for tutors
- 🧑‍🎓 Role-based dashboards (Student & Tutor)
- 📚 News/Blog feed with educational tips (via open-source API)



## 👥 User Roles

- **Student**: Browse tutors, book sessions, review history, post reviews
- **Tutor**: Manage profile, subjects, availability, and earnings
- **Admin** *(optional)*: Approve tutors, manage users and platform content



## 🧭 Public Routes

### 1. Home Page
- Hero section with search by subject/grade/tutor
- Key highlights: Secure Payments, Verified Profiles
- Testimonials and CTAs: "Sign Up" / "Register as Tutor"

### 2. Browse Tutors
- Filter by subject, rating, rate, availability, location
- Sort by relevance, price, rating
- Tutor cards with essential info

### 3. Tutor Profile
- Tutor bio, subjects, rates, reviews
- Booking calendar and call-to-action buttons

### 4. About Us
- Mission, team introduction, success stories, vision

### 5. FAQ
- Categorized answers to common questions (Tutoring, Payments, etc.)

### 6. News/Blog
- Articles, educational tips, platform updates, and search functionality



## 🔒 Private Routes

### Student Dashboard
- Profile management
- Booking history and payment records
- Tutor reviews

### Tutor Dashboard
- Profile editing
- Subject & availability management
- View and manage earnings & bookings

---

## 💰 Payment Workflow

1. **Tutor Confirms Request**
2. **Student Selects Hours & Duration**
3. **Total Cost Calculated** (based on hourly rate)
4. **Payment Processed** (SSLCommerz / Stripe / PayPal)
5. **Tutor’s Earnings Updated**



## 🧑‍💻 Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State/UI**: ShadCN UI, Lucide Icons

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT, bcrypt



## 🗃️ Database Models

### Users
- Roles: `student`, `tutor`
- Fields: name, email, bio, subjects, availability, ratings, etc.

### Subjects
- Fields: name, grade level, category

### Bookings
- Linked to student & tutor
- Fields: date, duration, price, status (pending/completed)

### Reviews
- Linked to tutor & student
- Fields: rating, comment, timestamp




