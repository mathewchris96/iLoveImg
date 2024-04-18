document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded and script initiated."); // Added to verify file load
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const manipulationOptionsForm = document.getElementById("manipulation-options-form");
    const resultSection = document.getElementById("result-section");
    const downloadLink = document.getElementById("download-link");
    const loadingIndicator = document.getElementById("loading-indicator"); // Loading indicator presentation enhancement

    // Validate image upload form
    uploadForm.addEventListener("submit", function(e) {
        console.log("Upload form submitted."); // Added to verify event listener trigger
        e.preventDefault();
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select an image to upload.");
            return;
        }
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Please select a JPG or PNG image.");
            return;
        }
        showLoadingIndicator(); // Show loading indicator when image is being uploaded
        uploadImage(file);
    });

    // Function to upload image and receive manipulation options
    function uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);

        fetch("/upload", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateManipulationOptions(data.imageType);
                displayResult(data.imageUrl);
            } else {
                alert("Failed to upload image. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while uploading the image.");
        })
        .finally(() => {
            hideLoadingIndicator(); // Hide loading indicator after the upload process is complete
        });
    }

    // Function to dynamically update manipulation options based on the uploaded image type
    function updateManipulationOptions(imageType) {
        console.log("Updating manipulation options for image type:", imageType); // Added for debugging
        const formatSelect = document.getElementById("format-select");
        formatSelect.innerHTML = ""; // Clear previous options
        if (imageType.toLowerCase() === "jpg") { // Adjusted to ensure case insensitivity
            formatSelect.innerHTML += `<option value="png">Convert to PNG</option>`;
        } else if (imageType.toLowerCase() === "png") { // Adjusted to ensure case insensitivity
            formatSelect.innerHTML += `<option value="jpg">Convert to JPG</option>`;
        }
        // Example of extending functionality for more formats
        else if (imageType.toLowerCase() === "gif") { // Adjusted to ensure case insensitivity
            formatSelect.innerHTML += `<option value="jpg">Convert to JPG</option>`;
            formatSelect.innerHTML += `<option value="png">Convert to PNG</option>`;
        }
    }

    // Function to handle manipulation options form submission
    manipulationOptionsForm.addEventListener("submit", function(e) {
        console.log("Manipulation options form submitted."); // Added to verify event listener trigger
        e.preventDefault();
        showLoadingIndicator(); // Show loading indicator when image is being manipulated
        const formData = new FormData(manipulationOptionsForm);
        
        fetch("/manipulate", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayResult(data.manipulatedImageUrl);
            } else {
                alert("Failed to manipulate image. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while manipulating the image.");
        })
        .finally(() => {
            hideLoadingIndicator(); // Hide loading indicator after manipulating the image is complete
        });
    });

    // Function to display the result and download link
    function displayResult(imageUrl) {
        resultSection.style.display = "block";
        downloadLink.href = imageUrl;
        downloadLink.innerText = "Download Manipulated Image";
    }

    // Function to show loading indicator
    function showLoadingIndicator() {
        loadingIndicator.style.display = "block";
    }

    // Function to hide loading indicator
    function hideLoadingIndicator() {
        loadingIndicator.style.display = "none";
    }

    // Define the convertImage function with actual logic
    window.convertImage = function(imageData, conversionOptions) {
        console.log('Converting image with options', conversionOptions);
        // Example conversion logic (to be replaced with actual logic or API call)
        if(conversionOptions.format === 'png') {
            console.log('Converting image to PNG format');
        } else if(conversionOptions.format === 'jpg') {
            console.log('Converting image to JPG format');
        } else {
            console.log('Invalid image format selected for conversion');
        }
    };
});