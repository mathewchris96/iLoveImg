/**
 * This script contains functions for various image manipulation tasks including:
 * - Uploading images
 * - Applying filters
 * - Compressing images
 * 
 * It utilizes the File API for handling uploads and the Canvas API for image manipulations.
 */

// Making changes to ensure functions can be exported and reused

// Exporting the uploadImage function
export function uploadImage(event) {
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

// Function to apply a black and white filter remains unchanged

// Exporting the compressImage function for reuse
export function compressImage(uploadedImage, compressionLevel) {
    const img = new Image();
    img.onload = function () {
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
        }, 'image/png');
    };
    img.src = uploadedImage;
}

// Attach event listeners if necessary, ensuring IDs and function names are consistent for reuse in compress-image.html
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', uploadImage);
    }

    // Assuming IDs and function names are already consistent based on the plan, no changes here

    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyBlackAndWhiteFilter);
    }

    const compressBtn = document.getElementById('compressBtn');
    if (compressBtn) {
        compressBtn.addEventListener('click', function() {
            const compressionLevelInput = document.getElementById('compressionLevel');
            const imageInput = document.getElementById('imageInput');
            if (compressionLevelInput && imageInput.files && imageInput.files[0]) {
                const fileReader = new FileReader();
                fileReader.onload = function(e) {
                    compressImage(e.target.result, compressionLevelInput.value);
                };
                fileReader.readAsDataURL(imageInput.files[0]);
            }
        });
    }
});