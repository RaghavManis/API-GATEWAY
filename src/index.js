const express = require('express');

const { rateLimit } = require("express-rate-limit") ;
const { createProxyMiddleware } = require("http-proxy-middleware") ;

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const limiter = rateLimit({
    windowMs: 200 * 60 * 1000, // 2 minutes window
    max: 3000 , // Limit each IP to 3 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
})

const app = express();

app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;

app.use(limiter) ;

/**
 *                                       user
 *                                        |
 *                                        v
 *                            localhost:3001 (API Gateway)
 *                                        |
 *                                        v
 *                                       / \
 *         localhost:3000/api/v1/flights     localhost:4000/api/v1/bookings
 */
 
// localhost:5000/flightService/api/get/info =====> localhost:3000/api/get/info
app.use("/flightService" , createProxyMiddleware({
    target : ServerConfig.FLIGHT_SERVICE ,
    changeOrigin : true ,
    pathRewrite : {'^/flightService' : '/'} , 
}))

// localhost:5000/bookinservice/api/get/info =====> localhost:4000/api/get/info
app.use("/bookingService" , createProxyMiddleware({//             A
    target : ServerConfig.BOOKING_SERVICE , //                    |
    changeOrigin : true ,   //                                    |
    pathRewrite : {'^/bookingService' : '/'} , // this line of code is responsible for the above conversion 
}))

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
 