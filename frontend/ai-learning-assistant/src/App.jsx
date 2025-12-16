import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentsDetailsPage from "./pages/Documents/DocumentDetailsPage";
import FlashcardsListPage from "./pages/Flashcards/FlashCardListPage";
import FlashcardPage from "./pages/Flashcards/FlashcardPage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";

import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
const App = () => {
  const isAuthenticated = false;
  const loading = false;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentsDetailsPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
