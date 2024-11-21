const carousel = document.querySelector(".account-carousel");
const slides = document.querySelectorAll(".account-slide");
const next = document.querySelectorAll(".form-switch-button");

let currentSlide = 0;


export default function AccountCarousel() {
  next.forEach((next) => {
    next.addEventListener("click", () => {
      SwitchDirection();
      SwitchSlide();
    });
  });
}

function SwitchDirection() {
  if (currentSlide === 0) {
    currentSlide = 1;
    return;
  }

  currentSlide = 0;
}

function SwitchSlide() {
  SlidesAnimation(0);

  setTimeout(() => {
    slides.forEach((slide) => {
      slide.style.transform = `translateX(${
        -carousel.clientWidth * currentSlide
      }px)`;
    });
  }, 400);

  SlidesAnimation(700);
}

function SlidesAnimation(timeoutDuration) {
  setTimeout(() => {
    slides.forEach((slide) => {
      if (slide.classList.contains("register-hide")) {
        slide.classList.remove("register-hide");
        slide.classList.add("register-reveal");
      } else {
        slide.classList.remove("register-reveal");
        slide.classList.add("register-hide");
      }
    });
  }, timeoutDuration);
}

// const carouselSelector = ".account-carousel";
// const slideSelector = ".account-slide";
// const buttonSelector = ".form-switch-button";

// export default function AccountCarousel() {
//   const carousel = document.querySelector(carouselSelector);
//   const slides = document.querySelectorAll(slideSelector);
//   const buttons = document.querySelectorAll(buttonSelector);

//   let currentSlide = 0; // 0 = Login, 1 = Register

//   // Attach click event listeners to switch buttons
//   buttons.forEach((button) => {
//     button.addEventListener("click", () => {
//       toggleSlide();
//     });
//   });

//   function toggleSlide() {
//     currentSlide = currentSlide === 0 ? 1 : 0;
//     updateSlides();
//   }

//   function updateSlides() {
//     slides.forEach((slide, index) => {
//       if (index === currentSlide) {
//         slide.style.transform = `translateX(0)`;
//         slide.classList.remove("register-hide");
//         slide.classList.add("register-reveal");
//       } else {
//         slide.style.transform = `translateX(-100%)`;
//         slide.classList.remove("register-reveal");
//         slide.classList.add("register-hide");
//       }
//     });
//   }
// }

// // Initialize Account Carousel on DOMContentLoaded
// document.addEventListener("DOMContentLoaded", AccountCarousel);