import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import News from "./pages/News/News";
import NoPage from "./pages/NoPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<News />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// function App() {<>
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<News />} />
//         <Route path="*" element={<NoPage />} />
//       </Route>
//     </Routes>
//   </BrowserRouter>
// </>;
// }

// export default App;
