import os
import re

TARGET_DIR = "/Users/dobedub/Documents/source/harness_hub"

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return # Skip binary files

    original_content = content
    
    # Precise replacements using regex to avoid breaking words like "violation" or "isolation"
    content = re.sub(r'OlaLab', 'HarnessHub', content)
    content = re.sub(r'\bola\b', 'harness', content)
    content = re.sub(r'ola-backend', 'harness-backend', content)
    content = re.sub(r'ola-client', 'harness-client', content)
    content = re.sub(r'ola-admin', 'harness-admin', content)
    
    # Tool -> Product
    content = re.sub(r'\bTool\b', 'Product', content)
    content = re.sub(r'\btool\b', 'product', content)
    content = re.sub(r'\bTools\b', 'Products', content)
    content = re.sub(r'\btools\b', 'products', content)
    content = re.sub(r'\bTOOL\b', 'PRODUCT', content)
    content = re.sub(r'\bTOOLS\b', 'PRODUCTS', content)

    # Labs -> Market
    content = re.sub(r'\bLabs\b', 'Market', content)
    content = re.sub(r'\blabs\b', 'market', content)
    content = re.sub(r'\bLABS\b', 'MARKET', content)

    # Meetups -> Store
    content = re.sub(r'\bMeetups\b', 'Store', content)
    content = re.sub(r'\bmeetups\b', 'store', content)
    content = re.sub(r'\bMEETUPS\b', 'STORE', content)

    content = re.sub(r'\bMeetup\b', 'Store', content)
    content = re.sub(r'\bmeetup\b', 'store', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def rename_path(path):
    dirname, basename = os.path.split(path)
    new_basename = basename
    
    replacements = [
        ("ola", "harness"),
        ("Ola", "Harness"),
        ("tool", "product"),
        ("Tool", "Product"),
        ("tools", "products"),
        ("Tools", "Products"),
        ("labs", "market"),
        ("Labs", "Market"),
        ("meetup", "store"),
        ("Meetup", "Store"),
        ("meetups", "stores"),
        ("Meetups", "Stores")
    ]
    
    for old, new in replacements:
        if old in new_basename:
            # simple replacement for filenames to be safe, assuming filenames like 'tool.ts', 'useTool.ts'
            new_basename = new_basename.replace(old, new)
            
    if new_basename != basename:
        new_path = os.path.join(dirname, new_basename)
        os.rename(path, new_path)
        print(f"Renamed: {path} -> {new_path}")
        return new_path
    return path

def main():
    # First, rename files and directories from bottom up to avoid path invalidation
    for root, dirs, files in os.walk(TARGET_DIR, topdown=False):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        if ".git" in dirs:
            dirs.remove(".git")
        if ".next" in dirs:
            dirs.remove(".next")
            
        for name in files:
            filepath = os.path.join(root, name)
            rename_path(filepath)
            
        for name in dirs:
            if name in ["node_modules", ".git", ".next"]:
                continue
            dirpath = os.path.join(root, name)
            rename_path(dirpath)
            
    # Then replace content
    for root, dirs, files in os.walk(TARGET_DIR):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        if ".git" in dirs:
            dirs.remove(".git")
        if ".next" in dirs:
            dirs.remove(".next")
            
        for file in files:
            filepath = os.path.join(root, file)
            replace_in_file(filepath)

if __name__ == "__main__":
    main()
