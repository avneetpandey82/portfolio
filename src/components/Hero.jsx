import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { styles } from '../styles';
import { avneet, bwmap, worldmap } from '../assets';
import { getSystemInfo } from '../utils/systemInfo';
import { addEntry } from '../utils/firebaseService';

const Hero = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  
  const texts = ["Avneet", "Techie Avneet, lets build future"];
  const description = "A skilled full-stack developer with strong expertise in React, Next.js, cloud technologies, and AI-powered web applications.";
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const TYPING_SPEED = 20;    // Typing speed per character
    const DELETING_SPEED = 20;   // Deleting speed per character
    const PAUSE_BEFORE_DELETE = 50; // Pause before deleting
    const PAUSE_AFTER_DELETE = 50;   // Pause before starting next typing

    let intervalId;
    let timeoutId;

    const startTyping = () => {
      intervalId = setInterval(() => {
        const currentFullText = texts[textIndex];

        if (!isDeleting && charIndex < currentFullText.length) {
          // Typing
          setCurrentText(currentFullText.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else if (!isDeleting && charIndex === currentFullText.length) {
          // Finished typing, pause
          clearInterval(intervalId);
          if (textIndex === 0) {
            timeoutId = setTimeout(() => {
              setIsDeleting(true);
              startTyping();
            }, PAUSE_BEFORE_DELETE);
          } else {
            // Show description after second text
            setTimeout(() => setShowDescription(true), 300);
          }
        } else if (isDeleting && charIndex > 0) {
          // Deleting
          setCurrentText(currentFullText.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        } else if (isDeleting && charIndex === 0) {
          // Switch to next text
          clearInterval(intervalId);
          setIsDeleting(false);
          setTextIndex(1);
          timeoutId = setTimeout(startTyping, PAUSE_AFTER_DELETE);
        }
      }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    };

    startTyping();

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [charIndex, isDeleting, textIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquiry = () => {
    // TODO: Implement enquiry functionality
    console.log('Enquiry submitted:', formData);
  };

  const handleHire = () => {
    // TODO: Implement hire me functionality
    console.log('Hire me clicked');
  };

  useEffect(() => {
    const logVisit = async () => {
      try {
        const systemInfo = getSystemInfo();
        await addEntry({
          type: 'visit',
          ...systemInfo
        });
      } catch (error) {
        console.error('Error logging visit:', error);
      }
    };

    logVisit();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 z-0 h-[100vh] w-full ">
        <img
          src={bwmap}
          alt="world map"
          className="w-full h-full sm:block hidden object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 z-0 h-[100vh] ">
        <img
          src={worldmap}
          alt="world map"
          className="w-full h-full sm:hidden block object-cover"
        />
      </div>
      <section
        className="relative flex sm:flex-row flex-col w-full h-screen mx-auto 
        sm:bg-hero bg-hero-mobile bg-top bg-cover bg-no-repeat overflow-hidden">
        <div
          className={`absolute inset-0 sm:top-[200px] top-[150px]  
          ${styles.paddingX} max-w-7xl mx-auto flex flex-row items-start
          justify-start gap-3`}>
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl  sm:text-5xl md:text-6xl font-mova font-bold text-eerieBlack mb-5 tracking-tight"
            >
              <span className="text-[#915EFF] bg-gradient-to-r from-[#915EFF] to-[#7c4dff] bg-clip-text text-transparent">I'm </span>
              <span className="text-eerieBlack">
                {currentText}
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-1 h-8 bg-gradient-to-b from-[#915EFF] to-[#7c4dff] ml-1"
              />
            </motion.div>

            <AnimatePresence>
              {showDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1,
                    ease: "easeOut"
                  }}
                  className="mt-15 text-lg sm:text-xl md:text-2xl text-eerieBlack/90 max-w-xl leading-relaxed
                    font-light tracking-wide backdrop-blur-sm bg-black/5 p-5 rounded-lg
                    border border-[#915EFF]/10 shadow-lg"
                >
                  <span className="bg-gradient-to-r from-[#915EFF] to-[#7c4dff] bg-clip-text text-transparent font-medium">
                    {description.split(' ').slice(0, 2).join(' ')}
                  </span>
                  {' '}
                  {description.split(' ').slice(2).join(' ')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className="absolute xs:bottom-10 bottom-32 w-full 
          flex justify-center items-center">
          <a href="#about">
            <div
              className="w-[35px] h-[64px] rounded-3xl border-4 
            border-french border-dim flex
            justify-center items-start p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="w-3 h-3 rounded-full bg-taupe mb-1"
              />
            </div>
          </a>
        </div>

        <div>
          <img
            className="absolute bottom-0 ml-[45vw] 
            lg:ml-[70vw] md:ml-[70vw] xmd:ml-[70vw] 2xl:ml-[83vw]
            sm:h-[90vh] md:h-[70vh] xl:h-[80vh]"
            src={avneet}
            alt="avneet"
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
