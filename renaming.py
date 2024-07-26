import os

def rename_files(directory, total_files):
    # List all files in the directory
    files = os.listdir(directory)
    # Filter only the image files
    image_files = [f for f in files if f.startswith('image_') and f.endswith('.png')]
    
    # Step 1: Rename all files to a temporary name
    temp_prefix = "temp_image_"
    for file in image_files:
        temp_name = temp_prefix + file.split('_')[1]
        old_path = os.path.join(directory, file)
        temp_path = os.path.join(directory, temp_name)
        os.rename(old_path, temp_path)
    
    # Step 2: Rename from temporary names to final names in sequential order
    temp_files = sorted(os.listdir(directory))
    temp_image_files = [f for f in temp_files if f.startswith(temp_prefix)]
    
    for index, temp_file in enumerate(temp_image_files, start=1):
        final_name = f'image_{index}.png'
        temp_path = os.path.join(directory, temp_file)
        final_path = os.path.join(directory, final_name)
        os.rename(temp_path, final_path)
    
    print(f"All files have been renamed sequentially from image_1.png to image_{total_files}.png")

directory_path = './assets/signs'
total_files = 611
rename_files(directory_path, total_files)
