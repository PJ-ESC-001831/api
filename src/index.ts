import express from 'express';
import bodyParser from 'body-parser';
import fileParser from 'express-multipart-file-parser';
import cors from 'cors';

import health from '@modules/health';
import logger from '@utils/logger';

import requestLogger from './middleware/logger';

const app = express();
const port = process.env.PORT || 3000;

// Add middleware to the app
app.use(requestLogger);
app.use(fileParser);
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Add routes to the app
app.use('/v1/health', health);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
