// Seperation of concerns:
// this JS is purely for non functional enhancements, such as animation of DOM elements

// grabbing DOM Elements that will be styled or that help calculate stuff
const intro = document.getElementById("intro");
const mars = document.getElementById("mars-graphic");
const scrollInstructions = document.getElementById("hero").getElementsByClassName("instructions")[0];

// initial values - these will be different each time depending on device
const onePercent = intro.getBoundingClientRect().top * 0.01;

// landing on Mars -> zooming on svg depending on scrolling down to first text section #intro
const zoomScroll = () => {
	const maxSidepadding = 0.5; // vw => 1 = 100%
	let sidepadding = maxSidepadding * ( intro.getBoundingClientRect().top / onePercent );
  let padding = "0px " + sidepadding + "vw";
  mars.style.padding = padding;
  scrollInstructions.style.opacity = (( Math.floor( intro.getBoundingClientRect().top ) / ( onePercent * 0.5 ) ) / 100) - 1 ;
  if (sidepadding <= 0) {
    stopInterval(zoomScroll)
  }
}

// helper function to stop
const stopInterval = (interval) => {
  clearInterval(interval);
}

// listening for load event because page should load before we can calculate div heights etc
window.addEventListener('load', () => {
 	const interval = setInterval(zoomScroll, 50);
})
