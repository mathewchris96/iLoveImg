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
    // ... existing code ...
}

// Function to compress image
function compressImage(compressionLevel) {
    // ... existing code ...
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

    // Add event listener for the new image upload input element
    const imageUploadInput = document.getElementById('imageUpload');
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', function(event) {
            // Handle the uploaded file
            var uploadedImage = event.target.files[0];
            if (uploadedImage) {
                // Validate file type
                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validTypes.includes(uploadedImage.type)) {
                    alert('Unsupported file type.');
                    return;
                }
                // Prepare the image for compression
                const reader = new FileReader();
                reader.onload = function(e) {
                    sessionStorage.setItem('uploadedImage', e.target.result);
                    // Update the UI if necessary
                };
                reader.readAsDataURL(uploadedImage);
            } else {
                alert('Please select an image to upload.');
            }
        });
    }