import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Create = lazy(() => import("./pages/Create"));
const Edit = lazy(() => import("./pages/Edit"));
const Brandkit = lazy(() => import("./pages/Brandkit"));

const AppLoader = () => (
  <div className="flex min-h-[calc(100vh-var(--navbar-h))] w-full items-center justify-center text-sm text-[#4b5563]">
    Loading...
  </div>
);

function App() {
  return (
    <div className="min-h-screen w-screen">
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<AppLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:url" element={<Edit />} />
            <Route path="/:url" element={<Brandkit />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
