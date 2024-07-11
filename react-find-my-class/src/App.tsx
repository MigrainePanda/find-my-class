// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import Navbar from "./components/Navigation/Navigation.tsx"
import Footer from "./components/Footer.tsx";

// pages
import HomePage from "./pages/HomePage/HomePage.tsx";
import CoursesPage from "./pages/CoursesPage/CoursesPage.tsx";
import MapPage from "./pages/MapPage/MapPage.tsx";

import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

/*
const [count, setCount] = useState(0)

<div>
  <a href="https://vitejs.dev" target="_blank">
    <img src={viteLogo} className="logo" alt="Vite logo" />
  </a>
  <a href="https://react.dev" target="_blank">
    <img src={reactLogo} className="logo react" alt="React logo" />
  </a>
</div>
<h1>Vite + React</h1>
<div className="card">
  <button onClick={() => setCount((count) => count + 1)}>
    count is {count}
  </button>
  <p>
    Edit <code>src/App.tsx</code> and save to test HMR
  </p>
</div>
<p className="read-the-docs">
  Click on the Vite and React logos to learn more
</p>

*/
