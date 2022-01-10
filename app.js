const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorhandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const httpParameterPolution = require('hpp');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');

//Setting view engine

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
//Serving Statis files
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

//Security Http headers
app.use(helmet());

//Middlewares



//Development Looging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Body parser
app.use(express.json());

//Data sanitization against NoSQl query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

// Prevent parameter polutions
app.use(httpParameterPolution());

// rate limitter, to limit number of http request to server from 1 IP.
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

//Routes

app.get('/', (req, res) => {
    res.status(200).render('base');
});

// Route Middlewares
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const commonRoutes = require('./routes/commonRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const hpp = require('hpp');

app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/client', clientRoutes);
app.use('/api/v1/vendor', vendorRoutes);
app.use('/api/v1/invoice', invoiceRoutes);
app.use('/api/v1/common', commonRoutes);
app.use('/api/v1/payment', paymentRoutes);

//Unhandles routes

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 500));
});

// Error Handler middleware

app.use(errorhandler);

// Export app

module.exports = app;