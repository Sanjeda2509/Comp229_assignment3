import express from 'express';
const router = express.Router();
import * as controller from '../controllers/project.controller.js';

import { requireSignin, requireAdmin } from '../middleware/auth.middleware.js';

router.get('/', controller.findAll);        // GET api/projects – public
router.get('/:id', controller.findOne);     // GET api/projects/:id – public
router.post('/', requireSignin, requireAdmin, controller.create);        // admin only
router.put('/:id', requireSignin, requireAdmin, controller.update);      // admin only
router.delete('/:id', requireSignin, requireAdmin, controller.deleteOne); // admin only
router.delete('/', requireSignin, requireAdmin, controller.deleteAll);   // admin only

export default router;