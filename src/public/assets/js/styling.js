// non functional enhancements


// landing on Mars -> zooming on svg depending on scrolling down to first text section #intro
const intro = document.getElementById("intro");
const mars = document.getElementById("mars-graphic");
const scrollInstructions = document.getElementById("hero").getElementsByClassName("instructions")[0];
const onePercent = intro.getBoundingClientRect().top * 0.01;


/*let BGPosition = 0;
let resetSize = 400;
function scrollBodyBG() {
    BGPosition = ++BGPosition % resetSize; // this counts up to 400 and then starts again. maybe use for texture position ?
    //$('body').css("background-position", (-1 * BGPosition) + "px 0px");
    //console.log(BGPosition);
}*/



const doStuffOnInterval = () => {
	const maxSidepadding = 0.5; // vw => 1 = 100%
	let sidepadding = maxSidepadding * ( intro.getBoundingClientRect().top / onePercent );
	console.log(sidepadding);
  let padding = "0px " + sidepadding + "vw";
  console.log(padding);
  console.log(onePercent);
  mars.style.padding = padding;
  //mars.style.backgroundColor = "red"
  if (sidepadding <= 0) {
    stopInterval(doStuffOnInterval)
  }
}

const stopInterval = (interval) => {
  clearInterval(interval);
}





// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
	console.log(mars);
 	const interval = setInterval(doStuffOnInterval, 50);
})
