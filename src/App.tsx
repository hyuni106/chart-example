import { Route, Routes, Link } from "react-router-dom";

import Circle from "components/Circle";
import Line from "components/Line";

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/circle">Circle Progress</Link>
        <Link to="/line">Line Chart</Link>
      </nav>
      <Routes>
        <Route path="/circle" element={<Circle />} />
        <Route path="/line" element={<Line />} />
      </Routes>
    </div>
  );
}

export default App;
