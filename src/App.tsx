import Navbar from "./components/Navbar";
import Create from "./pages/Create";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Brandkit from "./pages/Brandkit";

function App() {
  return (
    <div className="min-h-screen w-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/brandkit/:brandkitId" element={<Brandkit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
