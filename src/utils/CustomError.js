export class CustomError{
    static generateError (nombre, mensaje, causa, code = 400) {
        let error = new Error(mensaje, {cause: causa});
        error.name = nombre;
        error.code = code;
        error.custom = true

        throw error
    };
};