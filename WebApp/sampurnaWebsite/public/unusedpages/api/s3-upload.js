export { APIRoute as default } from 'next-s3-upload';

APIRoute.configure({
    key(req, filename) {
      return `my/uploads/path/${filename.toUpperCase()}`;
    },
  });