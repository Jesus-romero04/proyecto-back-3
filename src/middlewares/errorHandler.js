export function errorHandler(err, req, res, next) {
  // Usa el logger para registrar el error real
  req.logger?.error(`❌ Error capturado: ${err.name} - ${err.message}`);

  res.status(err.code || 500).json({
    status: 'error',
    message: err.message || 'Error inesperado',
    cause: err.cause || 'Desconocido'
  });
}
