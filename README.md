

# 📊 data-dash — Real-Time Data Visualization Dashboard

**data-dash** is a powerful local-first, full-stack dashboard that tracks and visualizes real-time cryptocurrency prices, currency exchange rates, weather updates, and stock market data.  
It features intelligent time-series charts, split-screen comparisons, and automatic data refresh — all built with a Django backend and a Next.js + Tailwind frontend.

---

## ✨ Features

- **📈 Smart Charts**: Adaptive visualizations — trend lines for dynamic data, dots for stable data
- **🔄 Comparison Mode**: Split-screen view for cross-source analysis
- **⚡ Live Data Updates**: Automatic polling and refresh for the freshest data
- **🎨 Modern UI**: Fully responsive React + Tailwind interface
- **🔑 Multiple Data APIs**: Supports CoinGecko, OpenWeather, Alpha Vantage, ExchangeRate

---

## 🛠️ Tech Stack

| Layer         | Tools                                       |
|--------------|--------------------------------------------|
| Backend      | Django 5.2.1, Django REST Framework, Python 3.12 |
| Frontend     | Next.js 15.3.3, React 19, TypeScript, Tailwind CSS |
| Visualization| Recharts                                   |
| Database     | SQLite (local, can swap to Postgres)        |
| APIs         | CoinGecko, OpenWeather, Alpha Vantage, ExchangeRate |

---

## 🚀 Local Setup Guide (Frontend + Backend)

### Prerequisites

✅ Install these on your machine:
- Python 3.12+
- Node.js 18+ and npm
- Git

---

### 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/ded-furby/data-dash.git
cd data-dash


⸻

⚙ Step 2: Backend Setup (Django)

cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Collect initial data (crypto, weather, stocks, currencies)
python manage.py collect_data --source=all

# Start backend server
python manage.py runserver 8000

✅ Backend running at → http://localhost:8000/api/

⸻

⚙ Step 3: Frontend Setup (Next.js)

cd ../frontend

# Install Node dependencies
npm install

# Start frontend dev server
npm run dev

✅ Frontend running at → http://localhost:3000

⸻

🌐 Access the Dashboard
	•	Visit → http://localhost:3000
	•	Backend API base → http://localhost:8000/api/

⸻

🔑 API Keys (Optional but Recommended)

For enhanced data (higher API limits), add your API keys.

Data Source	Get API Key
CoinGecko	https://www.coingecko.com/en/api
OpenWeather	https://openweathermap.org/api
Alpha Vantage	https://www.alphavantage.co/support/#api-key
ExchangeRate	https://app.exchangerate-api.com/

Where to put them:
	•	Inside backend/data_dash_backend/settings.py
OR
	•	As environment variables (.env or exported in your shell)

Example settings.py:

COINGECKO_API_KEY = 'your-coingecko-key'
ALPHA_VANTAGE_API_KEY = 'your-alpha-vantage-key'
OPENWEATHER_API_KEY = 'your-openweather-key'
EXCHANGE_RATE_API_KEY = 'your-exchange-rate-key'


⸻

📁 Project Structure

data-dash/
├── backend/                 # Django backend
│   ├── data_dash_backend/   # Django project settings
│   ├── datavisualizer/      # Main Django app
│   ├── manage.py            # Django CLI
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js frontend
│   ├── src/                 # Source code
│   │   ├── app/             # Main Next.js app
│   │   └── components/      # Reusable React components
│   ├── package.json         # Node dependencies
│   └── next.config.js       # Next.js config (with API rewrites)
└── README.md                # This file


⸻

🔧 Backend API Endpoints

Endpoint	Description
/api/datapoints/summary/	Get latest combined data
/api/datapoints/chart_data/	Get time-series data for charts
/api/datapoints/chart_data/?source_type=	Filter by data source (crypto, weather)
/api/datapoints/chart_data/?symbol=&hours=	Specific symbol data over time window


⸻

📈 Chart Behavior
	•	Line Charts → For dynamic data (crypto, stocks)
	•	Dot Charts → For stable metrics (currencies)
	•	Responsive Design → Looks great on desktop, tablet, mobile

⸻

🛠 Common Troubleshooting
	•	Backend fails to run

source venv/bin/activate  # make sure virtualenv is active
pip install -r requirements.txt  # reinstall Python packages


	•	Frontend build errors

rm -rf node_modules package-lock.json
npm install  # fresh install


	•	Database issues

rm backend/db.sqlite3
python manage.py migrate
python manage.py collect_data --source=all


	•	API call errors
	•	Check if backend (localhost:8000) is running
	•	Check CORS settings in settings.py if you connect from a frontend on a different port

⸻

🤝 Contributing
	1.	Fork the repository
	2.	Create a feature branch:

git checkout -b feature/your-feature-name


	3.	Commit and push:

git commit -m "Add your feature"
git push origin feature/your-feature-name


	4.	Open a Pull Request

⸻

📄 License

This project is licensed under the MIT License — see the LICENSE file.

⸻

🎉 Ready to explore data-dash locally? Clone, set up, and enjoy a real-time analytics dashboard right on your machine!

---

✅ **What’s Included**:
✔ Frontend + backend setup  
✔ API key handling  
✔ Full project structure  
✔ Commands for all installs, builds, runs, and troubleshooting  
