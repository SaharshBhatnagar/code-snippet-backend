import express from 'express';
import { getAllSnippets, getUserFavorites, toggleFavorites } from '../controllers/snippetController.js';
import { verifyAuth } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/', getAllSnippets);
router.get('/favorites', verifyAuth, getUserFavorites);
router.post('/:id/favorite', verifyAuth, toggleFavorites);

export default router;