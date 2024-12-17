import { quizData } from './questions.js';

class Quiz 
{
    constructor(questions) 
    {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.loadQuestion();
    }

    // Load the current question and options
    loadQuestion = () => 
    {
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');
        const nextButton = document.getElementById('next-button');

        // Destructure the current question object
        const { question, options } = this.questions[this.currentQuestionIndex];

        // Render the question and options using template literals
        questionContainer.innerHTML = `<h2>${question}</h2>`;
        optionsContainer.innerHTML = options.map(option => 
            `<button class="options">${option}</button>`
        ).join('');

        // Disable the next button initially
        nextButton.disabled = true;

        // Add event listeners to option buttons
        document.querySelectorAll('.options').forEach((button, index) => 
        {
            button.addEventListener('click', () => this.handleAnswerClick(options[index], button));
        });

        // Update the progress bar
        this.updateProgressBar();
    }

    // Handle option click and validate the answer
    handleAnswerClick = (selectedOption, selectedButton) => 
    {
        const { answer } = this.questions[this.currentQuestionIndex];
        const nextButton = document.getElementById('next-button');

        // Enable the "Next" button after an option is selected
        nextButton.disabled = false;

        // Disable all option buttons to prevent further clicks
        document.querySelectorAll('.options').forEach(btn => 
        {
            btn.disabled = true;
        });

        // If the selected option is correct, highlight it in green and increment the score
        if (selectedOption === answer) 
        {
            selectedButton.style.backgroundColor = 'lightgreen'; // Correct option
            this.score++; // **Increment the score here when the correct answer is selected**
        } 
        else 
        {
            // If the selected option is incorrect, highlight it in red and show the correct one in green
            selectedButton.style.backgroundColor = 'lightcoral'; // Incorrect option

            // Find and highlight the correct option in green
            document.querySelectorAll('.options').forEach(btn => 
            {
                if (btn.textContent === answer) 
                {
                    btn.style.backgroundColor = 'lightgreen'; // Correct answer
                }
            });
        }
    }

    // Proceed to the next question or show results
    nextQuestion = () => 
    {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) 
        {
            this.loadQuestion();
        } 
        else 
        {
            this.showResult();
        }
    }

    // Show the final result
    showResult = () => 
    {
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');
        const resultContainer = document.getElementById('result');
        const nextButton = document.getElementById('next-button');
        
        // Hide current content
        questionContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        nextButton.classList.add('hidden'); // Hide the next button

        // Show the final score
        resultContainer.innerHTML = `Your score: ${this.score} out of ${this.questions.length}`;
        resultContainer.classList.remove('hidden');

        // Create and show the reset button
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-button';
        resetButton.textContent = 'Reset Quiz';
        resetButton.addEventListener('click', this.resetQuiz);
        resultContainer.appendChild(resetButton);

        // Save the score in localStorage
        localStorage.setItem('score', this.score);
    }

    // Reset the quiz
    resetQuiz = () => 
    {
        this.currentQuestionIndex = 0;
        this.score = 0;

        // Clear result and reset the UI
        const resultContainer = document.getElementById('result');
        resultContainer.classList.add('hidden');
        resultContainer.innerHTML = ''; // Clear result content

        // Show the next button again
        const nextButton = document.getElementById('next-button');
        nextButton.classList.remove('hidden');

        // Load the first question again
        this.loadQuestion();
    }

    // Update the progress bar
    updateProgressBar = () => 
    {
        const progressBar = document.getElementById('progress-bar');
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// Initialize the quiz
const quiz = new Quiz(quizData);

// Add event listener for the Next Question button
document.getElementById('next-button').addEventListener('click', () => 
{
    quiz.nextQuestion();
});

// Load previous score from localStorage if available
window.onload = () => 
{
    const savedScore = localStorage.getItem('score');
    if (savedScore) {
        alert(`Your previous score was: ${savedScore}`);
    }
};
