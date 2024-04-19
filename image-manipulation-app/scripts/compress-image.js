// Import functions from "imageManipulation.js"
import { processImage, compressImage } from './imageManipulation.js';

// Add event listener to handle image upload
document.getElementById('imageUpload').addEventListener('change', async function(event) {
  const uploadedImage = event.target.files[0];
  
  // Process and compress the uploaded image asynchronously
  const processedImage = await processImage(uploadedImage);
  const compressedImage = await compressImage(processedImage, 0.5); // Assuming 0.5 as the compression level
  
  // Display the compressed image on the page
  displayCompressedImage(compressedImage);
});

// Function to display the compressed image on the page
function displayCompressedImage(image) {
  document.getElementById('displayedImage').src = image;
}