import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InstructionScreen } from './components/InstructionScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

// Use backend directly for local dev, relative paths for Vercel
const isDev = import.meta.env.DEV;
const API_URL = isDev ? 'http://localhost:8000' : '';
const API_PREFIX = isDev ? '' : '/api';

// Context for shared state
interface AppContextType {
  student: { name: string; rollNo: string; id: string };
  setStudent: (s: { name: string; rollNo: string; id: string }) => void;
  questions: any[];
  setQuestions: (q: any[]) => void;
  subject: string;
  setSubject: (s: string) => void;
  result: any;
  setResult: (r: any) => void;
  lastAnswers: Record<string, string>;
  setLastAnswers: (a: Record<string, string>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
};

// Page Components with navigation
function LoginPage() {
  const { setStudent } = useAppContext();
  const navigate = useNavigate();

  const handleStart = async (name: string, rollNo: string) => {
    try {
      const res = await fetch(`${API_URL}${isDev ? '/auth/login' : '/api/login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roll_no: rollNo }),
      });
      const data = await res.json();
      setStudent({ name, rollNo, id: data.student_id });
      navigate('/instructions');
    } catch (e) {
      console.error(e);
      alert('Login failed. Please check backend.');
    }
  };

  return <WelcomeScreen onStart={handleStart} />;
}

function InstructionsPage() {
  const { student, setQuestions, setSubject } = useAppContext();
  const navigate = useNavigate();

  if (!student.id) {
    return <Navigate to="/login" replace />;
  }

  const startUnifiedQuiz = async () => {
    try {
      const res = await fetch(`${API_URL}${isDev ? '/quiz/unified' : '/api/quiz'}`);
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSubject(data.subject);
        navigate('/quiz');
      } else {
        alert('Failed to load questions.');
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to server.");
    }
  };

  return <InstructionScreen name={student.name} onProceed={startUnifiedQuiz} />;
}

function QuizPage() {
  const { student, questions, subject, setResult, setLastAnswers } = useAppContext();
  const navigate = useNavigate();

  if (!student.id || questions.length === 0) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (answers: Record<string, string>) => {
    try {
      const res = await fetch(`${API_URL}${isDev ? '/quiz/submit' : '/api/submit'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          subject: subject,
          answers: answers
        }),
      });
      const data = await res.json();
      setResult(data);
      setLastAnswers(answers);
      navigate('/result');
    } catch (e) {
      console.error(e);
      alert("Error submitting quiz.");
    }
  };

  return <QuizScreen subject={subject} questions={questions} onSubmit={handleSubmit} />;
}

function ResultPage() {
  const { student, result, setStudent, setQuestions, setResult, subject, lastAnswers } = useAppContext();
  const navigate = useNavigate();

  if (!result) {
    return <Navigate to="/login" replace />;
  }

  const handleRestart = () => {
    setResult(null);
    setQuestions([]);
    setStudent({ name: '', rollNo: '', id: '' });
    navigate('/login');
  };

  const handleReAnalyze = async () => {
    try {
      if (!lastAnswers || Object.keys(lastAnswers).length === 0) {
        alert("No answers found to re-analyze.");
        return;
      }

      const res = await fetch(`${API_URL}${isDev ? '/quiz/submit' : '/api/submit'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          subject: subject,
          answers: lastAnswers
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Error re-analyzing quiz.");
    }
  };

  return <ResultScreen result={result} studentName={student.name} onRestart={handleRestart} onReAnalyze={handleReAnalyze} />;
}

// Main App with Provider
function App() {
  const [student, setStudent] = useState({ name: '', rollNo: '', id: '' });
  const [questions, setQuestions] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [result, setResult] = useState<any>(null);
  const [lastAnswers, setLastAnswers] = useState<Record<string, string>>({});

  return (
    <AppContext.Provider value={{
      student, setStudent,
      questions, setQuestions,
      subject, setSubject,
      result, setResult,
      lastAnswers, setLastAnswers
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
