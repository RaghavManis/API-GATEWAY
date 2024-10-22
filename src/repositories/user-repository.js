const crudRepository = require("./crud-repository") ;
const {User} = require("../models") ;

class UserRepository extends crudRepository {
    constructor(){
        super(User) ;
    }

    async getUserByEmail(email){
        const users = await User.findOne({
            where : {
                email : email
            }
        }) ;
        return users ;
    }
}

module.exports = UserRepository ;