import Swiper from "swiper";
import "swiper/css/bundle";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";

// core version + navigation, pagination modules:

// init Swiper:
const swiper = new Swiper(".swiper", {
  // configure Swiper to use modules
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
  spaceBetween: 0,
  modules: [Navigation, Pagination, Scrollbar],
});
