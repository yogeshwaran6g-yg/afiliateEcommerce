import express from 'express';
import comissionConfigController from '#controllers/commissionConfigController.js';

const router = express.Router();

router.get('/', comissionConfigController.getConfigs);
router.post('/', comissionConfigController.updateConfig);
router.delete('/:level', comissionConfigController.deleteConfig);

export default router;
