import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing your components and screens
import Login from './components/Login/Login';
import AdminLayout from './Layout/AdminLayout'; // Import the layout wrapper
import LandingPage from './components/LandingPage/Hero'
import NavBar from './components/Navigations/HomeNavigation/NavBar';

function App() {
  return (
    <Router>
      <Routes>
        {/* HOME PAGE: Login View */}
        <Route
          path="/"
          element={
            <main>
              <NavBar />
              <LandingPage />
            </main>
          }
        />

        {/* ADMIN DASHBOARD PANELS HUB */}
        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;