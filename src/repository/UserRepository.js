
import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserByEmail = (email) =>{
        return this.getBy({email});
    }
    getUserById = (id) =>{
        return this.getBy({_id:id})
    }
    // ✅ Nuevo método para Clase 13: obtener usuarios inactivos
    getInactiveSince = async (date) => {
        return await this.dao.getInactiveSince(date);
    }
    
}