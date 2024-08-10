import express, { Router } from 'express';
import bodyParser from 'body-parser';
import fileParser from 'express-multipart-file-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import health from '@modules/health';
import campaign from '@modules/campaign';

// Import middleware
import logger from '@utils/logger';

import requestLogger from './middleware/logger';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Add middleware to the app
app.use(requestLogger);
app.use(fileParser);
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Add routes to the app
const openRoutes = Router();
openRoutes.use('/v1/health', health.v1);

const protectedRoutes = Router();
protectedRoutes.use('/v1/campaign', campaign.v1);

const apiRoutes = Router();
apiRoutes.use(openRoutes);
apiRoutes.use(protectedRoutes);

app.use('/api', apiRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
