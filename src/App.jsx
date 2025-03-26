import React, { useState } from 'react';
import './style.css';

const JeopardyGameDemo = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Science' },
    { id: 2, name: 'History' },
    { id: 3, name: 'Geography' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Sports' }
  ]);

  const [score, setScore] = useState(0);
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState({
    categoryId: '',
    text: '',
    answer: '',
    value: 100
  });

  const questionData = {
    'science-100': { text: 'This gas makes up about 78% of Earth\'s atmosphere', answer: 'What is Nitrogen?' },
    'science-200': { text: 'This element has the atomic number 79', answer: 'What is Gold?' },
    'history-100': { text: 'This document, signed in 1776, declared American independence from Great Britain', answer: 'What is the Declaration of Independence?' },
    'history-200': { text: 'This ancient wonder was a lighthouse built in Alexandria, Egypt', answer: 'What is the Lighthouse of Alexandria?' },
    'geography-100': { text: 'This is the largest ocean on Earth', answer: 'What is the Pacific Ocean?' },
    'geography-200': { text: 'This African country is home to the Nile River and the Pyramids of Giza', answer: 'What is Egypt?' },
    'entertainment-100': { text: 'This Disney movie features a lion cub named Simba', answer: 'What is The Lion King?' },
    'entertainment-200': { text: 'This actor played Iron Man in the Marvel Cinematic Universe', answer: 'Who is Robert Downey Jr.?' },
    'sports-100': { text: 'This sport uses a shuttlecock', answer: 'What is Badminton?' },
    'sports-200': { text: 'This athlete holds the record for most Olympic gold medals', answer: 'Who is Michael Phelps?' }
  };

  const selectQuestion = (categoryId, difficultyLevel) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return setError('Invalid category');

    const categoryName = category.name.toLowerCase();
    const value = (difficultyLevel + 1) * 100;
    const questionKey = `${categoryId}-${difficultyLevel}`;
    const lookupKey = `${categoryName}-${value}`;

    if (revealedQuestions[questionKey]) return;

    setLoading(true);
    setTimeout(() => {
      const question = questionData[lookupKey];

      if (question) {
        setRevealedQuestions(prev => ({ ...prev, [questionKey]: true }));
        setActiveQuestion({ text: question.text, answer: question.answer, value, categoryId });
        setShowAnswer(false);
      } else {
        setError(`No question found for ${categoryName} with value $${value}`);
        setTimeout(() => setError(null), 3000);
      }

      setLoading(false);
    }, 500);
  };

  const handleAnswerResult = (correct) => {
    if (activeQuestion) {
      setScore(prev => prev + (correct ? activeQuestion.value : -activeQuestion.value));
    }
    setActiveQuestion(null);
    setShowAnswer(false);
  };

  const resetGame = () => {
    setRevealedQuestions({});
    setScore(0);
  };

  const addCategory = () => {
    if (!newCategoryInput.trim()) return;
    const isDuplicate = categories.some(cat => cat.name.toLowerCase() === newCategoryInput.toLowerCase());
    if (isDuplicate) return setError('Category already exists');

    setLoading(true);
    setTimeout(() => {
      const newId = categories.length + 1;
      setCategories([...categories, { id: newId, name: newCategoryInput }]);
      setNewCategoryInput('');
      setLoading(false);
    }, 500);
  };

  const refreshBoard = () => {
    setRevealedQuestions({});
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="header">
        <h1>Jeopardy Style Game</h1>
        <div>
          <button className="button" onClick={() => setShowAddQuestion(!showAddQuestion)}>
            {showAddQuestion ? 'Hide Form' : 'Add Question'}
          </button>
          <button className="button">User Profile</button>
        </div>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div>
          <h2>Player: Guest</h2>
          <h2>Score: ${score}</h2>

          <input
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
            placeholder="New Category"
          />
          <button className="button" onClick={addCategory} disabled={loading}>Add Category</button>
          <button className="button" onClick={resetGame}>Reset Game</button>
          <button className="button" onClick={refreshBoard}>Refresh Board</button>
        </div>

        {loading && <p>Loading...</p>}

        <table className="category-table">
          <thead>
            <tr>
              {categories.map(category => (
                <th key={category.id}>{category.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map(difficulty => (
              <tr key={difficulty}>
                {categories.map(category => {
                  const key = `${category.id}-${difficulty}`;
                  const value = (difficulty + 1) * 100;
                  const revealed = revealedQuestions[key];

                  return (
                    <td
                      key={key}
                      onClick={() => !revealed && !loading && selectQuestion(category.id, difficulty)}
                      className={revealed ? 'revealed' : ''}
                      
                    >

                      {revealed ? '' : `$${value}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {activeQuestion && (
          <div className="modal-overlay">
            <div className="question-modal">
              <p><strong>Value:</strong> ${activeQuestion.value}</p>
              <p>{activeQuestion.text}</p>
              {!showAnswer ? (
                <button className="button" onClick={() => setShowAnswer(true)}>Show Answer</button>
              ) : (
                <>
                  <p><strong>Answer:</strong> {activeQuestion.answer}</p>
                  <button className="button correct" onClick={() => handleAnswerResult(true)}>Correct</button>
                  <button className="button incorrect" onClick={() => handleAnswerResult(false)}>Incorrect</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        This app was developed by Brogan, Ben, and Dee
      </footer>
    </div>
  );
};

export default JeopardyGameDemo;
