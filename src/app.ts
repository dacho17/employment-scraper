import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import AppRouter from './router.js';
import AdDetailsRouter from './routers/adDetailsRouter.js';

const app = express();
const port = 8180;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(AppRouter.openRoutes());
app.use(AdDetailsRouter.openRoutes());
app.listen(port, () => {
  console.log(`Server is now listening on port ${port} `)
});
