const crudRepository = require("./crud-repository") ;
const {Role} = require("../models") ;

class RoleRepository extends crudRepository {
    constructor(){
        super(Role) ;
    }
    async getRoleByName(name){
        console.log("name inside getRoleByName ==>" + name) ;
        const role = await Role.findOne({
            where : {
                name : name
            }
        }) ;
        console.log("response inside getRoleByName in role repo -->  " + role)
        return role ;
    }
}
module.exports = RoleRepository ;

// const crudRepository = require("./crud-repository") ;
// const {User} = require("../models") ;

// class UserRepository extends crudRepository {
//     constructor(){   
//         super(User) ;
//     }

//     async getUserByEmail(email){
//         const users = await User.findOne({
//             where : {
//                 email : email
//             }
//         }) ;
//         return users ;
//     }
// }

// module.exports = UserRepository ;