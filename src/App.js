import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import TextEditor from './Pages/Editor';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/editor" element={<TextEditor /> } /> {/* Default route */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
