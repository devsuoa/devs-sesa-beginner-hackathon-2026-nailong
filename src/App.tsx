import { Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import ApiExample from "./pages/api-example/ApiExample";

// Defines which URL path corresponds to which page component.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/api-example" element={<ApiExample />} />
    </Routes>
  );
}

export default App;
