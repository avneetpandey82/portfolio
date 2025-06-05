import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Tech,
  Projects,
} from './components';
import Education from './components/Education';
import DataView from './components/DataView';

import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />
      <div className="relative z-0">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <div>
                <Hero />
              </div>
              <div className="bg-about bg-cover bg-center bg-no-repeat">
                <About />
              </div>
              <Projects />
              <div className="bg-experience bg-cover bg-center bg-no-repeat rounded-tl-[150px] rounded-br-[150px]">
                <div className="bg-experienceLight bg-cover bg-center bg-no-repeat rounded-tl-[150px] rounded-br-[130px]">
                  <Education />
                </div>
              </div>
              <div className="bg-tech bg-cover bg-center bg-no-repeat pb-10">
                <Tech />
              </div>
              <div className="bg-experience bg-cover bg-center bg-no-repeat rounded-tl-[150px] rounded-br-[150px]">
                <div className="bg-experienceLight bg-cover bg-center bg-no-repeat rounded-tl-[150px] rounded-br-[130px]">
                  <Experience />
                </div>
              </div>
              <div className="relative z-0">
                <Contact />
              </div>
            </>
          } />
          <Route path="/data-view" element={<DataView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
