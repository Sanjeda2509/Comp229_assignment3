import express from 'express';
const router = express.Router();
import * as controller from '../controllers/user.controller.js';

import { requireSignin, requireAdmin } from '../middleware/auth.middleware.js';

router.post('/', controller.create);                        // sign up – public
router.post('/signin', controller.signin);                  // public
router.post('/signout', controller.signout);                // public
router.get('/', requireSignin, controller.findAll);         // protected
router.get('/:id', requireSignin, controller.findOne);      // protected
router.put('/:id', requireSignin, requireAdmin, controller.update);       // admin only
router.delete('/:id', requireSignin, requireAdmin, controller.deleteOne); // admin only
router.delete('/', requireSignin, requireAdmin, controller.deleteAll);    // admin only

export default router;