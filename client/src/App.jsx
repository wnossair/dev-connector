import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import RequireAuth from "./components/auth/RequireAuth";

import Dashboard from "./components/dashboard/Dashboard";

import ContainerLayout from "./components/layout/ContainerLayout";

import "./App.css";

const App = () => {
  // Component
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<ContainerLayout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />{" "}
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
