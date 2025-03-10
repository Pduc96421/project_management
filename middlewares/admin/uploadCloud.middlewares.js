const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
// end cloudinary

let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports.upload = (req, res, next) => {
    if (req.file) {

        const uploadToCloudinary = async (buffer) => {
            const result = await streamUpload(buffer);
            req.body[req.file.fieldname] = result.url;
            next();
        }

        uploadToCloudinary(req.file.buffer);

    } else {
        next();
    }
}