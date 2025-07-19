// import React from "react";
// import Home from "./component/Home";

// function App() {
//     return(
//         <div>
//             <Home/>
//         </div>
//     )
// }

// export default App

import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import DownloadPage from "./component/GlobalDownload";
import Home from "./component/Home"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download/:linkId" element={<DownloadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
