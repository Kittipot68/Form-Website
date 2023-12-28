import React, { useRef, useEffect } from 'react';

function ScrollToLastElement({ selector }) {
  const lastElementRef = useRef(null);

  useEffect(() => {
    const lastElement = lastElementRef.current;
    if (lastElement) {
      lastElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selector]);

  return <div ref={lastElementRef} />;
}

export default ScrollToLastElement;
