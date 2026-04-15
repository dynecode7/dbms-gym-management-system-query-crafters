# 🏋️ Gym Management System (DBMS Project)
**Developed by:** Query Crafters

---

## 📌 Project Overview

This project is a Gym Membership and Workout Tracking System, a database-driven web application designed to efficiently manage gym operations including members, trainers, workout plans, attendance, and payments.

The system provides a centralized platform where:

- Trainers can manage trainees and assign workouts
- Members can track attendance and view assigned exercises


---

## 🎯 Objective

To design and implement a relational database system that:

- Stores and manages structured gym data
- Maintains relationships between members, trainers, and plans
- Provides real-world functionalities through a web interface

---

## 🛠️ Tech Stack

- Backend: Python Flask
- Database: MySQL
- Frontend: HTML, CSS, JavaScript

---

## 🧩 Database Design

### 🔹 Main Entities

- Member
- Trainer
- Membership Plan
- Attendance
- Payment
- Workout Plan

### 🔹 Relationships

- A Member is assigned to one Trainer
- A Member selects one Membership Plan
- A Trainer manages multiple Members
- Workout Plans/Exercises are assigned by Trainer to Members
- Attendance is recorded per Member per day
- Payments are linked to Membership Plans

---

## ⚙️ Features

### 👤 Member Side

#### 🏠 Home Dashboard

- View assigned trainer and membership plan
- View today’s workout assigned by trainer

#### 📅 Attendance System

- Mark attendance (restricted to once per day)
- View attendance history
- View total days present

#### 👤 Profile Management

- View personal details (Name, Age, Phone)
- Edit profile information
- View payment history
- Logout

---

### 🏋️ Trainer Side

#### 🏠 Home Dashboard

- View all assigned trainees
- Assign exercises (multiple selection supported)
- Trainers assign exercises to members
- Updates reflect instantly in member dashboard

#### 👤 Profile

- View name and specialization
- View total earnings (calculated dynamically based on membership plans):

  - 30% of Monthly Plans
  - 50% of Quarterly Plans
  - 60% of Yearly Plans

- Logout

---

## 🔐 Authentication System

### 🔑 Login

- Separate login for Members and Trainers
- Login using Phone Number and Password

### 📝 Signup

- Member Signup:
  - Name, Age, Phone, Gender, Password

- Trainer Signup:
  - Name, Specialization, Phone, Password

---

## 🗄️ SQL Operations Implemented

- SELECT – Fetch member details, workouts, attendance, payments
- INSERT – Add members, trainers, attendance, payments, workout plans
- UPDATE – Edit profile information
- DELETE – Not Implemented
- JOINS – Used for combining member, trainer, and plan data
- AGGREGATION – Used for calculating trainer earnings

---

## 🧠 Business Logic Implemented

- Attendance can only be marked once per day
- Trainer earnings calculated based on membership plans
- Dynamic workout assignment (trainer → member sync)

---

## 🖥️ User Interface

A simple and functional web interface was developed to:

- Interact with the database
- Demonstrate real-time data updates
- Provide role-based access (Member / Trainer)

---

## 🧪 Testing

The system was tested to ensure:

- Accurate data storage and retrieval
- Proper enforcement of relationships
- Correct working of queries and logic
- Smooth interaction between frontend and backend

---

## 📄 Documentation

- ER Diagram
- Schema Design
- Sample SQL Queries
- Application Screenshots

---

## 🚀 Conclusion

This project successfully demonstrates the implementation of a real-world database system using MySQL integrated with a web application.

It highlights:

- Strong understanding of relational databases
- Practical use of SQL queries and constraints
- Integration of backend logic with frontend UI

---

## 🔮 Future Enhancements

- Online payment integration
- Diet plan and BMI tracking
- Batch/Session scheduling
- Alerts for membership expiry
- Advanced analytics and reports
- Search and filter functionality
- Improved UI/UX design

---

This project goes beyond basic DBMS requirements by implementing a full-stack solution with real-world logic, making it both practical and scalable.