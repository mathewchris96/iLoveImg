document.addEventListener("DOMContentLoaded", function() {
    // Elements
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const manipulationForm = document.getElementById("manipulationForm");
    const resizeOptions = document.getElementById("resizeOptions");
    const cropOptions = document.getElementById("cropOptions");
    const compressOptions = document.getElementById("compressOptions");
    const submitButton = document.getElementById("submitButton");
    const feedbackElement = document.getElementById("feedback");

    // Event listener for the upload form
    if (uploadForm) {
        uploadForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append("image", fileInput.files[0]);

            // AJAX request to upload the image
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    feedbackElement.textContent = "Image uploaded successfully.";
                    // Redirect or update UI
                } else {
                    feedbackElement.textContent = "Failed to upload image.";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                feedbackElement.textContent = "Error uploading image.";
            });
        });
    }

    // Event listener for the manipulation form
    if (manipulationForm) {
        manipulationForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Collect manipulation options
            const options = {
                resize: resizeOptions.value,
                crop: cropOptions.value,
                compress: compressOptions.value,
            };

            // AJAX request to apply image manipulations
            fetch("/manipulate", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    feedbackElement.textContent = "Image manipulated successfully.";
                    // Update UI with the manipulated image or provide download link
                } else {
                    feedbackElement.textContent = "Failed to manipulate image.";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                feedbackElement.textContent = "Error manipulating image.";
            });
        });
    }

    // Client-side validation for the image upload
    fileInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const fileSize = file.size / 1024 / 1024; // in MB
            if (fileSize > 5) {
                feedbackElement.textContent = "File size should not exceed 5MB.";
                submitButton.disabled = true;
            } else {
                feedbackElement.textContent = "";
                submitButton.disabled = false;
            }
        }
    });

    // Additional client-side validation and UI updates can be added here
});