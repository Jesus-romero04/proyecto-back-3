import petModel from "./models/Pet.js";

export default class Pet {

    get = (params) =>{
        //throw new Error("Error forzado en el DAO de pet");
        return petModel.find(params)
    }

    getBy = (params) =>{
        return petModel.findOne(params);
    }

    save = (doc) =>{
        //throw new Error("Error forzado en el DAO de pet");
        return petModel.create(doc);
    }

    update = (id,doc) =>{
        return petModel.findByIdAndUpdate(id,{$set:doc}, {new: true})
    }

    delete = (id) =>{
        return petModel.findByIdAndDelete(id);
    }
}