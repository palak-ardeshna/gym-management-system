import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import MemberList from './pages/members';
import Attendance from './pages/attendance';
import Subscriptions from './pages/subscriptions';
import Plans from './pages/plans';
import Layout from './layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        
        <Route 
          path="/members" 
          element={<ProtectedRoute><MemberList /></ProtectedRoute>} 
        />
        
        <Route 
          path="/attendance" 
          element={<ProtectedRoute><Attendance /></ProtectedRoute>} 
        />
        
        <Route 
          path="/subscriptions" 
          element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} 
        />

        <Route 
          path="/plans" 
          element={<ProtectedRoute><Plans /></ProtectedRoute>} 
        />

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
