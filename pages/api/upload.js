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
      await new Promise((reject, resolve) => {
        const form = formidable({});
        form.parse(req, async (error, fields, files) => {
          if (error) {
            console.log(error);
            res.status(500).json({
              message: error,
            });
            reject();
            return;
          }
          const { file } = files;

          const result = await cloudinary.v2.uploader.upload(file.filepath, {
            public_id: file.newFilename,
          });

          res.status(201).json(result);
          resolve();
        });
      });
      break;
    default:
      res.status(400).json({ message: "Method not supported." });
  }
}
