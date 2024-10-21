const { StatusCodes } = require('http-status-codes');

const info = (req, res) => {
    // console.log("inside info function in info controller , checking the presence of user id return by the checkAuth function in user middleware--> " + req.body.user) ; // NOT WORKING , because you don't setup data like this 
    console.log("inside info function in info controller , checking the presence of user id return by the checkAuth function in user middleware--> " + req.user) ; // WORKING , we have directly set the data to the req object 
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Basic API is running from localhost 5000",
        error: {},
        data: {},
    });
}

module.exports = {
    info
}