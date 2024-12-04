from flask import Flask, request, render_template, send_file
from PIL import Image
import io
import os
import hashlib

app = Flask(__name__)

# Ensure the folder for uploaded and manipulated images exists
UPLOAD_FOLDER = 'uploads'
MANIPULATED_FOLDER = 'manipulated'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(MANIPULATED_FOLDER):
    os.makedirs(MANIPULATED_FOLDER)

def secure_filename(filename):
    """Generates a secure version of a filename."""
    # Using hashlib to generate a unique name based on the original filename
    hash_filename = hashlib.sha256(filename.encode()).hexdigest()
    file_ext = os.path.splitext(filename)[1]
    return hash_filename + file_ext

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_image():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        if file:
            # Validate file type and secure the file name
            if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                return 'Invalid file type', 400
            secure_file_name = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, secure_file_name)
            file.save(filepath)
            return render_template('manipulation_options.html', filename=secure_file_name)
    return render_template('upload.html')

@app.route('/manipulate', methods=['POST'])
def manipulate_image():
    action = request.form.get('action')
    filename = request.form.get('filename')
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    output_path = os.path.join(MANIPULATED_FOLDER, filename)

    try:
        with Image.open(filepath) as img:
            if action == 'resize':
                width = int(request.form.get('width', img.width))
                height = int(request.form.get('height', img.height))
                img = img.resize((width, height))
            elif action == 'crop':
                left = int(request.form.get('left', 0))
                top = int(request.form.get('top', 0))
                right = int(request.form.get('right', img.width))
                bottom = int(request.form.get('bottom', img.height))
                img = img.crop((left, top, right, bottom))
            elif action == 'compress':
                quality = int(request.form.get('quality', 85))
                # Compress and save the image using the 'quality' parameter, avoid saving twice
                img.save(output_path, quality=quality)
                return send_file(output_path, as_attachment=True)

            img.save(output_path)
    except Exception as e:
        return f'Error processing image: {str(e)}', 500

    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)