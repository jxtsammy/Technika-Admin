import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing your components and screens
import Login from './components/Login/Login';
import AdminLayout from './Layout/AdminLayout'; // Import the layout wrapper

function App() {
  return (
    <Router>
      <Routes>
        {/* ADMIN DASHBOARD PANELS HUB */}
        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        />

        <Route
          path="/"
          element={
            <Login />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;