    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Unsupported file type.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            sessionStorage.setItem('uploadedImage', e.target.result);
            window.location.href = 'manipulation-options.html';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image to upload.');
    }
}

function applyBlackAndWhiteFilter() {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (!uploadedImage) {
        alert('No image uploaded.');
        return;
    }
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            data[i] = grayscale;
            data[i + 1] = grayscale;
            data[i + 2] = grayscale;
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob(function(blob) {
            const newImgUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = newImgUrl;
            downloadLink.download = 'filtered_image.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };
    img.src = uploadedImage;
}

function compressImage(compressionLevel) {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (!uploadedImage) {
        alert('No image uploaded.');
        return;
    }
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleFactor = compressionLevel / 100;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
            const newImgUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = newImgUrl;
            downloadLink.download = 'compressed_image.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };
    img.src = uploadedImage;
}

function convertImageToPDF() {
    const fileInput = document.getElementById('jpegInput');
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgData = e.target.result;
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 10, 10);
            const pdfOutput = pdf.output('blob');
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = URL.createObjectURL(pdfOutput);
            document.getElementById('downloadLinkSection').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a JPEG file to convert.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', uploadImage);
    }
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyBlackAndWhiteFilter);
    }
    const compressBtn = document.getElementById('compressBtn');
    if (compressBtn) {
        compressBtn.addEventListener('click', function() {
            const compressionLevel = document.getElementById('compressionLevel').value;
            compressImage(compressionLevel);
        });
    }
    const convertToPdfBtn = document.getElementById('convertToPdfBtn');
    if (convertToPdfBtn) {
        convertToPdfBtn.addEventListener('click', convertImageToPDF);
    }
});