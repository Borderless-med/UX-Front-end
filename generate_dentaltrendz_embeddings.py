"""
Generate embeddings for DentalTrendz clinics using Gemini-embedding-001
and create SQL UPDATE statements for Supabase
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env file from sg-jb-chatbot-LATEST folder
env_path = r"C:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-jb-chatbot-LATEST\.env"
load_dotenv(dotenv_path=env_path)

# Configure the Gemini API
# Option 1: Set GEMINI_API_KEY environment variable in your terminal:
#   $env:GEMINI_API_KEY = "your-api-key-here"
# Option 2: Load from .env file using python-dotenv
# Option 3: Uncomment and add your API key directly below (not recommended for git repos):
#   MANUAL_API_KEY = "your-api-key-here"

MANUAL_API_KEY = None  # Set this to your API key or use environment variable

api_key = MANUAL_API_KEY or os.environ.get('GEMINI_API_KEY')
if not api_key:
    print("ERROR: No GEMINI_API_KEY found!")
    print("\nPlease either:")
    print("1. Set environment variable: $env:GEMINI_API_KEY = 'your-key'")
    print("2. Load .env file before running this script")
    print("3. Edit this script and set MANUAL_API_KEY = 'your-key'")
    exit(1)

genai.configure(api_key=api_key)

# Clinic data with detailed content for embeddings
clinics = [
    {
        "name": "DentalTrendz @ Dover",
        "address": "28 Dover Crescent #01-87, Singapore 130028",
        "phone": "6779 0233",
        "content": "DentalTrendz @ Dover located at 28 Dover Crescent #01-87, Singapore 130028. Proximity to Dover MRT, Singapore Polytechnic (SP), and Holland Village. Services: Family dentistry, Invisalign, wisdom tooth extraction, dental implants, scaling and polishing, and tooth-colored fillings. Serving the Queenstown and Dover HDB community."
    },
    {
        "name": "DentalTrendz @ Telok Blangah",
        "address": "12 Telok Blangah Crescent #01-115, Singapore 090012",
        "phone": "6270 0732",
        "content": "DentalTrendz @ Telok Blangah located at 12 Telok Blangah Crescent #01-115, Singapore 090012. Located near Telok Blangah Hill Park, HarbourFront, and Mount Faber. Specializing in neighborhood dental care, root canal treatment, dental crowns, bridges, and pediatric (children) dentistry. Key area: Bukit Merah."
    },
    {
        "name": "DentalTrendz @ West Coast",
        "address": "154 West Coast Road #01-84, West Coast Plaza, S127371",
        "phone": "6775 8385",
        "content": "DentalTrendz @ West Coast located at 154 West Coast Road #01-84, West Coast Plaza, Singapore 127371. Mall-based clinic near National University of Singapore (NUS), West Coast Park, and Clementi MRT. Expert services in aesthetic dentistry, teeth whitening, porcelain veneers, metal and ceramic braces, and dental bonding. High convenience for students and mall visitors."
    }
]

def generate_embedding(text: str, model: str = "models/gemini-embedding-001", dimensions: int = 3072):
    """Generate embedding vector using Gemini API"""
    try:
        result = genai.embed_content(
            model=model,
            content=text,
            task_type="retrieval_document",
            output_dimensionality=dimensions
        )
        return result['embedding']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

def generate_sql_update(clinic_name: str, embedding: list) -> str:
    """Generate SQL UPDATE statement for Supabase"""
    # Convert Python list to PostgreSQL array format
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    
    sql = f"""-- Update embedding for {clinic_name}
UPDATE public.sg_clinics
SET embedding = '{embedding_str}'::vector
WHERE name = '{clinic_name}';
"""
    return sql

def main():
    print("=" * 80)
    print("Generating Embeddings for DentalTrendz Clinics")
    print("Model: models/gemini-embedding-001 (Gemini)")
    print("Dimensions: 3072")
    print("=" * 80)
    print()
    
    all_sql_statements = []
    
    for i, clinic in enumerate(clinics, 1):
        print(f"{i}. Processing: {clinic['name']}")
        print(f"   Address: {clinic['address']}")
        print(f"   Phone: {clinic['phone']}")
        
        # Generate embedding
        embedding = generate_embedding(clinic['content'], dimensions=3072)
        
        if embedding:
            print(f"   ✓ Embedding generated successfully ({len(embedding)} dimensions)")
            
            # Generate SQL UPDATE statement
            sql = generate_sql_update(clinic['name'], embedding)
            all_sql_statements.append(sql)
            
            # Save individual embedding to JSON file for reference
            output_file = f"embedding_{clinic['name'].replace(' ', '_').replace('@', 'at')}.json"
            with open(output_file, 'w') as f:
                json.dump({
                    "clinic_name": clinic['name'],
                    "address": clinic['address'],
                    "phone": clinic['phone'],
                    "content": clinic['content'],
                    "embedding": embedding,
                    "dimensions": len(embedding)
                }, f, indent=2)
            print(f"   ✓ Saved to: {output_file}")
        else:
            print(f"   ✗ Failed to generate embedding")
        
        print()
    
    # Save all SQL statements to a file
    if all_sql_statements:
        sql_file = "UPDATE_DENTALTRENDZ_EMBEDDINGS.sql"
        with open(sql_file, 'w') as f:
            f.write("-- SQL statements to update DentalTrendz clinic embeddings in Supabase\n")
            f.write("-- Generated: " + str(os.popen('date /t & time /t').read().strip()) + "\n")
            f.write("-- Model: models/embedding-001 (Gemini)\n")
            f.write("-- Dimensions: 3072\n")
            f.write("\n")
            f.write("BEGIN;\n\n")
            f.write("\n".join(all_sql_statements))
            f.write("\nCOMMIT;\n")
        
        print("=" * 80)
        print(f"✓ All SQL statements saved to: {sql_file}")
        print("=" * 80)
        print()
        print("Next steps:")
        print("1. Review the generated SQL file")
        print("2. Execute the SQL in your Supabase SQL Editor")
        print("3. Verify the embeddings were updated correctly")

if __name__ == "__main__":
    main()
