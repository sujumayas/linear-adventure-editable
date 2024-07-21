const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/game-data', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'gameData.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading game data:', error);
        res.status(500).json({ message: 'Error reading game data', error: error.message });
    }
});

app.post('/api/game-data', async (req, res) => {
    try {
        await fs.writeFile(path.join(__dirname, 'data', 'gameData.json'), JSON.stringify(req.body, null, 2));
        res.json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error: error.message });
    }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));