import Snippets from '../models/snippetModel.js';

export async function getAllSnippets(req, res) {
    try {
        const snippets = await Snippets.findAll();
        res.status(200).json(snippets);
    }
    catch (err) {
        console.error("Error fetching snippets:", err);
        res.status(500).json({ error: "Failed to retrieve snippets from database" });
    }
};

export async function getUserFavorites(req, res) {
    try {
        const userId = req.user.id;
        const favSnippets = await Snippets.getFavorites(userId);

        return res.status(200).json( { res: favSnippets } );
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to fetch favorites" });
    }
};

export async function toggleFavorites(req, res) {
    const userId = req.user.id;
    const snippetId = req.params.id;
    
    try {
        const addSnippets = await Snippets.addFavorite(userId, snippetId);
        return res.status(200).json( { message: "Added to favorites", isFavorite: true } );
    }
    catch (err) {
        if (err.code === '23505') {
            const removed = await Snippets.removeFavorite(userId, snippetId);
            return res.status(200).json({ message: "Snippet removed from favorites.", isFavorite: false })
        }
        return res.status(500).json({ err: "Server error"});
    }
};