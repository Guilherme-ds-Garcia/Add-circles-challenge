import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import './App.scss';

export default function App() {
  const [undoDiff, setUndoDiff] = useState([]);
  const [circles, setCircles] = useState([]);
  const [mousePos, setMousePos] = useState({});

  function removeLast() {
    if (circles.length > 0) {
      setCircles(prev => prev.filter((el) => el.idx !== prev.length - 1))
      setUndoDiff(prev => [...prev, circles.filter((el) => el.idx === circles.length - 1)[0]])
    }
  }

  function restoreElement() {
    if (undoDiff.length > 0) {
      setCircles(prev => [...prev, undoDiff[undoDiff.length - 1]])
      setUndoDiff(prev => prev.slice(0, -1))
    }
  }

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: Math.ceil(event.clientX), y: Math.ceil(event.clientY) });
      const circle = {
        idx: circles.length,
        x: Math.ceil(event.clientX), 
        y: Math.ceil(event.clientY),
      }
      setCircles(prev => [...prev, circle])
    };

    document.getElementById('content').addEventListener('pointerdown', handleMouseMove);

    return () => {
     document.getElementById('content').removeEventListener('pointerdown', handleMouseMove);
    };
  }, [circles]);

  useEffect(() => {
    function handleResize() { // Reset all states to prevent circles to go out of the screen in resizes
      setCircles([])
      setUndoDiff([])
      setMousePos([])
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  return (
    <div className="app" id='app'>
      <div className='navbar'>

        <div className='mousePos'>
          The mouse is at position{' '}
          <b>
            ({mousePos.x}, {mousePos.y})
          </b>
        </div>

        <div className='button-prev-undo'>
          <button onClick={(e) => {e.stopPropagation(); removeLast()}}><AiOutlineArrowLeft/></button>
          <button onClick={(e) => {e.stopPropagation(); restoreElement()}}><AiOutlineArrowRight/></button>
        </div>
        
      </div>

      <div className='content' id='content'>
        {
          circles.map(((circle, idx) => {
            return (
              <div className='circle' key={idx} style={{position: 'absolute', left: circle.x - 25, top: circle.y - 25}}>
                {circle.idx}
              </div>
            )
          }))
        }
      </div>
    </div>
  )
}
