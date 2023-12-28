// import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import CreateForm from './pages/create_form';
import SeeForm from './pages/see_form';
import Login from './pages/login';
import SubmitForm from './pages/submit_form'
import Response from './pages/response';
import CreateForm2 from './pages/create_form2';
import Navbar from './pages/navbar';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/"  element={<Login />} />

        <Route path="/sungroupform" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SeeForm" element={<Navbar><SeeForm /></Navbar>} />
        <Route path="/CreateForm/:id/:depart" element={<Navbar><CreateForm /></Navbar>} />
        {/* <Route path="/CreateForm/:id/:depart" element={<CreateForm />} /> */}

        <Route path="/CreateForm2/:id/:depart" element={<Navbar><CreateForm2 /></Navbar>} />

        <Route path="/SubmitForm/:id/:depart" element={<SubmitForm />} />
        <Route path='/Response/:id/:depart' element={<Response />} />
      </Routes>
    </Router>
  );
}

export default App;




// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
