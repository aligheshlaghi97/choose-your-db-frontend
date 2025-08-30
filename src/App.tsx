import { useState, useEffect } from 'react'
import { Question, Answer, RecommendationResponse } from './types'
import { buildApiUrl, config } from './config'

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl(config.ENDPOINTS.QUESTIONS))
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      const data = await response.json()
      
      // Transform the API response to match the expected Question[] structure
      const transformedQuestions: Question[] = Object.keys(data.questions).map(key => ({
        id: key,
        text: data.questions[key],
        choices: data.answer_choices[key] || []
      }))
      
      setQuestions(transformedQuestions)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (choice: string, isSelected: boolean) => {
    const currentQuestion = questions[currentQuestionIndex]
    const existingAnswerIndex = answers.findIndex(
      answer => answer.questionId === currentQuestion.id
    )

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...answers]
      const currentChoices = updatedAnswers[existingAnswerIndex].selectedChoices || []
      
      if (isSelected) {
        // Add choice if not already selected
        if (!currentChoices.includes(choice)) {
          updatedAnswers[existingAnswerIndex] = {
            questionId: currentQuestion.id,
            selectedChoices: [...currentChoices, choice]
          }
        }
      } else {
        // Remove choice if selected
        const filteredChoices = currentChoices.filter(c => c !== choice)
        updatedAnswers[existingAnswerIndex] = {
          questionId: currentQuestion.id,
          selectedChoices: filteredChoices
        }
      }
      
      setAnswers(updatedAnswers)
    } else {
      // Add new answer with single choice
      if (isSelected) {
        setAnswers([...answers, {
          questionId: currentQuestion.id,
          selectedChoices: [choice]
        }])
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      
      // Transform answers to match the expected API format
      const transformedAnswers: { [key: string]: string[] } = {}
      answers.forEach(answer => {
        transformedAnswers[answer.questionId] = answer.selectedChoices
      })
      
      const requestBody = {
        name: "Database Recommendation Request",
        answers: transformedAnswers
      }
      
      const response = await fetch(buildApiUrl(config.ENDPOINTS.RECOMMEND), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Failed to submit answers')
      }

      const data: RecommendationResponse = await response.json()
      setRecommendation(data)
    } catch (error) {
      console.error('Error submitting answers:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getCurrentAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex]
    return answers.find(answer => answer.questionId === currentQuestion?.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No questions available</div>
      </div>
    )
  }

  if (recommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Your Database Recommendations</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Query Summary</h2>
            <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {recommendation.query_summary}
            </div>
          </div>

          <div className="space-y-4">
            {recommendation.recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-blue-600">{rec.name}</h3>
                  <span className="text-sm text-gray-500">
                    Score: {(rec.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-gray-700">{rec.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = getCurrentAnswer()
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentQuestion.text}
          </h1>
        </div>

        <div className="mb-8">
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={`question-${currentQuestion.id}`}
                  value={choice}
                  checked={currentAnswer?.selectedChoices?.includes(choice) || false}
                  onChange={(e) => handleAnswerSelect(choice, e.target.checked)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{choice}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className={`px-6 py-2 rounded-lg font-medium ${
              isFirstQuestion
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !currentAnswer?.selectedChoices?.length}
              className={`px-6 py-2 rounded-lg font-medium ${
                submitting || !currentAnswer?.selectedChoices?.length
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentAnswer?.selectedChoices?.length}
              className={`px-6 py-2 rounded-lg font-medium ${
                !currentAnswer?.selectedChoices?.length
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
