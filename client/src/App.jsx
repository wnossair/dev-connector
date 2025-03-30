import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ContainerLayout from "./components/layout/ContainerLayout";

import "./App.css";

const App = () => (
  <Provider store={store}>
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<ContainerLayout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  </Provider>
);

export default App;
