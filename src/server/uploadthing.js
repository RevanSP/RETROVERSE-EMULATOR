import { createUploadthing } from "uploadthing/next-legacy";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    blob: {
      maxFileSize: "2GB", 
      maxFileCount: 4,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("File uploaded:", file.url);

    return { uploadedFileUrl: file.url };
  }),
};