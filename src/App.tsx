import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequestForm from "./components/RequestForm";
import Confirmation from "./components/Confirmation";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequestForm />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
};

export default App;
