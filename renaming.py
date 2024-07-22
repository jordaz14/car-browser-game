import os

def rename_files_sequentially(directory, total_files):
    # List all files in the directory and sort them
    files = sorted(os.listdir(directory))
    # Filter only the files that start with 'image_' and end with '.png'
    image_files = [f for f in files if f.startswith('image_') and f.endswith('.png')]
    
    # Make sure the number of image files matches the expected count
    if len(image_files) != total_files:
        print(f"Warning: The number of files in the directory ({len(image_files)}) does not match the expected ({total_files}).")
        return
    
    # Rename files sequentially
    for index, file in enumerate(image_files, start=1):
        new_name = f'image_{index}.png'
        old_file = os.path.join(directory, file)
        new_file = os.path.join(directory, new_name)
        
        # Rename the file if the new name is different from the current name
        if new_name != file:
            os.rename(old_file, new_file)
    
    print(f"All files have been renamed sequentially from image_1.png to image_{total_files}.png")

# Example usage
directory_path = './assets/signs'
total_files = 515
rename_files_sequentially(directory_path, total_files)
