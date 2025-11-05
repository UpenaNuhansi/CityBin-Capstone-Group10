# CityBin Smart Toolkit 🚮🌐

**CityBin Smart Toolkit** is an innovative IoT-based smart garbage management system developed as a capstone project at the Sabaragamuwa University of Sri Lanka. The system aims to modernize and optimize waste collection for municipalities, businesses, and households through real-time monitoring, AI-driven route optimization, and community engagement features.

## 📌 Project Overview

The CityBin Smart Toolkit combines hardware and software to improve how waste is managed. It enables authorities to monitor garbage bins in real-time, reduce unnecessary trips, and promote efficient garbage collection.

### 🎯 Objectives

- Monitor bin fill-levels in real-time using ultrasonic sensors.
- Notify waste collectors and users through customizable alerts.
- Optimize garbage collection routes using AI algorithms.
- Provide analytics through an intuitive dashboard.
- Encourage responsible waste disposal through a reward system.

---

## 🧠 Key Features

- 🔋 **IoT Integration:** ESP32 microcontrollers with ultrasonic sensors detect fill levels and send data to the cloud.
- 📡 **Real-Time Monitoring:** Check the status of bins anytime from the admin dashboard.
- 🛠 **Custom Alerts:** Users can set thresholds to get notified when bins are nearly full.
- 📊 **Analytics Dashboard:** Visual insights for admins to monitor and plan effectively.
- 🧾 **User & Role Management:** Secure login and role-based access control.
- 🎁 **Reward System:** Incentivizes responsible waste disposal habits.

---

## 🖥️ Tech Stack

### 🧰 Hardware
- ESP32 Microcontroller
- HC-SR04 Ultrasonic Sensor
- Li-ion Battery Pack

### 💻 Software
- **Frontend:** React.js + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (via Mongoose)
- **IoT Communication:** MQTT / HTTP REST APIs
- **Design & Prototyping:** Figma

---

## 🚀 Installation & Usage

### Prerequisites
- Node.js & npm
- Git
- MongoDB (local or cloud via MongoDB Atlas)
- Arduino IDE (for ESP32 programming)

### Clone the Repository
```bash
git clone https://github.com/UpenaNuhansi/CityBin-Capstone-Group10.git
cd CityBin-Capstone-Group10
```
---

## Testing Overview
## 🧪 Admin Module – Cypress Test Coverage

The **Admin Module** of the CityBin project was fully tested using **Cypress**, a modern end-to-end testing framework built for fast, reliable web testing.  
This ensures that every critical function in the admin dashboard works as expected under real-world scenarios — from user management to bin operations — providing confidence in both functionality and user experience.

---

## ✅ Tested Pages & Functionalities

### **1. Admin Login Page**
- Verifies login form visibility and functionality  
- Tests login with valid credentials  
- Validates incorrect credential handling  
- Confirms redirection to the Admin Dashboard  

### **2. Bin Management Page**
- Validates rendering of **“Bin Management Data”** section  
- Checks summary cards (Total, Active, Full, Maintenance Issues)  
- Ensures map and area search field functionality  
- Verifies table headers and data population  
- Tests **“Add New Bin”** modal (form input and success confirmation)  
- Tests **“Edit Bin”** functionality (toggle Maintenance Status and verify auto unassign of operator)  
- Tests **“Assign Maintenance”** modal (assign operator and automatic status change to “Required”)  
- Verifies **Operator Info** popup (opens on operator ID click, closes properly)  
- Validates table search filter functionality  
- Confirms automatic data refresh behavior  

### **3. User Management Page**
- Verifies table headers  
- Tests user search and filtering  
- Validates **Edit User** modal (update role, status, username)  
- Confirms cancel edit behavior  
- Ensures safe deletion of users (**Admin excluded**)  
- Confirms cancel delete behavior  
- Checks success notification visibility  

---

## 🧰 Testing Framework

- **Framework:** Cypress  
- **Version:** ^13.x  
- **Test Type:** End-to-End (E2E) UI & Functional Testing  
- **Execution Modes:** Headed and Headless  
- **Environment:** Local development (`http://localhost:5173`)  

---

## 🚀 Commands to Run Tests

```bash
# Open Cypress Test Runner (interactive mode)
npx cypress open

# Run all tests in headless mode
npx cypress run
```
---

## 📁 Test File Structure
```
cypress/
 └── e2e/
      └── frontend/
           ├── login.cy.js
           ├── bin-management.cy.js
           └── user-management.cy.js
```
---
## 🟩 Test Results Summary
| Page            | Tests Passed | Notes                                       |
| --------------- | ------------ | ------------------------------------------- |
| Login Page      | ✅ All Passed | Verified authentication and navigation flow |
| Bin Management  | ✅ All Passed | Fully tested with dynamic UI behavior       |
| User Management | ✅ All Passed | Safe delete logic verified (Admin excluded) |
---

## 🧾 Additional Notes

- All tests executed in a clean environment before committing.
- Sensitive credentials were handled using Cypress environment variables.
- This test suite provides 100% coverage for all major Admin-side operations of the CityBin system.

Cypress automated tests significantly improved the reliability and maintainability of the CityBin Admin Panel.
All core functionalities — including Bin Management, User Management, and Authentication — were verified with stable, reproducible test coverage ensuring smooth and error-free performance in production.

