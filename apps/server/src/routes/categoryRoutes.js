import express from 'express';
import categoryController from '../controllers/categoryController.js';
import upload from '../middlewares/categoryUploadMiddleware.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', upload.single('image'), categoryController.createCategory);
router.put('/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
