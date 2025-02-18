import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express, { Response, Request } from 'express';
import { fileURLToPath } from 'node:url';
import path, { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import multer from 'multer';
import fs from 'fs';
import { imageSize } from 'image-size';
import cors from 'cors';
import compression from 'compression';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // Middleware
  server.use(compression());
  server.use(cors()); // Enable CORS for all routes

  // Set up Multer for File Uploads
  const storage = multer.diskStorage({
    destination: (req: Request, file, cb: (error: Error | null, destination: string) => void) => {
      const uploadDir = 'uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req: Request, file, cb: (error: Error | null, filename: string) => void) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage });

  // File upload endpoint
  server.post('/upload', upload.array('images', 10), (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded!' });
    }

    const fileUrls: string[] = []; // Type the array

    if (Array.isArray(req.files)) { // Type guard to ensure it's an array
        req.files.forEach(file => {
            fileUrls.push(`/uploads/${file.filename}`);
        });
    } else {
        for (const field in req.files) {
            req.files[field].forEach(file => {
                fileUrls.push(`/uploads/${file.filename}`);
            });
        }
    }
    
    return res.json({ message: 'Files uploaded successfully!', files: req.files, fileUrls });
  });

  // Serve static files from the uploads folder
  server.use('/uploads', express.static('uploads'));

  // Endpoint to get the list of image filenames
  server.get('/api/images', (req, res) => {
    const uploadsDir = 'uploads';

    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to read uploads directory' });
      }

      // Filter out non-image files (optional)
      const imageData = files
        .filter((file) => /\.(jpg|jpeg|png|gif|jfif|avif)$/i.test(file))
        .map((file) => {
          const dimensions = imageSize(path.join(uploadsDir, file)); // Use imageSize
          return {
            name: file,
            width: dimensions.width,
            height: dimensions.height,
          };
        });

      res.json(imageData);
    });
  });

  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All other routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Skip API routes and static files
    if (originalUrl.startsWith('/api') || originalUrl.startsWith('/uploads')) {
      return next();
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 3000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();