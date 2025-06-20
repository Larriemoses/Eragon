# Eragon

**Eragon** is a full-stack web application designed to aggregate and display verified discount codes from top brands and prop firms. Built with a modern tech stack, it ensures users have access to the latest and most reliable promo codes.

## 🌐 Live Site

Access the live application here: [DiscountRegion](https://discountregion.com)

## 📸 Screenshots


![image](https://github.com/user-attachments/assets/d592555d-8b2f-4a71-a4b8-e9096a04294c)


## 🛠️ Tech Stack

**Frontend:**

* React
* HTML, CSS, JavaScript([abhiappmobiledeveloper.medium.com][1])

**Backend:**

* Python
* Django
* Django REST Framework

**Database:**

* PostgreSQL

**Deployment:**

* Frontend: Vercel
* Backend: Render

## 📂 Project Structure

```

Eragon/
├── Coupon_Web/             # Frontend React application
├── coupon_backend/         # Backend Django application
├── render.yaml             # Deployment configuration for Render
├── package-lock.json       # Frontend dependencies lock file
└── README.md               # Project documentation
```



## 🚀 Features

* **User-Friendly Interface:** Intuitive design for easy navigation and code retrieval.
* **Real-Time Updates:** Regularly updated discount codes to ensure users have access to the latest deals.
* **Responsive Design:** Optimized for both desktop and mobile devices.
* **Interactive Feedback:** Users can like, dislike, and mark coupons as used.
* **Store Submission:** Users can submit new stores or discount codes for inclusion.([github.com][2])

## 🧑‍💻 Getting Started

### Prerequisites

* Python 3.12
* Node.js and npm
* PostgreSQL

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Larriemoses/Eragon.git
   cd Eragon/coupon_backend
   ```



2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate

   ```



3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```



4. **Set up the database:**

   Ensure PostgreSQL is running and create a database. Update the `DATABASES` setting in `settings.py` accordingly.

5. **Apply migrations:**

   ```bash
   python manage.py migrate
   ```



6. **Run the development server:**

   ```bash
   python manage.py runserver
   ```



### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd ../Coupon_Web
   ```



2. **Install dependencies:**

   ```bash
   npm install
   ```



3. **Start the development server:**

   ```bash
   npm start
   ```



## 🐛 Troubleshooting

* **ModuleNotFoundError: No module named 'dj\_database\_url':**

  Install the missing package:

```bash
  pip install dj-database-url
```



* **ModuleNotFoundError: No module named 'corsheaders':**

  Install the missing package:

```bash
  pip install django-cors-headers
```



* **Cannot use ImageField because Pillow is not installed:**

  Install Pillow:

```bash
  pip install Pillow
```



* **Frontend not updating on coupon interaction:**

  Ensure that the frontend is correctly handling state updates after API responses. Check the console for any errors and verify that the API endpoints are returning the expected data.

## 📬 Contact

For any inquiries or feedback:

* **Email:** [larriemoses@gmail.com](mailto:larriemoses@gmail.com)
* **LinkedIn:** [linkedin.com/in/larriemoses](https://www.linkedin.com/in/larriemoses)
* **Twitter:** [@larriemoses](https://x.com/larriemoses)


