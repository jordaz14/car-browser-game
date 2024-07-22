import os

def rename_files(directory):
    files = sorted(os.listdir(directory))
    image_files = [f for f in files if f.startswith('image_') and f.endswith('.png')]
    
    count = 1
    
    for file in image_files:
        # Define new file name
        new_name = f'image_{count}.png'
        # Build full path for old and new file names
        old_file = os.path.join(directory, file)
        new_file = os.path.join(directory, new_name)
        
        # Rename the file
        os.rename(old_file, new_file)
        
        # Increment the counter
        count += 1
        
    print(f"All files have been renamed. Total files renamed: {count - 1}")

# Example usage
directory_path = './assets/signs'
rename_files(directory_path)
