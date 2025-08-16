# 🧭 Tourist Guide API — Backend

This is the Node.js + Express backend powering the Tourism Management System. It handles secure authentication, booking workflows, user roles, stories, and more.

## 🌍 API Base

👉 `https://backend-gold-two-igdm6i5f70.vercel.app`

---

## 👤 Admin Credentials

- **Email:** admin@travelbuddy.com
- **Password:** admin@travelbuddy

---

## ✅ Backend Features

- 🔐 JWT authentication with token verification
- 👥 Role-based access control for Tourist, Guide, Admin
- 🧾 Booking API with status workflow (pending → review → accepted/rejected)
- 📦 Packages API including random sampling with `$sample`
- 🧑‍💼 Guide application + candidate management
- 📚 CRUD operations for stories including `$pull` & `$push`
- 💳 Stripe-integrated payment processing (in-review logic)
- 🧑‍🎓 Tour Guide profile and stories
- 🔄 Persistent login (no redirect after page reload)
- 🔍 Search + Filter users by name/email/role
- 🎉 Booking confetti after 3 confirmed purchases

---

## 🧪 Tech Stack

- Node.js + Express
- MongoDB + native driver
- JWT Auth
- Stripe API
- Dotenv for secrets
