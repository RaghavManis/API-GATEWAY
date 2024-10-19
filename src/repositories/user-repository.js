const crudRepository = require("./crud-repository") ;
const {Users} = require("../models") ;

class UserRepository extends crudRepository {
    constructor(){
        super(Users) ;
    }
}

module.exports = UserRepository ;