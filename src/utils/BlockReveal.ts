import gsap from "gsap";

export interface BlockRevealOptions {
  blockColor?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: string;
}

export class BlockReveal {
  element: HTMLElement;
  options: Required<BlockRevealOptions>;
  linesData: { wrapper: HTMLElement; block: HTMLElement; textNode: HTMLElement }[] = [];

  constructor(element: HTMLElement | string, options: BlockRevealOptions = {}) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) throw new Error("BlockReveal target element not found.");
    
    this.element = el as HTMLElement;
    this.options = {
      blockColor: options.blockColor || this.element.dataset.blockColor || "#000",
      duration: options.duration ?? parseFloat(this.element.dataset.duration || "0.4"),
      delay: options.delay ?? parseFloat(this.element.dataset.delay || "0"),
      stagger: options.stagger ?? parseFloat(this.element.dataset.stagger || "0.08"),
      easing: options.easing || this.element.dataset.easing || "power2.inOut",
    };

    // Store original text on first run to allow clean re-initialization
    // Use textContent instead of innerText because innerText could be empty if the element is CSS hidden!
    if (!this.element.dataset.originalText) {
      this.element.dataset.originalText = this.element.textContent?.trim() || "";
    }
    
    this.init();
  }

  init() {
    // 1. Text Splitting (Resilient to Re-init)
    const text = this.element.dataset.originalText || "";
    this.element.innerHTML = "";
    this.linesData = [];
    
    if (!text) return;
    
    // Wrap words to measure line breaks dynamically
    const words = text.split(/\s+/);
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.textContent = word;
      this.element.appendChild(span);
      
      if (index < words.length - 1) {
        this.element.appendChild(document.createTextNode(" "));
      }
    });
    
    // Group words into lines using offsetTop
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentTop: number | null = null;
    
    Array.from(this.element.children).forEach(span => {
      if (span.tagName === "SPAN") {
        const top = (span as HTMLElement).offsetTop;
        if (currentTop === null || top === currentTop) {
          currentLine.push(span.textContent || "");
        } else {
          lines.push(currentLine);
          currentLine = [span.textContent || ""];
        }
        currentTop = top;
      }
    });
    if (currentLine.length > 0) lines.push(currentLine);
    
    this.element.innerHTML = "";
    this.element.style.visibility = "visible";
    
    // 2. Wrapper Structure
    lines.forEach((lineWords, index) => {
      const lineText = lineWords.join(" ");
      
      const wrapper = document.createElement("span");
      wrapper.className = "block-reveal-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      // Añadir padding lateral y vertical para evitar que se corten letras (itálicas o descenders)
      wrapper.style.padding = "0.05em 0.1em";
      wrapper.style.margin = "-0.05em -0.1em";
      wrapper.style.verticalAlign = "middle";
      
      const block = document.createElement("span");
      block.className = "block-reveal-mask";
      block.style.position = "absolute";
      block.style.top = "0";
      block.style.left = "0";
      block.style.width = "100%";
      block.style.height = "100%";
      block.style.backgroundColor = this.options.blockColor;
      
      // 3. Initial State
      block.style.transformOrigin = "left";
      block.style.transform = "scaleX(0)";
      block.style.zIndex = "10";
      
      const textNode = document.createElement("span");
      textNode.className = "block-reveal-text";
      textNode.style.opacity = "0";
      textNode.style.display = "inline-block";
      textNode.textContent = lineText;
      
      wrapper.appendChild(block);
      wrapper.appendChild(textNode);
      this.element.appendChild(wrapper);
      
      if (index < lines.length - 1) {
        this.element.appendChild(document.createElement("br"));
      }
      
      this.linesData.push({ wrapper, block, textNode });
    });
    
    this.animate();
  }

  animate() {
    // 4. Animation Timeline
    const tl = gsap.timeline({ 
      delay: this.options.delay,
      onComplete: () => {
        this.element.classList.add("reveal-complete");
        // Remove overflow: hidden to allow letters to bleed/overlap after reveal
        this.linesData.forEach(line => {
          line.wrapper.style.overflow = "visible";
          line.block.style.display = "none";
        });
      }
    });
    
    this.linesData.forEach((line, index) => {
      const lineTl = gsap.timeline();
      
      // Expand (Reveal Mask) left-to-right
      lineTl.to(line.block, {
        scaleX: 1,
        duration: this.options.duration,
        ease: this.options.easing,
      });
      
      // Reveal Text behind the mask
      lineTl.set(line.textNode, { opacity: 1 });
      
      // Retract (Uncover Text) sliding out to the right
      lineTl.set(line.block, { transformOrigin: "right" });
      lineTl.to(line.block, {
        scaleX: 0,
        duration: this.options.duration,
        ease: this.options.easing,
      });
      
      // 5. Staggered timing
      tl.add(lineTl, index * this.options.stagger);
    });
  }
}
