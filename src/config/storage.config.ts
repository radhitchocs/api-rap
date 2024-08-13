import { extname } from 'path';

import { diskStorage } from 'multer';

type FileExtension = '.jpg' | '.jpeg' | '.png' | '.gif';

enum ValidationErrorMessages {
  ONLY_IMAGE_FILES = 'Only image files are allowed!',
  ONLY_PDF_FILES = 'Only PDF files are allowed!',
}

export const storage = diskStorage({
  destination: './uploads',
  filename: (_, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  return `${Date.now()}${extname(file.originalname)}`;
}

export const validateFileExtension =
  (req, file, callback) =>
  (allowedFileExtension: FileExtension[], errorMessage?: string) => {
    const ext = extname(file.originalname) as FileExtension;

    if (allowedFileExtension.includes(ext)) {
      return callback(null, true);
    }

    return callback(
      new Error(errorMessage || ValidationErrorMessages.ONLY_IMAGE_FILES),
    );
  };
