import express from 'express';
import { getAllSnippets, getUserFavorites, toggleFavorites, createSnippet, updateSnippet, deleteSnippet } from '../controllers/snippetController.js';
import { verifyAuth } from '../middleware/authmiddleware.js';

const router = express.Router();

// GET routes
router.get('/', getAllSnippets);
router.get('/favorites', verifyAuth, getUserFavorites);

// POST routes
router.post('/', verifyAuth, createSnippet);
router.post('/create', verifyAuth, createSnippet);
router.post('/:id/favorite', verifyAuth, toggleFavorites);



// PUT (Update)
router.put('/:id', verifyAuth, updateSnippet);

// DELETE
router.delete('/:id', verifyAuth, deleteSnippet);

export default router;