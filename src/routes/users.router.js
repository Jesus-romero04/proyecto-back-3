import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import uploaderDocuments from '../middlewares/uploaderDocuments.js';

const router = Router();

// ✅ Nueva ruta Clase 13
router.post('/:uid/documents', uploaderDocuments.array('documents'), usersController.uploadDocuments);
router.delete('/inactive', usersController.deleteInactiveUsers);

router.get('/',usersController.getAllUsers);
router.get('/:uid',usersController.getUser);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);



export default router;