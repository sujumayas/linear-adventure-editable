import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
    const [gameData, setGameData] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGameData();
    }, []);

    const fetchGameData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/game-data');
            setGameData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching game data:', error);
            setError('Failed to load game data. Please try again.');
            setLoading(false);
        }
    };

    const handleChoice = (choice) => {
        if (!gameData) return;

        const currentStepData = gameData.story_progression[currentStep];
        if (choice === currentStepData.correct_option) {
            setCurrentStep(currentStep + 1);
        } else {
            setGameOver(true);
        }
    };

    if (loading) return <div>Loading game data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gameData) return <div>No game data available.</div>;

    if (gameOver) {
        return (
            <div>
                <h2>Game Over</h2>
                <pre>{gameData.game_over.text}</pre>
                <button onClick={() => { setCurrentStep(1); setGameOver(false); }}>Restart</button>
            </div>
        );
    }

    const currentStepData = gameData.story_progression[currentStep];

    if (!currentStepData) {
        return (
            <div>
                <h2>You Win!</h2>
                <pre>{gameData.win_screen.text}</pre>
                <button onClick={() => setCurrentStep(1)}>Play Again</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Linear Adventure</h2>
            <p>{currentStepData.text}</p>
            <ul>
                {currentStepData.options.map((option, index) => (
                    <li key={index}>{index + 1}. {option}</li>
                ))}
            </ul>
            <div>
                {currentStepData.options.map((_, index) => (
                    <button key={index} onClick={() => handleChoice(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Game;