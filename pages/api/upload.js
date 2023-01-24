import cloudinary from "cloudinary";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const files = await parseAsync(req);
      const { imageFile } = files;

      const result = await cloudinary.v2.uploader.upload(imageFile.filepath, {
        public_id: imageFile.newFilename,
      });

      res.status(201).json(result);
      break;
    default:
      res.status(400).json({ message: "Method not supported." });
  }
}

function parseAsync(request) {
  // create a Promise which resolves with the parsed files
  return new Promise((resolve, reject) => {
    // instantiate formidable
    const form = formidable({});

    // parse form request with callback
    form.parse(request, (error, fields, files) => {
      if (error) {
        console.log(error);
        // reject Promise if something went wrong
        reject(error);
        return;
      }
      // resolve Promise if files were parsed correctly
      resolve(files);
    });
  });
}
