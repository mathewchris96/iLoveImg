document.addEventListener("DOMContentLoaded", function() {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const manipulationOptionsForm = document.getElementById("manipulation-options-form");
    const resultSection = document.getElementById("result-section");
    const downloadLink = document.getElementById("download-link");
    const loadingIndicator = document.getElementById("loading-indicator"); // Loading indicator presentation enhancement

    // Validate image upload form
    uploadForm.addEventListener("submit", function(e) {
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
        const formatSelect = document.getElementById("format-select");
        formatSelect.innerHTML = ""; // Clear previous options
        if (imageType === "jpg") {
            formatSelect.innerHTML = `<option value="png">Convert to PNG</option>`;
        } else if (imageType === "png") {
            formatSelect.innerHTML = `<option value="jpg">Convert to JPG</option>`;
        }
    }

    // Function to handle manipulation options form submission
    manipulationOptionsForm.addEventListener("submit", function(e) {
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
});
```