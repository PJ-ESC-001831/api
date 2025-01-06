import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { labeledLogger } from '@modules/logger';
import env from '@modules/env';

const logger = labeledLogger('root');

// Import routes
import health from '@modules/health/routes';
import campaign from '@modules/campaign/routes';
import user from '@modules/user/routes';

// Import middleware
import authGuard from '@modules/auth/middleware';
import requestLogger from '@modules/logger/middleware';
import requestErrorHandler from '@modules/error/middleware';

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

// Add routes to the app
const unprotectedRoutes = Router();
unprotectedRoutes.use('/v1/health', health.v1);

const protectedRoutes = Router();
protectedRoutes.use('/v1/campaign', campaign.v1);
protectedRoutes.use('/v1/user', user.v1);

// Only add the authGuard middleware if we are not in the development environment
if (!(env.NODE_ENV === 'development')) {
  protectedRoutes.use(authGuard);
}

const apiRoutes = Router();
apiRoutes.use(express.json());
apiRoutes.use(requestErrorHandler);
apiRoutes.use(requestLogger);
apiRoutes.use(cors({ origin: true }));
apiRoutes.use(bodyParser.urlencoded({ extended: true }));

apiRoutes.use(unprotectedRoutes);
apiRoutes.use(protectedRoutes);

const app = express();
app.use('/api', apiRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
