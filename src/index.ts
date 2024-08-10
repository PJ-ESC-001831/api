import express, { Router } from 'express';
import bodyParser from 'body-parser';
import fileParser from 'express-multipart-file-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import logger from '@utils/logger';

// Import routes
import health from '@modules/health';
import campaign from '@modules/campaign';

// Import middleware
import authGuard from '@middleware/auth';
import requestLogger from '@middleware/logger';
import requestErrorHandler from '@middleware/error';

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

// Add routes to the app
const openRoutes = Router();
openRoutes.use('/v1/health', health.v1);

const protectedRoutes = Router();
protectedRoutes.use(authGuard);
protectedRoutes.use('/v1/campaign', campaign.v1);

const apiRoutes = Router();
apiRoutes.use(openRoutes);
apiRoutes.use(protectedRoutes);
apiRoutes.use(requestErrorHandler);
apiRoutes.use(requestLogger);
apiRoutes.use(fileParser);
apiRoutes.use(cors({ origin: true }));
apiRoutes.use(bodyParser.urlencoded({ extended: true }));

const app = express();
app.use('/api', apiRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
