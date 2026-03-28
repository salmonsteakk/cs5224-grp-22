import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { ProgressProvider } from "./context/progress-context";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import SubjectLearnPage from "./pages/SubjectLearnPage";
import TopicLessonPage from "./pages/TopicLessonPage";
import PracticePage from "./pages/PracticePage";
import SubjectPracticePage from "./pages/SubjectPracticePage";
import TopicQuizPage from "./pages/TopicQuizPage";
import ExamsPage from "./pages/ExamsPage";
import ExamPaperPage from "./pages/ExamPaperPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/:subjectId" element={<SubjectLearnPage />} />
              <Route path="/learn/:subjectId/:topicId" element={<TopicLessonPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/practice/:subjectId" element={<SubjectPracticePage />} />
              <Route path="/practice/:subjectId/:topicId" element={<TopicQuizPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/exams/paper/:paperId" element={<ExamPaperPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
