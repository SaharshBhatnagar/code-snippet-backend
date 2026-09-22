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

export async function createSnippet(req, res) {
    try {
        const { title, description, code, category, language } = req.body;
        const author = req.user.username; 

        const newSnippet = await Snippets.create(title, description, code, category, language, author);
        return res.status(201).json({ message: "Snippet created successfully", snippet: newSnippet });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "You already have a snippet with this title." });
        }
        return res.status(500).json({ error: "Failed to create snippet" });
    }
}

export async function updateSnippet(req, res) {
    try {
        const snippetId = req.params.id;
        const { title, description, code, category, language } = req.body;
        const author = req.user.username; 

        const updatedSnippet = await Snippets.update(snippetId, title, description, code, category, language, author);
        
        if (!updatedSnippet) {
            return res.status(404).json({ error: "Snippet not found or unauthorized" });
        }
        return res.status(200).json({ message: "Snippet updated", snippet: updatedSnippet });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update snippet" });
    }
}

export async function deleteSnippet(req, res) {
    try {
        const snippetId = req.params.id;
        const author = req.user.username;

        const isDeleted = await Snippets.delete(snippetId, author);
        
        if (!isDeleted) {
            return res.status(404).json({ error: "Snippet not found or unauthorized" });
        }
        return res.status(200).json({ message: "Snippet deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Failed to delete snippet" });
    }
}
