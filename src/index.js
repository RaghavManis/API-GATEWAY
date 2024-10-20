const express = require('express');
const {rateLimit} = require("express-rate-limit") ;

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes window
    max: 3 , // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
})

const app = express();

app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;

app.use(limiter) ;

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
 