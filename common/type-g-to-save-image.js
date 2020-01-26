"use strict";

window.keyTyped = (() => {
  const currentKeyTyped = window.keyTyped;
  const saveCanvasPNG = () => {
    if (key === "g") save("image.png");
  };

  return currentKeyTyped
    ? () => {
        if (currentKeyTyped() === false) return false;
        saveCanvasPNG();
      }
    : saveCanvasPNG;
})();
