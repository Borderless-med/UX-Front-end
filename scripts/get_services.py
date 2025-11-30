import os
import json
from supabase import create_client, Client

# Initialize Supabase client
url = "https://jxilrwmrlymkwrxcxsjr.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aWxyd21ybHlta3dyeGN4c2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODAxODIsImV4cCI6MjA0OTk1NjE4Mn0.gQ7RJRYe4ljGG4n5lGQlD0EV5g3M6TsE-oIGvW0LNTk"

supabase: Client = create_client(url, key)

# Query the services column
response = supabase.table('Clinic_Data').select('services').execute()

# Extract unique services
all_services = set()
for row in response.data:
    if row.get('services'):
        services = row['services']
        if isinstance(services, list):
            for service in services:
                if service:
                    all_services.add(service.strip())
        elif isinstance(services, str):
            all_services.add(services.strip())

# Sort and print
sorted_services = sorted(list(all_services))
print(json.dumps(sorted_services, indent=2))
print(f"\n\nTotal unique services: {len(sorted_services)}")
