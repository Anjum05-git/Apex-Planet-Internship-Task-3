/**
 * Quiz functionality
 * Fetches questions from Open Trivia DB and handles quiz logic
 */
export function initQuiz() {
  const quizContainer = document.getElementById('quiz');
  if (!quizContainer) return;

  let currentQuestion = 0;
  let score = 0;
  let questions = [];
  let selectedAnswer = null;

  // Initialize quiz
  async function initializeQuiz() {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      
      if (data.results) {
        questions = data.results.map(q => ({
          question: decodeHTML(q.question),
          correct_answer: decodeHTML(q.correct_answer),
          options: shuffleArray([
            ...q.incorrect_answers.map(a => decodeHTML(a)),
            decodeHTML(q.correct_answer)
          ])
        }));
        
        renderQuestion();
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      quizContainer.innerHTML = `
        <div class="quiz-error">
          <h3>Error Loading Quiz</h3>
          <p>Please try again later.</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  // Render current question
  function renderQuestion() {
    const question = questions[currentQuestion];
    
    quizContainer.innerHTML = `
      <div class="quiz-progress">
        <span>Question ${currentQuestion + 1}/${questions.length}</span>
        <span class="quiz-score">Score: ${score}</span>
      </div>
      
      <div class="quiz-question">${question.question}</div>
      
      <div class="quiz-options">
        ${question.options.map((option, index) => `
          <button class="quiz-option" data-index="${index}">
            ${option}
          </button>
        `).join('')}
      </div>
      
      <div class="quiz-feedback"></div>
      
      <div class="quiz-controls">
        ${currentQuestion > 0 ? 
          `<button class="btn btn-secondary" id="prevQuestion">Previous</button>` : 
          `<div></div>`
        }
        <button class="btn btn-primary" id="nextQuestion" disabled>
          ${currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    `;

    // Add event listeners
    const options = quizContainer.querySelectorAll('.quiz-option');
    options.forEach(option => {
      option.addEventListener('click', () => selectAnswer(option));
    });

    const nextButton = document.getElementById('nextQuestion');
    if (nextButton) {
      nextButton.addEventListener('click', nextQuestion);
    }

    const prevButton = document.getElementById('prevQuestion');
    if (prevButton) {
      prevButton.addEventListener('click', previousQuestion);
    }
  }

  // Handle answer selection
  function selectAnswer(selectedOption) {
    const question = questions[currentQuestion];
    const selectedText = selectedOption.textContent.trim();
    
    // Remove previous selection
    const options = quizContainer.querySelectorAll('.quiz-option');
    options.forEach(option => {
      option.classList.remove('selected', 'correct', 'incorrect');
      option.classList.add('disabled');
    });
    
    // Add new selection
    selectedOption.classList.add('selected');
    
    // Show feedback
    const feedback = quizContainer.querySelector('.quiz-feedback');
    const isCorrect = selectedText === question.correct_answer;
    
    if (isCorrect && !selectedAnswer) {
      score++;
      quizContainer.querySelector('.quiz-score').textContent = `Score: ${score}`;
    }
    
    // Mark correct and incorrect answers
    options.forEach(option => {
      const optionText = option.textContent.trim();
      if (optionText === question.correct_answer) {
        option.classList.add('correct');
      } else if (option === selectedOption && !isCorrect) {
        option.classList.add('incorrect');
      }
    });
    
    // Show feedback message
    feedback.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    setTimeout(() => feedback.classList.add('show'), 10);
    
    // Enable next button
    const nextButton = document.getElementById('nextQuestion');
    if (nextButton) {
      nextButton.disabled = false;
    }
    
    selectedAnswer = selectedText;
  }

  // Handle next question
  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      selectedAnswer = null;
      renderQuestion();
    } else {
      showResults();
    }
  }

  // Handle previous question
  function previousQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  }

  // Show final results
  function showResults() {
    const percentage = (score / questions.length) * 100;
    let message = '';
    
    if (percentage >= 90) {
      message = 'Outstanding! You\'re a quiz master!';
    } else if (percentage >= 70) {
      message = 'Great job! You did very well!';
    } else if (percentage >= 50) {
      message = 'Good effort! Keep practicing!';
    } else {
      message = 'Don\'t worry! Try again to improve your score!';
    }
    
    quizContainer.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-score">${score}/${questions.length}</div>
        <p class="quiz-result-message">${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  // Utility function to decode HTML entities
  function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  // Utility function to shuffle array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Start the quiz
  initializeQuiz();
}