import AccountCarousel from "./home/AccountCarousel.js";
import FeaturePetitions from "./home/FeaturePetitions.js";


AccountCarousel();
FeaturePetitions();


function marquee(selector, speed) {
      const parentSelector = document.querySelector(selector);
      const clone = parentSelector.innerHTML;
      const firstElement = parentSelector.children[0];
      let i = 0;
    
      // Clone the content twice for seamless looping
      parentSelector.insertAdjacentHTML("beforeend", clone);
      parentSelector.insertAdjacentHTML("beforeend", clone);
    
      // Animation function
      function animate() {
        i += speed;
        if (i > firstElement.clientWidth) {
          i = 0; // Reset position when the end is reached
        }
        firstElement.style.marginLeft = `-${i}px`;
        requestAnimationFrame(animate); // Recursively call the next frame
      }
    
      // Start the animation
      requestAnimationFrame(animate);
    }
    
    // Initialize marquee when window loads
    window.addEventListener("load", () => marquee(".marquee", 0.4));