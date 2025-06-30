export default class CustomError {
  static createError({ name = 'Error', cause, message, code = 500 }) {
    const error = new Error(message);     // Creamos un nuevo error con el mensaje que le pasamos
    error.name = name;                    // Le asignamos un nombre personalizado al error (ej: "PetCreationError")
    error.cause = cause;                  // Indicamos la causa del error (ej: "Falta el campo 'name'")
    error.code = code;                    // Código de estado HTTP (ej: 400, 422, 500)
    throw error;                          // Lanzamos el error para que lo capture el manejador
  }
}
