export const initDraggable = () => {
  const items = document.querySelectorAll(".draggable-item");
  let maxZIndex = 10;

  items.forEach((item) => {
    const htmlItem = item as HTMLElement;
    let isDragging = false;
    let startX = 0,
      startY = 0;
    let currentX = 0,
      currentY = 0;

    let baseLeft = 0,
      baseTop = 0,
      baseRight = 0,
      baseBottom = 0;

    htmlItem.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;

      isDragging = true;

      const rect = htmlItem.getBoundingClientRect();
      baseLeft = rect.left - currentX;
      baseTop = rect.top - currentY;
      baseRight = rect.right - currentX;
      baseBottom = rect.bottom - currentY;

      startX = e.clientX - currentX;
      startY = e.clientY - currentY;

      maxZIndex++;
      htmlItem.style.zIndex = maxZIndex.toString();

      htmlItem.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    htmlItem.addEventListener("pointermove", (e) => {
      if (!isDragging) return;

      const targetX = e.clientX - startX;
      const targetY = e.clientY - startY;

      // Allow being partially off-screen
      const offset = 200;

      const minX = -baseLeft - offset;
      const maxX = window.innerWidth - baseRight + offset;
      const minY = -baseTop - offset;
      const maxY = window.innerHeight - baseBottom + offset;

      currentX = Math.max(minX, Math.min(maxX, targetX));
      currentY = Math.max(minY, Math.min(maxY, targetY));

      htmlItem.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    htmlItem.addEventListener("pointerup", (e) => {
      isDragging = false;
      htmlItem.releasePointerCapture(e.pointerId);
    });

    htmlItem.addEventListener("pointercancel", (e) => {
      isDragging = false;
      htmlItem.releasePointerCapture(e.pointerId);
    });
  });
};

// Initial run
initDraggable();

// Astro transitions support
document.addEventListener("astro:page-load", initDraggable);
