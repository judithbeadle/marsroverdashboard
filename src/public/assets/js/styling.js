// Seperation of concerns:
// this JS is purely for non functional enhancements, such as animation of DOM elements

// grabbing DOM Elements that will be styled or that help calculate stuff
const intro = document.getElementById("intro");
const mars = document.getElementById("mars");
const scrollInstructions = document.getElementById("hero").getElementsByClassName("instructions")[0];
const windowX = window.innerWidth;
const windowY = window.innerHeight;
const pattern = document.getElementById("stars");
const stars = pattern.getElementsByTagName("circle");

// landing on Mars -> zooming on svg depending on scrolling down to first text section #intro
const zoomScroll = () => {
	const maxSize = 3;
		const minSize = .35;
	let marsSize = ((maxSize - ( maxSize * intro.getBoundingClientRect().top / windowY) + minSize ));
		mars.setAttribute('transform','scale('+marsSize+')');
		scrollInstructions.style.opacity = (( Math.floor( intro.getBoundingClientRect().top ) / ( 7 * 0.5 ) ) / 100) - 1 ;
		if (marsSize <= 0) {
			intro.classList.add('fixed');
				stopInterval(zoomScroll)
		}
}

// helper function to stop
const stopInterval = (interval) => {
		clearInterval(interval);
}

// make stars twinkle by assigning random classes to each star of the stars pattern used
// opacity values are set in main.css and transiton over time
const setStarOpacity = () => {
		const randomNum = (min, max) => {
				return min + Math.floor(Math.random() * (max-min + 1));
		}
		for(const index in stars){
				const number = randomNum(0, 4);
				const starClass= `star${number}`;
				stars.item(index).classList = starClass;
		}
}

// listening for load event because page should load before we can calculate div heights etc
window.addEventListener('load', () => {
		// check distance of intro section to view and zoom into SVG
		const interval = setInterval(zoomScroll, 50);
		// initial opacity values
		setStarOpacity();
		// reset opacity to create twinkle effect
		const twinkle = setInterval(setStarOpacity, 3000);
})
