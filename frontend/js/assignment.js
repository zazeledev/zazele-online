// Assignment Quiz Module
let currentAssignment = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let assignmentTimer = null;
let timeRemaining = 3600; // 60 minutes in seconds
const PASS_MARK = 80;
const TOTAL_TIME = 3600; // 60 minutes

// Load assignment
async function loadAssignment(moduleId, token) {
  try {
    const data = await AssignmentAPI.getAssignment(moduleId, token);
    currentAssignment = data.assignment;
    currentQuestions = data.questions;
    
    if (currentQuestions.length === 0 && currentAssignment.status === 'submitted') {
      // Assignment already submitted, show results instead
      const resultData = await AssignmentAPI.getResults(currentAssignment._id, token);
      displayResults(resultData, resultData.assignment.totalQuestions);
      return {
        status: 'submitted',
        assignment: currentAssignment,
      };
    }

    if (currentQuestions.length === 0) {
      throw new Error('No questions found for this assignment.');
    }

    // Display assignment
    displayQuiz();
    startTimer();

    return {
      status: 'loaded',
      assignment: currentAssignment,
    };
  } catch (error) {
    console.error('Error loading assignment:', error);
    throw error;
  }
}

// Display quiz UI
function displayQuiz() {
  const container = document.getElementById('assignment-container');

  container.innerHTML = `
    <div class="quiz-wrapper">
      <div class="quiz-header">
        <div class="quiz-info">
          <h2>Module Assignment - ${currentQuestions.length} Questions</h2>
          <p>Pass Mark: ${PASS_MARK}%</p>
        </div>
        <div class="quiz-timer">
          <div class="timer-display" id="timer">60:00</div>
          <p>Time Remaining</p>
        </div>
      </div>

      <div class="quiz-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="quiz-progress" style="width: 0%"></div>
        </div>
        <p id="progress-text">Question 1 of ${currentQuestions.length}</p>
      </div>

      <div class="quiz-content">
        <div id="question-container"></div>
      </div>

      <div class="quiz-navigation">
        <button id="btn-prev" class="btn btn-secondary" disabled>← Previous</button>
        <button id="btn-next" class="btn btn-primary">Next →</button>
        <button id="btn-submit" class="btn btn-success" style="display: none;">Submit Assignment</button>
      </div>

      <div class="question-indicators" id="question-indicators"></div>
    </div>
  `;

  // Render question indicators (dots for all questions)
  const indicatorsContainer = document.getElementById('question-indicators');
  indicatorsContainer.innerHTML = currentQuestions
    .map(
      (_, idx) =>
        `<span class="question-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`
    )
    .join('');

  // Attach event listeners
  document.getElementById('btn-prev').addEventListener('click', () => previousQuestion());
  document.getElementById('btn-next').addEventListener('click', () => nextQuestion());
  document.getElementById('btn-submit').addEventListener('click', () => submitAssignment());
  
  document.querySelectorAll('.question-dot').forEach((dot, idx) => {
    dot.addEventListener('click', () => goToQuestion(idx));
  });

  // Display first question
  displayQuestion(0);
}

// Display a specific question
function displayQuestion(index) {
  currentQuestionIndex = index;
  const question = currentQuestions[index];
  const container = document.getElementById('question-container');

  container.innerHTML = `
    <div class="quiz-question">
      <div class="question-meta">
        <span class="question-number">Question ${index + 1} of ${currentQuestions.length}</span>
        ${question.section ? `<span class="question-section">${question.section}</span>` : ''}
        ${question.lessonReference ? `<span class="question-lesson">${question.lessonReference}</span>` : ''}
      </div>
      <h3 class="question-text">${question.question}</h3>
      <div class="question-options">
        ${Object.entries(question.options)
          .map(
            ([key, value]) => `
          <label class="option-label">
            <input 
              type="radio" 
              name="answer" 
              value="${key}" 
              ${question.studentAnswer === key ? 'checked' : ''}
              onchange="handleUpdateAnswer('${question._id}', '${key}')"
            >
            <span class="option-letter">${key.toUpperCase()}</span>
            <span class="option-text">${value}</span>
          </label>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  // Update progress
  updateProgress(index);
  updateNavigationButtons(index);
  updateQuestionDot(index);
}

// Handle update answer (called from UI)
async function handleUpdateAnswer(questionId, selectedAnswer) {
  try {
    const token = getToken();
    await AssignmentAPI.saveAnswer(currentAssignment._id, questionId, selectedAnswer, token);
    
    // Update question in memory
    const question = currentQuestions.find(q => q._id === questionId);
    if (question) {
      question.studentAnswer = selectedAnswer;
    }

    // Mark dot as answered
    const dot = document.querySelector(`.question-dot[data-index="${currentQuestionIndex}"]`);
    if (dot) dot.classList.add('answered');
  } catch (error) {
    console.error('Error saving answer:', error);
    alert('Failed to save answer. Please try again.');
  }
}

// Update progress bar
function updateProgress(index) {
  const percentage = Math.round(((index + 1) / currentQuestions.length) * 100);
  document.getElementById('quiz-progress').style.width = percentage + '%';
  document.getElementById('progress-text').textContent = `Question ${index + 1} of ${currentQuestions.length}`;
}

// Update navigation buttons
function updateNavigationButtons(index) {
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnSubmit = document.getElementById('btn-submit');

  btnPrev.disabled = index === 0;
  
  if (index === currentQuestions.length - 1) {
    btnNext.style.display = 'none';
    btnSubmit.style.display = 'block';
  } else {
    btnNext.style.display = 'block';
    btnSubmit.style.display = 'none';
  }
}

// Navigate to next question
function nextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
}

// Navigate to previous question
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
}

// Jump to specific question
function goToQuestion(index) {
  displayQuestion(index);
}

// Update question dot styling
function updateQuestionDot(index) {
  document.querySelectorAll('.question-dot').forEach((dot, idx) => {
    dot.classList.remove('active');
    if (idx === index) {
      dot.classList.add('active');
    }
    
    // Check if answered
    if (currentQuestions[idx].studentAnswer) {
      dot.classList.add('answered');
    }
  });
}

// Start timer
function startTimer() {
  timeRemaining = TOTAL_TIME;
  
  assignmentTimer = setInterval(() => {
    timeRemaining--;

    // Update display
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Warning at 5 minutes
    if (timeRemaining === 300) {
      alert('⏰ You have 5 minutes remaining!');
    }

    // Auto-submit at 0
    if (timeRemaining <= 0) {
      clearInterval(assignmentTimer);
      submitAssignment();
    }
  }, 1000);
}

// Submit assignment
async function submitAssignment() {
  try {
    clearInterval(assignmentTimer);

    const token = getToken();
    const result = await AssignmentAPI.submitAssignment(currentAssignment._id, token);

    // Display results
    displayResults(result, currentQuestions.length);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    alert('Error submitting assignment: ' + error.message);
  }
}

// Display results page
function displayResults(result, totalQuestions) {
  const { assignment: assignmentResult } = result;
  const container = document.getElementById('assignment-container');
  const passed = assignmentResult.passed;

  container.innerHTML = `
    <div class="assignment-results">
      <div class="results-header ${passed ? 'passed' : 'failed'}">
        <h2>${passed ? '✓ ASSIGNMENT PASSED!' : '✗ Assignment Not Passed'}</h2>
        <p class="result-message">
          ${passed 
            ? `Congratulations! You have successfully mastered this module.`
            : `You need ${PASS_MARK}% to pass. Please try again.`
          }
        </p>
      </div>

      <div class="results-score">
        <div class="score-card">
          <h3>Your Score</h3>
          <div class="score-display">
            <span class="score-number">${assignmentResult.score}/${assignmentResult.totalQuestions}</span>
            <span class="score-percentage">${assignmentResult.percentage}%</span>
          </div>
        </div>

        <div class="score-card">
          <h3>Pass Mark</h3>
          <div class="score-display">
            <span class="score-number">${PASS_MARK}%</span>
          </div>
        </div>

        <div class="score-card">
          <h3>Time Spent</h3>
          <div class="score-display">
            <span class="score-number">${Math.floor(assignmentResult.timeSpent / 60)}:${(assignmentResult.timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div class="results-actions" style="display: flex; gap: 16px; justify-content: center; margin-top: 40px; padding: 0 40px 40px 40px;">
        ${passed ? `
          <button class="btn btn-success btn-large" onclick="handleProceedToNextModule('${assignmentResult.moduleId}')">Proceed to Next Module →</button>
        ` : `
          <button class="btn btn-primary" onclick="handleRetakeAssignment('${assignmentResult.moduleId}')">Retake Assignment</button>
        `}
        <button class="btn btn-secondary" onclick="goBackToDashboard()">Back to Dashboard</button>
        <button class="btn btn-info" style="background:#17a2b8; color:white;" onclick="displayReview('${assignmentResult._id}')">Review Answers</button>
      </div>
    </div>
  `;
}

// Handle proceeding to next module from results
async function handleProceedToNextModule(currentModuleId) {
  // Return to dashboard first to reset state
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('dashboard-page').classList.add('active');
  
  // We need to find the next module ID
  const token = getToken();
  try {
    const progressList = await StudentAPI.getProgressDashboard(token);
    const currentIndex = progressList.findIndex(m => m.moduleId === currentModuleId);
    
    if (currentIndex !== -1 && currentIndex < progressList.length - 1) {
      const nextModule = progressList[currentIndex + 1];
      if (!nextModule.isFuture) {
        openModuleViewer(nextModule.moduleId);
        return;
      }
    }
    // If no next module, just load dashboard
    loadStudentDashboard();
  } catch (error) {
    console.error('Error proceeding to next module:', error);
    loadStudentDashboard();
  }
}

// Expose to global scope
window.handleProceedToNextModule = handleProceedToNextModule;

// Handle retake assignment
async function handleRetakeAssignment(moduleId) {
  if (!confirm('Are you sure you want to retake the assignment? This will clear your previous score and give you a new set of questions.')) {
    return;
  }

  try {
    const token = getToken();
    const container = document.getElementById('assignment-container');
    container.innerHTML = '<div class="loading">Generating new assignment questions...</div>';
    
    await AssignmentAPI.retakeAssignment(moduleId, token);
    await loadAssignment(moduleId, token);
  } catch (error) {
    alert('Error retaking assignment: ' + error.message);
    goBackToDashboard();
  }
}

// Display review of answers
async function displayReview(assignmentId) {
  try {
    const token = getToken();
    const container = document.getElementById('assignment-container');
    container.innerHTML = '<div class="loading">Loading review...</div>';
    
    const data = await AssignmentAPI.getResults(assignmentId, token);
    const { questions, assignment } = data;

    container.innerHTML = `
      <div class="review-wrapper">
        <div class="review-header">
          <h2>Review Answers</h2>
          <button class="btn btn-secondary btn-small" onclick="displayResults({assignment: ${JSON.stringify(assignment).replace(/"/g, '&quot;')}})">Back to Results</button>
        </div>
        
        <div class="review-list">
          ${questions.map((q, idx) => `
            <div class="review-item ${q.isCorrect ? 'correct' : 'incorrect'}">
              <div class="review-q-meta">
                <span class="q-num">Question ${idx + 1}</span>
                <span class="q-status">${q.isCorrect ? 'Correct' : 'Incorrect'}</span>
              </div>
              <h3 class="review-q-text">${q.question}</h3>
              <div class="review-options">
                ${Object.entries(q.options || {}).map(([key, val]) => {
                  let statusClass = '';
                  if (key === q.correctAnswer) statusClass = 'correct-option';
                  if (key === q.studentAnswer && !q.isCorrect) statusClass = 'wrong-option';
                  
                  return `
                    <div class="review-opt ${statusClass}">
                      <span class="opt-key">${key.toUpperCase()}</span>
                      <span class="opt-val">${val}</span>
                      ${key === q.correctAnswer ? '<span class="opt-badge">Correct Answer</span>' : ''}
                      ${key === q.studentAnswer && !q.isCorrect ? '<span class="opt-badge">Your Answer</span>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="review-footer" style="padding: 40px; text-align: center;">
           <button class="btn btn-primary" onclick="goBackToDashboard()">Finish Review</button>
        </div>
      </div>
    `;
  } catch (error) {
    alert('Error loading review: ' + error.message);
  }
}

// Go back to dashboard
function goBackToDashboard() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('dashboard-page').classList.add('active');
  loadStudentDashboard();
}

// Expose to global scope
window.loadAssignment = loadAssignment;
window.handleUpdateAnswer = handleUpdateAnswer;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.goToQuestion = goToQuestion;
window.submitAssignment = submitAssignment;
window.handleRetakeAssignment = handleRetakeAssignment;
window.displayReview = displayReview;
window.goBackToDashboard = goBackToDashboard;
window.displayResults = displayResults;
