import React, { useEffect, useRef } from "react";

const sendMessageToDev = () => {
  console.log(
    "Sending message to developer: Performance issues detected more than 5 times today."
  );
};

const checkPerformance = (counterRef) => {
  if (Math.random() < 0.5) {
    counterRef.current++;
    if (counterRef.current > 5) {
      sendMessageToDev();
    }
  }
};

const detectLag = (lagCounterRef) => {
  let lastTime = performance.now();

  const checkLag = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    if (deltaTime > 1000) {
      // Se passou mais de 1 segundo entre os frames, pode indicar travamento
      const confirmReload = window.confirm(
        "A tela pode estar travando. Deseja reiniciar?"
      );
      if (confirmReload) {
        window.location.reload();
      }
      lagCounterRef.current++;
      console.log(
        `Possível travamento detectado! Contagem: ${lagCounterRef.current}`
      );
    }

    lastTime = currentTime;
    requestAnimationFrame(checkLag);
  };

  requestAnimationFrame(checkLag);
};

const ReloadAutomatic = () => {
  const performanceCounter = useRef(0);
  const lagCounter = useRef(0);

  useEffect(() => {
    const performanceCheckInterval = setInterval(
      () => checkPerformance(performanceCounter),
      10000
    );

    const resetInterval = setInterval(() => {
      performanceCounter.current = 0;
      lagCounter.current = 0;
    }, 43200000);

    detectLag(lagCounter); // Chama a verificação de lag corretamente

    return () => {
      clearInterval(performanceCheckInterval);
      clearInterval(resetInterval);
    };
  }, []);

  return null;
};

export default ReloadAutomatic;
