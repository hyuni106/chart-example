import { Route, Routes, Link } from "react-router-dom";

import Circle from "components/Circle";

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/circle">Circle Progress</Link>
        <Link to="/line">Line Chart</Link>
      </nav>
      <Routes>
        <Route path="/circle" element={<Circle />} />
      </Routes>
    </div>
  );
}

export default App;
