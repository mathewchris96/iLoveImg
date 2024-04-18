// imageManipulation.js

/**
 * This script contains functions for various image manipulation tasks including:
 * - Uploading images
 * - Applying filters
 * - Compressing images
 * 
 * It utilizes the File API for handling uploads and the Canvas API for image manipulations.
 */

// Function to handle image upload and display manipulation options
function uploadImage(event) {
    event.preventDefault(); // Prevent the form from submitting
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Unsupported file type.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // Redirect to manipulation options with the image data
            sessionStorage.setItem('uploadedImage', e.target.result);
            window.location.href = 'manipulation-options.html';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image to upload.');
    }
}

// Function to apply a black and white filter
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
            data[i] = grayscale; // red
            data[i + 1] = grayscale; // green
            data[i + 2] = grayscale; // blue
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

// Function to compress image
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

// Attach event listeners if necessary
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', uploadImage);
    }

    // Removed event listeners for convertToJpgBtn and convertToPngBtn

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
});