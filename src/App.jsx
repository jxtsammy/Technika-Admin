import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Importing your components and screens
import Login from './components/Login/Login';
import Admin from './components/Sidebar/Sidebar'

function App() {
  return (
    <Router>
      <Routes>
        {/* HOME PAGE: The "Stacked" One-Page Layout */}
        <Route
          path="/"
          element={
            <main>
                <Login />
            </main>
          }
        />
        <Route
          path="/admin"
          element={
                <Admin />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;