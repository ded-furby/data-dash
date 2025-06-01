import requests
import logging
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from .models import DataPoint, DataSource

logger = logging.getLogger(__name__)


class APIService:
    """Base class for API services"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'DataDash/1.0'
        })
    
    def make_request(self, url, params=None, headers=None):
        """Make HTTP request with error handling"""
        try:
            response = self.session.get(url, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {e}")
            return None


class CoinGeckoService(APIService):
    """Service for fetching cryptocurrency data from CoinGecko"""
    
    BASE_URL = "https://api.coingecko.com/api/v3"
    
    def get_crypto_prices(self, symbols=None):
        """Fetch current crypto prices"""
        if not symbols:
            symbols = ['bitcoin', 'ethereum', 'cardano', 'polkadot']
        
        symbols_str = ','.join(symbols)
        url = f"{self.BASE_URL}/simple/price"
        params = {
            'ids': symbols_str,
            'vs_currencies': 'usd',
            'include_market_cap': 'true',
            'include_24hr_vol': 'true',
            'include_24hr_change': 'true'
        }
        
        data = self.make_request(url, params)
        if not data:
            return []
        
        results = []
        for symbol, info in data.items():
            if 'usd' in info:
                results.append({
                    'symbol': symbol.upper(),
                    'price': Decimal(str(info['usd'])),
                    'market_cap': info.get('usd_market_cap'),
                    'volume_24h': info.get('usd_24h_vol'),
                    'change_24h': info.get('usd_24h_change')
                })
        
        return results


class AlphaVantageService(APIService):
    """Service for fetching stock data from Alpha Vantage"""
    
    BASE_URL = "https://www.alphavantage.co/query"
    
    def __init__(self):
        super().__init__()
        self.api_key = settings.ALPHA_VANTAGE_API_KEY
    
    def get_stock_prices(self, symbols=None):
        """Fetch current stock prices"""
        if not symbols:
            symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']
        
        if not self.api_key:
            logger.warning("Alpha Vantage API key not configured")
            return []
        
        results = []
        for symbol in symbols:
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': self.api_key
            }
            
            data = self.make_request(self.BASE_URL, params)
            if data and 'Global Quote' in data:
                quote = data['Global Quote']
                price = quote.get('05. price')
                change = quote.get('09. change')
                
                if price:
                    results.append({
                        'symbol': symbol,
                        'price': Decimal(str(price)),
                        'change': Decimal(str(change)) if change else None,
                        'change_percent': quote.get('10. change percent', '').replace('%', '')
                    })
        
        return results


class OpenWeatherService(APIService):
    """Service for fetching weather data from OpenWeatherMap"""
    
    BASE_URL = "https://api.openweathermap.org/data/2.5"
    
    def __init__(self):
        super().__init__()
        self.api_key = settings.OPENWEATHER_API_KEY
    
    def get_weather_data(self, cities=None):
        """Fetch current weather data"""
        if not cities:
            cities = ['London', 'New York', 'Tokyo', 'Sydney']
        
        if not self.api_key:
            logger.warning("OpenWeather API key not configured")
            return []
        
        results = []
        for city in cities:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            data = self.make_request(f"{self.BASE_URL}/weather", params)
            if data and 'main' in data:
                results.append({
                    'symbol': city,
                    'temperature': Decimal(str(data['main']['temp'])),
                    'humidity': data['main']['humidity'],
                    'pressure': data['main']['pressure'],
                    'description': data['weather'][0]['description']
                })
        
        return results


class ExchangeRateService(APIService):
    """Service for fetching currency exchange rates"""
    
    BASE_URL = "https://api.exchangerate-api.com/v4/latest"
    
    def get_exchange_rates(self, base_currency='USD'):
        """Fetch current exchange rates"""
        url = f"{self.BASE_URL}/{base_currency}"
        data = self.make_request(url)
        
        if not data or 'rates' not in data:
            return []
        
        results = []
        # Get major currency pairs
        major_currencies = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF']
        
        for currency in major_currencies:
            if currency in data['rates']:
                results.append({
                    'symbol': f"{base_currency}-{currency}",
                    'rate': Decimal(str(data['rates'][currency])),
                    'base': base_currency,
                    'target': currency
                })
        
        return results


class DataCollectionService:
    """Main service for collecting data from all sources"""
    
    def __init__(self):
        self.crypto_service = CoinGeckoService()
        self.stock_service = AlphaVantageService()
        self.weather_service = OpenWeatherService()
        self.exchange_service = ExchangeRateService()
    
    def collect_crypto_data(self):
        """Collect and store cryptocurrency data"""
        data = self.crypto_service.get_crypto_prices()
        for item in data:
            DataPoint.objects.create(
                source_type='crypto',
                symbol=item['symbol'],
                value=item['price'],
                metadata={
                    'market_cap': item.get('market_cap'),
                    'volume_24h': item.get('volume_24h'),
                    'change_24h': item.get('change_24h')
                }
            )
        logger.info(f"Collected {len(data)} crypto data points")
        return len(data)
    
    def collect_stock_data(self):
        """Collect and store stock data"""
        data = self.stock_service.get_stock_prices()
        for item in data:
            DataPoint.objects.create(
                source_type='stock',
                symbol=item['symbol'],
                value=item['price'],
                metadata={
                    'change': str(item.get('change', '')),
                    'change_percent': item.get('change_percent', '')
                }
            )
        logger.info(f"Collected {len(data)} stock data points")
        return len(data)
    
    def collect_weather_data(self):
        """Collect and store weather data"""
        data = self.weather_service.get_weather_data()
        for item in data:
            DataPoint.objects.create(
                source_type='weather',
                symbol=item['symbol'],
                value=item['temperature'],
                metadata={
                    'humidity': item.get('humidity'),
                    'pressure': item.get('pressure'),
                    'description': item.get('description')
                }
            )
        logger.info(f"Collected {len(data)} weather data points")
        return len(data)
    
    def collect_currency_data(self):
        """Collect and store currency exchange data"""
        data = self.exchange_service.get_exchange_rates()
        for item in data:
            DataPoint.objects.create(
                source_type='currency',
                symbol=item['symbol'],
                value=item['rate'],
                metadata={
                    'base': item.get('base'),
                    'target': item.get('target')
                }
            )
        logger.info(f"Collected {len(data)} currency data points")
        return len(data)
    
    def collect_all_data(self):
        """Collect data from all sources"""
        total = 0
        total += self.collect_crypto_data()
        total += self.collect_stock_data()
        total += self.collect_weather_data()
        total += self.collect_currency_data()
        
        logger.info(f"Total data points collected: {total}")
        return total 