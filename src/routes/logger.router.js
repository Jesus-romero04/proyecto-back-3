import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  req.logger.debug('🔵 Esto es un log DEBUG');
  req.logger.http('🟢 Esto es un log HTTP');
  req.logger.info('📘 Esto es un log INFO');
  req.logger.warning('🟡 Esto es un log WARNING');
  req.logger.error('🔴 Esto es un log ERROR');
  req.logger.fatal('🟣 Esto es un log FATAL');

  res.send('✅ Logs generados. Revisa la consola y el archivo errors.log si estás en producción.');
});

export default router;
