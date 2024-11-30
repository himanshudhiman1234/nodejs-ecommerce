const multer = require('multer');
const fs = require('fs');
const path = require("path");

// Function to ensure the uploads directory exists
const ensureUploadsDirectoryExists = () => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    console.log(uploadDir) // Adjusted path to go up one level
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Uploads directory created:', uploadDir);
    }
};

// Call the function to ensure the directory exists
ensureUploadsDirectoryExists();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp/uploads'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        // Create a unique file name
        cb(null, Date.now() + '-' + file.originalname); // Save the filename correctly
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
