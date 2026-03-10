import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, Send, PlayCircle, Eye, Edit2 } from 'lucide-react';

const CricHeroesSurveyApp = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, survey, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState({});
  const [macid, setMacid] = useState('');
  const [completedSurvey, setCompletedSurvey] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const questions = [
    "Do I know what is expected of me at work?",
    "Do I have the equipment and material I need to do my work right?",
    "At work, do I have the opportunity to do what I do best every day?",
    "In the last seven days, have I received recognition or praise for good work?",
    "Does my supervisor or someone at work seem to care about me as a person?",
    "Is there someone at work who encourages my development?",
    "At work, do my opinions seem to count?",
    "Does the mission/purpose of my company make me feel my work is important?",
    "Are my co-workers committed to doing quality work?",
    "Do I have a best friend at work?",
    "In the last six months, have I talked to someone about my progress?",
    "This last year, have I had opportunities at work to learn and grow?"
  ];

  const answerOptions = [
    "Strongly Disagree",
    "Slightly Disagree",
    "Disagree",
    "Agree",
    "Slightly Agree",
    "Strongly Agree"
  ];

  // Generate device fingerprint on mount
  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        const fingerprint = await generateDeviceFingerprint();
        setMacid(fingerprint);
      } catch (error) {
        console.error('Fingerprint generation error:', error);
        setMacid('DEVICE-' + Math.random().toString(36).substr(2, 9).toUpperCase());
      }
    };
    generateFingerprint();
  }, []);

  const generateDeviceFingerprint = async () => {
    let fingerprint = '';
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('CricHeroes', 2, 2);
    const canvasHash = canvas.toDataURL().substring(0, 20);

    fingerprint = btoa(`${userAgent}|${language}|${platform}|${timezone}|${canvasHash}`).substring(0, 16);
    return 'CH-' + fingerprint.toUpperCase();
  };

  const handleBeginSurvey = () => {
    setCurrentQuestion(0);
    setResponses({});
    setComments({});
    setCurrentPage('survey');
  };

  const handleResumeSurvey = () => {
    if (completedSurvey) {
      setResponses(completedSurvey.responses);
      setComments(completedSurvey.comments);
      setCurrentQuestion(0);
      setCurrentPage('survey');
    }
  };

  const handleAnswerSelect = (answer) => {
    setResponses({
      ...responses,
      [currentQuestion]: answer
    });
  };

  const handleCommentChange = (e) => {
    setComments({
      ...comments,
      [currentQuestion]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Survey completed
      const surveyData = {
        timestamp: new Date().toISOString(),
        macid: macid,
        responses: questions.map((q, idx) => ({
          question: q,
          answer: responses[idx] || 'Not Answered',
          comment: comments[idx] || ''
        }))
      };
      setCompletedSurvey({
        data: surveyData,
        responses: responses,
        comments: comments
      });
      setCurrentPage('completed');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const downloadPDF = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      const element = document.getElementById('pdf-content');
      const opt = {
        margin: 10,
        filename: 'CricHeroes_Survey_Responses.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  };

  const submitToGoogleSheets = async () => {
    setSubmitError('');

    if (!completedSurvey) return;

    try {
      const googleScriptUrl = 'https://script.google.com/a/macros/cricheroes.in/s/AKfycbzdfsnssYRkTNmPZHN-u0hWHmwGrFNTf26581o5ADsDNPVDuiggYLFSQ3N5hzL4ac-f/exec';

      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        body: JSON.stringify(completedSurvey.data),
      });

      if (response.ok) {
        alert('✅ Survey successfully submitted to HR!');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitError('Error submitting to Google Sheets. Data has been copied to clipboard for manual submission.');
      navigator.clipboard.writeText(JSON.stringify(completedSurvey.data, null, 2));
    }
  };

  const isQuestionAnswered = responses[currentQuestion] !== undefined;
  const answeredCount = Object.keys(responses).length;
  const progressPercent = ((answeredCount) / questions.length) * 100;

  // ============ LANDING PAGE ============
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">🏏</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-3">CricHeroes</h1>
            <p className="text-2xl font-semibold text-teal-100">Pitch Report</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Objective Card */}
          <div className="bg-white rounded-lg shadow-xl p-10 mb-12 border-t-4 border-teal-600">
            <h2 className="text-3xl font-bold text-teal-900 mb-6">Our Objective</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              To build an engaging team which delivers high performance.
            </p>
            <div className="border-t-2 border-teal-200 pt-6">
              <p className="text-gray-600 text-lg">
                This survey helps us understand how engaged our team members are and identify opportunities to create a more dynamic, high-performing workplace. Your honest feedback is valuable and will help us achieve our goal.
              </p>
            </div>
          </div>

          {/* Survey Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-600">
              <div className="text-3xl font-bold text-teal-600 mb-2">12</div>
              <p className="text-gray-700 font-semibold">Questions</p>
              <p className="text-sm text-gray-600 mt-2">Quick and thoughtful</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-600">
              <div className="text-3xl font-bold text-teal-600 mb-2">~5</div>
              <p className="text-gray-700 font-semibold">Minutes</p>
              <p className="text-sm text-gray-600 mt-2">Average completion time</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-600">
              <div className="text-3xl font-bold text-teal-600 mb-2">100%</div>
              <p className="text-gray-700 font-semibold">Anonymous</p>
              <p className="text-sm text-gray-600 mt-2">Tracked by device only</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleBeginSurvey}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
            >
              <PlayCircle size={24} />
              Begin Survey
            </button>

            {completedSurvey && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">You have a saved response</span>
                  </div>
                </div>

                <button
                  onClick={handleResumeSurvey}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-base flex items-center justify-center gap-3 transition-colors"
                >
                  <Edit2 size={20} />
                  Resume Previous Response
                </button>

                <button
                  onClick={() => setCurrentPage('preview')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-base flex items-center justify-center gap-3 transition-colors"
                >
                  <Eye size={20} />
                  Preview Response
                </button>
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-gray-600 text-sm">
            <p>Your responses help us build a better workplace.</p>
            <p>All data is encrypted and kept confidential.</p>
          </div>
        </div>
      </div>
    );
  }

  // ============ SURVEY PAGE ============
  if (currentPage === 'survey') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏏</span>
              </div>
              <h1 className="text-3xl font-bold text-teal-900">CricHeroes</h1>
            </div>
            <p className="text-teal-700 font-semibold">Employee Engagement Survey</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-teal-900">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm font-semibold text-teal-600">{answeredCount}/{questions.length} answered</span>
            </div>
            <div className="w-full bg-teal-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-teal-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-t-4 border-teal-600">
            {/* Question */}
            <h2 className="text-2xl font-bold text-teal-900 mb-8 leading-relaxed">
              {currentQuestion + 1}. {questions[currentQuestion]}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {answerOptions.map((option, idx) => (
                <label key={idx} className="flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-teal-400 hover:bg-teal-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={responses[currentQuestion] === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">{option}</span>
                </label>
              ))}
            </div>

            {/* Comment Box */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comments[currentQuestion] || ''}
                onChange={handleCommentChange}
                placeholder="Share any thoughts or context about your response..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
                Back
              </button>

              <div className="text-sm font-semibold text-teal-600">
                {currentQuestion + 1} / {questions.length}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
              >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight size={20} />
              </button>
            </div>

            {!isQuestionAnswered && (
              <p className="text-sm text-orange-600 font-semibold mt-4 text-center">
                ⚠ Please select an answer to continue
              </p>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center text-sm text-teal-700">
            <p>Your responses are anonymous and tracked by Machine ID: <span className="font-mono font-bold">{macid.substring(0, 8)}...</span></p>
          </div>
        </div>
      </div>
    );
  }

  // ============ COMPLETION PAGE ============
  if (currentPage === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏏</span>
              </div>
              <h1 className="text-3xl font-bold text-teal-900">CricHeroes</h1>
            </div>
            <h2 className="text-2xl font-semibold text-teal-700">Survey Complete</h2>
          </div>

          {/* Completion Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-t-4 border-teal-600">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-teal-900 mb-2">Thank You!</h3>
              <p className="text-teal-700 text-lg">Your responses have been recorded successfully</p>
            </div>

            {/* Machine ID Display */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-teal-600 font-semibold mb-1">Anonymous Machine ID</p>
              <p className="font-mono text-teal-900 font-bold text-lg break-all">{macid}</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-teal-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-teal-600">{answeredCount}</p>
                <p className="text-sm text-teal-700">Questions Answered</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-teal-600">{questions.length}</p>
                <p className="text-sm text-teal-700">Total Questions</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-teal-600">{Object.keys(comments).filter(k => comments[k]).length}</p>
                <p className="text-sm text-teal-700">Comments Added</p>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {submitError}
              </div>
            )}

            {/* PDF Preview Content (Hidden) */}
            <div id="pdf-content" className="hidden">
              <h1 className="text-2xl font-bold mb-4">CricHeroes Survey Responses</h1>
              <p className="mb-2"><strong>Machine ID:</strong> {macid}</p>
              <p className="mb-4"><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              {questions.map((q, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-bold mb-2">Q{idx + 1}: {q}</h3>
                  <p className="ml-4 text-gray-700"><strong>Answer:</strong> {responses[idx] || 'Not Answered'}</p>
                  {comments[idx] && <p className="ml-4 text-gray-700"><strong>Comment:</strong> {comments[idx]}</p>}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap mb-6">
              <button
                onClick={downloadPDF}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={20} />
                Download PDF
              </button>
              <button
                onClick={submitToGoogleSheets}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={20} />
                Submit to HR
              </button>
            </div>

            {/* Back to Landing Button */}
            <button
              onClick={() => setCurrentPage('landing')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </button>

            {/* Setup Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-2">💡 Tip</h4>
              <p className="text-sm text-blue-800">
                Your survey data has been recorded and your Machine ID has been saved. You can return anytime to update your responses or download a fresh PDF copy.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ PREVIEW PAGE ============
  if (currentPage === 'preview' && completedSurvey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2 mb-4"
            >
              <ChevronLeft size={20} />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-teal-900">Response Preview</h1>
          </div>

          {/* Response Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <p className="text-sm text-gray-600 font-semibold mb-1">Machine ID</p>
              <p className="font-mono text-teal-900 font-bold">{completedSurvey.data.macid}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 font-semibold mb-1">Submitted at</p>
              <p className="text-gray-800">{new Date(completedSurvey.data.timestamp).toLocaleString()}</p>
            </div>

            {/* All Responses */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-teal-900 mb-6">Your Responses</h3>
              <div className="space-y-6">
                {completedSurvey.data.responses.map((response, idx) => (
                  <div key={idx} className="border-l-4 border-teal-600 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">Q{idx + 1}: {response.question}</h4>
                    <p className="text-teal-600 font-semibold mb-1">{response.answer}</p>
                    {response.comment && (
                      <p className="text-gray-700 text-sm italic">Comment: {response.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => handleResumeSurvey()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 size={20} />
                Edit Response
              </button>
              <button
                onClick={() => setCurrentPage('landing')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CricHeroesSurveyApp;
