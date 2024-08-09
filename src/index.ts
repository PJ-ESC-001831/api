import express from 'express';

import healthRoute from './modules/health/route';

const app = express();
const port = process.env.PORT || 3000;

app.use(healthRoute );

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
