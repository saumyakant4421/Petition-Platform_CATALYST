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
