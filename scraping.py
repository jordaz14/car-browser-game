import os
import requests
from bs4 import BeautifulSoup

def download_png_images(url, folder_path):
    # Create the directory if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Send a GET request to the URL
    response = requests.get(url)
    # Parse the HTML content of the page with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all image tags
    images = soup.find_all('img')
    
    for i, img in enumerate(images):
        src = img.get('src')
        # Ensure the source is a complete URL
        if src.startswith('//'):
            src = 'https:' + src
        elif src.startswith('/'):
            src = 'https://en.wikipedia.org' + src
        
        # Download only PNG images
        if src.endswith('.png'):
            file_name = os.path.join(folder_path, f'image_{i+1}.png')
            img_response = requests.get(src)
            if img_response.status_code == 200:
                with open(file_name, 'wb') as f:
                    f.write(img_response.content)
                print(f'Downloaded {file_name}')
            else:
                print(f'Failed to download {src}')

# URL of the page to scrape
url = 'https://en.wikipedia.org/wiki/Road_signs_in_the_United_States'
# Path where images will be saved
folder_path = './assets/signs'

download_png_images(url, folder_path)
