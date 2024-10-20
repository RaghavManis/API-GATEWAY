const { StatusCodes } = require("http-status-codes");
const AppError = require("../utills/error/app-error");


class crudRepository{
    constructor(model){
        this.model = model ;
    }

    async create(data){ 
        console.log("inside create function in crud repo") ;
        const response = await this.model.create(data) ;
        return response ;
    }
    
    async get(id){ 
        const response = await this.model.findByPk(id) ;
        if(!response){
            throw new AppError("data you are looking for is not in the database" , StatusCodes.NOT_FOUND) ;
        }
        return response ;
    } 
    
    async getAll(){
        const response = await this.model.findAll() ;
        return response ;
    }

    async update(data , id) { 
        const [updatedRows] = await this.model.update(data, {
            where: {   
                id: id ,
            }
        });
        if (updatedRows === 0) {
            // If no rows were updated, throw a NOT FOUND error
            throw new AppError("The data  you want to update is not present in the database", StatusCodes.NOT_FOUND);
        }
       
        // Fetch the updated airplane and return it
        const updatedData = await this.model.findByPk(id);
        return updatedData;
    }
   
    async destroy(data) {
        const response = await this.model.destroy({
            where: {
                id: data
            }
        });
        if(response == 0){
            console.log("response in crud repo inside condition of not present --> ",response);
            throw new AppError("airplane you requested for deleting is not on the database" , StatusCodes.NOT_FOUND) ;  
        }
        return response;
    }
}

module.exports = crudRepository ;