# 🏥 Patient Management System

A **modern, full-stack web application** for managing patient registrations and appointments, featuring **Next.js**, **Appwrite**, **Twilio**, and **Tailwind CSS**. This system offers a seamless experience for both patients and administrators with intuitive workflows and modern design.

<details>
  <summary>🚀 Features</summary>

* **User Registration**: Secure user accounts for managing patient data.
* **Patient Management**: Add, update, and manage multiple patients under one account.
* **Appointment Booking**: Schedule appointments with ease.
* **SMS Notifications**: Receive appointment confirmations directly via Twilio.
* **Admin Dashboard**:

  * Authorized access only.
  * View, schedule, and cancel appointments.

</details>

<details>
  <summary>🛠 Tech Stack</summary>

* **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, React Hook Form, Zod
* **Backend**: Appwrite (via node-appwrite SDK)
* **Messaging Service**: Twilio for SMS notifications
* **Authentication**: JSON Web Tokens (JWT)

</details>

---

## 🎯 Getting Started

### Prerequisites

* Node.js (v16 or above)
* Appwrite instance set up with required database collections
* Twilio account for SMS functionality

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/TirtharajBarma/Patient_mangement_system.git
   cd patient-management-system
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:

   * Copy `.env.example` to `.env.local`.
   * Fill in the following values:

     ```env
     PROJECT_ID=
     API_KEY=
     DATABASE_ID=
     PATIENT_COLLECTION_ID=
     DOCTOR_COLLECTION_ID=
     APPOINTMENT_COLLECTION_ID=
     NEXT_PUBLIC_BUCKET_ID=
     NEXT_PUBLIC_ENDPOINT="https://fra.cloud.appwrite.io/v1"
     NEXT_PUBLIC_ADMIN_PASSKEY="Your access Key"
     JWT_SECRET="YourGeneratedSecretKey"
     ```

4. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Step-by-Step Configuration

### **1. Configure Appwrite**

1. **Set up Appwrite**:

   * Install and launch the [Appwrite server](https://appwrite.io/docs/installation).
   * Create a new project in the Appwrite console.

2. **Set up collections**:

   * Navigate to the **Database** section.
   * Create the following collections:

     * **Users**: To store user information.
     * **Patients**: To store patient details.
     * **Appointments**: To manage appointment data.

3. **Add environment variables**:

   * Go to your `.env.local` file and configure:

     ```env
     NEXT_PUBLIC_ENDPOINT=<Your Appwrite Endpoint>
     PROJECT_ID=<Your Appwrite Project ID>
     ```

---

### **2. Configure JWT**

1. **Generate a secure secret key**:

   ```bash
   openssl rand -base64 32
   ```

   Copy the generated key and add it to your `.env` file as `JWT_SECRET`.

2. **How JWT works**:

   * **Admin Authentication**:

     * The admin logs in using a passkey.
     * The server validates the passkey and generates a JWT signed with the secret key.
     * The JWT contains information about the user role (`admin`) and an expiration time.
   * **Authorization Check**:

     * Admin pages verify the JWT stored in cookies to ensure only authorized users can access the content.
     * If the JWT is invalid or missing, the user is redirected to the login page.

3. **Update your environment for deployment**:

   * When deploying, set the `JWT_SECRET` in your hosting environment variables (e.g., Vercel, AWS) for security.

---

### **3. Configure Twilio**

1. **Create a Twilio account**:
   Visit [Twilio](https://www.twilio.com/) and sign up for an account.

2. **Obtain a Twilio phone number**:

   * Go to the **Phone Numbers** section.
   * Click **Get a Number** to acquire a phone number.

3. **Set up Verified Caller ID**:

   * Navigate to **Phone Numbers → Manage → Verified Caller ID**.
   * Add your personal phone number and verify it.

4. **Retrieve Twilio credentials**:

   * Go to the **Dashboard** and copy your **Account SID**, **Auth Token**, and **Sender number**.
   * Add these credentials to your `.env` file.

5. **Integrate Twilio in Appwrite**:

   * In your Appwrite project, add a function for handling Twilio SMS notifications.
   * Use the Twilio SDK in your Appwrite function to send appointment confirmations.

---

> 🚨 **Disclaimer for Twilio**
> 🔴 **For demo purposes, Twilio messaging will only work with your own verified phone number.**
>
> * You must create a Twilio account and obtain a phone number and credentials.
> * Paste these credentials into your Appwrite environment configuration.
> * Set up your verified number:
>
>   1. Go to **Phone Number → Manage → Verified Caller ID**.
>   2. Add your own phone number.

---

## ⚙️ Functionality

### **Patient Management**

* Add, update, and manage multiple patients under a user account.
* Store personal, contact, and medical information for each patient.

### **Appointment Scheduling**

* Book appointments with doctors easily.
* Admins can view, approve, or cancel appointments.

### **JWT Authentication**

* **Admin Login**: Secured using JWT tokens.
* **Access Control**: Only authorized users can access the admin dashboard.

### **SMS Notifications**

* Automated SMS confirmation sent to users after appointment bookings.

### **Admin Dashboard**

* Locked and accessible only to authorized users.
* Includes an overview of all appointments and patient data.
* Provides options for modifying appointment schedules.

---

## 🤝 Contributing

We welcome contributions! Feel free to submit pull requests or open issues to discuss ideas or report bugs.

---

### Developed with ❤️ by [Tirtharaj Barma](https://github.com/TirtharajBarma)
