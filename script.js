let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Função para obter posição do evento (mouse ou toque)
    const getEventPosition = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const onMove = (e) => {
      const { x, y } = getEventPosition(e);

      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Eventos de movimento
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove);

    const onStart = (e) => {
      const { x, y } = getEventPosition(e);
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.type === "mousedown" || (e.type === "touchstart" && e.touches.length === 1)) {
        this.mouseTouchX = x;
        this.mouseTouchY = y;
        this.prevMouseX = x;
        this.prevMouseY = y;
      }

      if (e.button === 2 || (e.type === "touchstart" && e.touches.length > 1)) {
        this.rotating = true;
      }
    };

    const onEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Eventos de início
    paper.addEventListener("mousedown", onStart);
    paper.addEventListener("touchstart", onStart);

    // Eventos de término
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Função para verificar condições
function check() {
  const checkboxes = document.forms[0].elements;
  if (
    checkboxes[0].checked === true &&
    checkboxes[1].checked === true &&
    checkboxes[2].checked === true
  ) {
    if (!$(".wrapper").hasClass("throb")) {
      $(".wrapper").addClass("throb");
    }
  } else {
    if ($(".wrapper").hasClass("throb")) {
      $(".wrapper").removeClass("throb");
    }
  }
}
