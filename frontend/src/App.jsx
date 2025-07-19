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

import { Routes, Route } from "react-router-dom";
import DownloadPage from "./component/GlobalDownload";
import Home from "./component/Home"; 

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download/:linkId" element={<DownloadPage />} />
      </Routes>
    
  );
}

export default App;
