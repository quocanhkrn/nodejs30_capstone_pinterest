import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';

export const handleErr = (err: any) => {
  if (err) {
    throw err;
  } else {
    throw new InternalServerErrorException();
  }
};

export const imageUploadOptions = {
  storage: diskStorage({
    destination: process.cwd() + '/public/imgs',
    filename: (req, file, callback) => {
      callback(null, Date.now() + '_' + file.originalname);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new BadRequestException('Not supported filetype!');
      return callback(error, false);
    }
    callback(null, true);
  },
};
