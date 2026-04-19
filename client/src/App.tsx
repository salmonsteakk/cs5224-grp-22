import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import { AuthProvider } from "./context/auth-context";
import { ProgressProvider } from "./context/progress-context";
import { ChatbotProvider, useChatbot } from "./context/chatbot-context";
import { Button } from "./components/ui/button";
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
import ChatbotSidebar from "./components/ChatbotSidebar";
import { isAssistantRoute } from "./lib/chat-assistant-routes";

function AppRoutes() {
  const { pathname } = useLocation();
  const showAssistant = isAssistantRoute(pathname);
  const { isSidebarOpen, toggleSidebar } = useChatbot();

  return (
    <div className="min-h-screen flex items-start">
      <div className="min-w-0 flex-1">
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
      </div>
      {showAssistant && <ChatbotSidebar />}
      {showAssistant && !isSidebarOpen && (
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={toggleSidebar}
          title="Open AI study assistant"
          aria-label="Open AI study assistant"
        >
          <Bot className="h-5 w-5 mr-2" />
          Study Assistant
        </Button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <ChatbotProvider>
            <AppRoutes />
          </ChatbotProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
