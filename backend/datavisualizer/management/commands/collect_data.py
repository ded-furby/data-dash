from django.core.management.base import BaseCommand
from django.utils import timezone
from datavisualizer.services import DataCollectionService
import time


class Command(BaseCommand):
    help = 'Collect data from external APIs and store in database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=str,
            choices=['crypto', 'stock', 'weather', 'currency', 'all'],
            default='all',
            help='Specify which data source to collect from',
        )
        parser.add_argument(
            '--repeat',
            type=int,
            default=1,
            help='Number of times to repeat data collection (with delays)',
        )
        parser.add_argument(
            '--delay',
            type=int,
            default=60,
            help='Delay in seconds between repeated collections',
        )

    def handle(self, *args, **options):
        source = options['source']
        repeat = options['repeat']
        delay = options['delay']
        
        self.stdout.write(
            self.style.SUCCESS(f"Starting data collection at {timezone.now()}")
        )
        
        if repeat > 1:
            self.stdout.write(
                self.style.WARNING(f"Will collect {repeat} times with {delay}s delays")
            )
        
        service = DataCollectionService()
        total_collected = 0
        
        for i in range(repeat):
            if repeat > 1:
                self.stdout.write(f"Collection round {i + 1}/{repeat}")
            
            try:
                if source == 'crypto':
                    count = service.collect_crypto_data()
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully collected {count} crypto data points")
                    )
                elif source == 'stock':
                    count = service.collect_stock_data()
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully collected {count} stock data points")
                    )
                elif source == 'weather':
                    count = service.collect_weather_data()
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully collected {count} weather data points")
                    )
                elif source == 'currency':
                    count = service.collect_currency_data()
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully collected {count} currency data points")
                    )
                else:  # all
                    count = service.collect_all_data()
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully collected {count} total data points")
                    )
                
                total_collected += count
                
                # Sleep between collections if there are more rounds
                if i < repeat - 1:
                    self.stdout.write(f"Waiting {delay} seconds before next collection...")
                    time.sleep(delay)
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error collecting data: {str(e)}")
                )
                continue
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Data collection completed at {timezone.now()}. "
                f"Total: {total_collected} data points collected."
            )
        ) 