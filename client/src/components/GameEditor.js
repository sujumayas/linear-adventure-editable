import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GameEditor() {
    const [gameData, setGameData] = useState(null);
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

    const handleStepChange = (stepKey, field, value) => {
        setGameData(prevData => ({
            ...prevData,
            story_progression: {
                ...prevData.story_progression,
                [stepKey]: {
                    ...prevData.story_progression[stepKey],
                    [field]: value
                }
            }
        }));
    };

    const handleOptionChange = (stepKey, optionIndex, value) => {
        setGameData(prevData => ({
            ...prevData,
            story_progression: {
                ...prevData.story_progression,
                [stepKey]: {
                    ...prevData.story_progression[stepKey],
                    options: prevData.story_progression[stepKey].options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                    )
                }
            }
        }));
    };

    const addOption = (stepKey) => {
        setGameData(prevData => ({
            ...prevData,
            story_progression: {
                ...prevData.story_progression,
                [stepKey]: {
                    ...prevData.story_progression[stepKey],
                    options: [...prevData.story_progression[stepKey].options, "New option"]
                }
            }
        }));
    };

    const removeOption = (stepKey, optionIndex) => {
        setGameData(prevData => ({
            ...prevData,
            story_progression: {
                ...prevData.story_progression,
                [stepKey]: {
                    ...prevData.story_progression[stepKey],
                    options: prevData.story_progression[stepKey].options.filter((_, idx) => idx !== optionIndex),
                    correct_option: prevData.story_progression[stepKey].correct_option > optionIndex
                        ? prevData.story_progression[stepKey].correct_option - 1
                        : prevData.story_progression[stepKey].correct_option
                }
            }
        }));
    };

    const addNewStep = () => {
        const newStepKey = Object.keys(gameData.story_progression).length + 1;
        setGameData(prevData => ({
            ...prevData,
            story_progression: {
                ...prevData.story_progression,
                [newStepKey]: {
                    text: "New step description",
                    options: ["Option 1", "Option 2"],
                    correct_option: 1
                }
            }
        }));
    };

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:5001/api/game-data', gameData);
            alert('Game data saved successfully!');
        } catch (error) {
            console.error('Error saving game data:', error);
            alert('Error saving game data');
        }
    };

    if (loading) return <div>Loading editor data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gameData) return <div>No game data available for editing.</div>;

    return (
        <div>
            <h2>Game Editor</h2>
            {Object.entries(gameData.story_progression).map(([stepKey, step]) => (
                <div key={stepKey} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Step {stepKey}</h3>
                    <textarea
                        value={step.text}
                        onChange={(e) => handleStepChange(stepKey, 'text', e.target.value)}
                        rows="4"
                        cols="50"
                    />
                    <br />
                    <h4>Options:</h4>
                    {step.options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(stepKey, index, e.target.value)}
                            />
                            <button onClick={() => removeOption(stepKey, index)}>Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addOption(stepKey)}>Add Option</button>
                    <br />
                    <label>
                        Correct Option:
                        <select
                            value={step.correct_option}
                            onChange={(e) => handleStepChange(stepKey, 'correct_option', parseInt(e.target.value))}
                        >
                            {step.options.map((_, index) => (
                                <option key={index} value={index + 1}>{index + 1}</option>
                            ))}
                        </select>
                    </label>
                </div>
            ))}
            <button onClick={addNewStep}>Add New Step</button>
            <hr />
            <h3>Fail Screen</h3>
            <textarea
                value={gameData.game_over.text}
                onChange={(e) => setGameData(prevData => ({ ...prevData, game_over: { ...prevData.game_over, text: e.target.value } }))}
                rows="4"
                cols="50"
            />
            <hr />
            <button onClick={handleSave}>Save All Changes</button>
        </div>
    );
}

export default GameEditor;