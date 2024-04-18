from flask import Flask, render_template, request, send_from_directory, redirect, url_for
import os
from werkzeug.utils import secure_filename
from PIL import Image
import io

app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return redirect(request.url)
    file = request.files['image']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return redirect(url_for('manipulation_options', filename=filename))
    return redirect(request.url)

@app.route('/manipulation_options/<filename>')
def manipulation_options(filename):
    return render_template('manipulation_options.html', filename=filename)

@app.route('/process', methods=['POST'])
def process_image():
    action = request.form.get('action')
    filename = request.form.get('filename')
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if action == 'resize':
        width = int(request.form.get('width'))
        height = int(request.form.get('height'))
        with Image.open(filepath) as img:
            resized_img = img.resize((width, height))
            output = io.BytesIO()
            resized_img.save(output, format=img.format)
            output.seek(0)
            return send_from_directory(directory=app.config['UPLOAD_FOLDER'], filename=filename, as_attachment=True)
    
    elif action == 'convert':
        new_format = request.form.get('format')
        with Image.open(filepath) as img:
            converted_img = img.convert("RGB")
            new_filename = f"{os.path.splitext(filename)[0]}.{new_format}"
            new_filepath = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            converted_img.save(new_filepath)
            return send_from_directory(directory=app.config['UPLOAD_FOLDER'], filename=new_filename, as_attachment=True)
    
    elif action == 'compress':
        compression_level = int(request.form.get('compression_level'))
        with Image.open(filepath) as img:
            compressed_img = img
            compressed_img.save(filepath, optimize=True, quality=compression_level)
            return send_from_directory(directory=app.config['UPLOAD_FOLDER'], filename=filename, as_attachment=True)
    
    return redirect(url_for('index'))

@app.route('/result/<filename>')
def result(filename):
    return render_template('result.html', filename=filename)

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)