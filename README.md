# 📊 TeleTrack - Real-Time Data Visualization Dashboard

TeleTrack is a modern real-time data visualization dashboard that tracks and displays cryptocurrency prices, currency exchange rates, weather data, and stock information. Built with Django (backend) and Next.js (frontend), it features intelligent time-series charts that adapt to data variations.

## ✨ Features

- **📈 Intelligent Charts**: Displays trend lines for varying data and dots for stable values
- **🔄 Comparison Mode**: Split-screen view to compare different data sources
- **⏱️ Real-Time Updates**: Automatic data collection and refresh
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **📱 Cross-Platform**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

**Backend:**
- Django 5.2.1
- Django REST Framework
- SQLite Database
- Python 3.12+

**Frontend:**
- Next.js 15.3.3
- React 19
- TypeScript
- Tailwind CSS
- Recharts for visualizations

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+** installed on your system
- **Node.js 18+** and npm installed
- **Git** for cloning the repository

### 📥 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/teletrack.git
   cd teletrack
   ```

2. **Backend Setup:**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   # venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run database migrations
   python manage.py migrate
   
   # Collect initial data
   python manage.py collect_data --source=all
   
   # Start backend server
   python manage.py runserver 8000
   ```

3. **Frontend Setup (in a new terminal):**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application:**
   - **Frontend Dashboard**: http://localhost:3000
   - **Backend API**: http://localhost:8000/api/

## 📊 Data Sources

TeleTrack collects data from multiple sources:

- **🪙 Cryptocurrency**: Bitcoin, Ethereum prices via CoinGecko
- **💱 Currency Exchange**: USD/EUR, USD/CAD, USD/AUD rates
- **🌤️ Weather**: Temperature and conditions for major cities
- **📈 Stocks**: Market data for major indices

## 🎯 Usage

### Main Dashboard
- View all data sources in a unified dashboard
- Charts automatically adapt: lines for trending data, dots for stable values
- Real-time updates every few minutes

### Comparison Mode
- Click any data item to enter comparison mode
- Compare two different data sources side-by-side
- Perfect for analyzing correlations and trends

### Data Collection
```bash
# Collect data from all sources
python manage.py collect_data --source=all

# Collect from specific source
python manage.py collect_data --source=crypto
python manage.py collect_data --source=currency
python manage.py collect_data --source=weather
python manage.py collect_data --source=stocks

# Repeated collection for time-series data
python manage.py collect_data --source=all --repeat=5 --delay=300
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/datapoints/summary/` | GET | Get latest data from all sources |
| `/api/datapoints/chart_data/` | GET | Get time-series data for charts |
| `/api/datapoints/chart_data/?source_type=crypto` | GET | Filter by source type |
| `/api/datapoints/chart_data/?symbol=BITCOIN&hours=24` | GET | Specific symbol data |

## 📁 Project Structure

```
teletrack/
├── backend/                 # Django backend
│   ├── teletrack_backend/   # Django project settings
│   ├── datavisualizer/     # Main Django app
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── db.sqlite3         # SQLite database
├── frontend/               # Next.js frontend
│   ├── src/               # Source code
│   │   ├── app/          # Next.js app directory
│   │   └── components/   # React components
│   ├── package.json      # Node.js dependencies
│   └── next.config.js    # Next.js configuration
└── README.md             # This file
```

## 🔑 API Keys (Optional)

For better rate limits and more data sources, you can add API keys. **The OpenWeather API key is required for weather data**.

### **🌤️ Adding OpenWeather API Key (Required for Weather Data)**

1. **Get your free API key** from https://openweathermap.org/api
2. **Option A - Direct settings file edit (Easiest):**
   - Open `backend/teletrack_backend/settings.py`
   - Find the line: `OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'YOUR_OPENWEATHER_API_KEY_HERE')`
   - Replace `YOUR_OPENWEATHER_API_KEY_HERE` with your actual API key

3. **Option B - Environment variable:**
   ```bash
   # Set environment variable (temporary)
   export OPENWEATHER_API_KEY="your_actual_api_key_here"
   
   # Or add to your shell profile for permanent use (~/.bashrc, ~/.zshrc)
   echo 'export OPENWEATHER_API_KEY="your_actual_api_key_here"' >> ~/.zshrc
   ```

### **Other API Keys (Optional)**

Add these keys to `backend/teletrack_backend/settings.py` for enhanced features:

```python
# API Keys (add your API keys here or use environment variables)
COINGECKO_API_KEY = 'your-coingecko-key'  # Enhanced crypto data
ALPHA_VANTAGE_API_KEY = 'your-alpha-vantage-key'  # Stock market data
OPENWEATHER_API_KEY = 'your-openweather-key'  # Weather data
EXCHANGE_RATE_API_KEY = 'your-exchange-rate-key'  # Enhanced currency data
```

**API Key Sources:**
- **Alpha Vantage** (Stock data): https://www.alphavantage.co/support/#api-key
- **CoinGecko** (Enhanced crypto): https://www.coingecko.com/en/api/pricing
- **ExchangeRate** (Enhanced currency): https://app.exchangerate-api.com/

## 🚨 Troubleshooting

### Backend Issues

**Django not found:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Reinstall requirements
pip install -r requirements.txt
```

**Port already in use:**
```bash
# Use a different port
python manage.py runserver 8001
```

**Database issues:**
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py collect_data --source=all
```

### Frontend Issues

**Dependencies error:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection issues:**
- Ensure backend is running on port 8000
- Check that CORS is properly configured
- Verify API endpoints are accessible

## 📈 Chart Behavior

TeleTrack features intelligent chart visualization:

- **📊 Line Charts**: For data with variations (crypto prices, stocks)
- **⚫ Dot Charts**: For stable values (currency rates with minimal change)
- **📱 Responsive**: Adapts to screen size
- **🎨 Color-Coded**: Different colors for different data types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify both servers are running on correct ports
4. Check the browser console for frontend errors
5. Check terminal output for backend errors

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 Your TeleTrack dashboard is ready!**

Visit http://localhost:3000 to see your real-time data visualization dashboard in action! 