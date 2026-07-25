// import app from "./app.js";
// import cloudinary from "cloudinary";


// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// app.listen(process.env.PORT,() => {
//     console.log(`server listening at the port ${process.env.PORT}`);
// });

import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Vercel imports this file as a serverless function and calls the
// exported app directly — it must NOT call app.listen() itself.
// For local development / Render (always-on servers), we still need
// app.listen() so the server actually starts.
if (!process.env.VERCEL) {
    app.listen(process.env.PORT, () => {
        console.log(`server listening at the port ${process.env.PORT}`);
    });
}

export default app;

