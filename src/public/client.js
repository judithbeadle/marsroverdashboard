// Use only pure functions.
// Use at least one Higher Order Function.
// Use the array method map.
// Use the ImmutableJS library.


/* Backend code must :
	- Be built with Node/Express.
	- Make successful calls to the NASA API.
	- Use pure functions to do any logic necessary.
	- Hide any sensitive information from public view (In other words, use your dotenv file).
*/


// holding states
let store = {
    selectedRover : '',
    roverInfo : '',
    gallery : '',
    camera : 0,
}

// IIFE to create methods for grabbing things from the DOM and setting basics

const domData = (() => {
	const dashboard = document.getElementById('dashboard');
	const roverSelect = document.getElementById('roverSelect');
	roverSelect.addEventListener('change', (event) => {
		//update store data when select value changes
	   updateStore(store, { selectedRover: roverSelect.value, roverInfo : '' });
	});

	const getDashboard = () => {
		return dashboard;
	}

	const getRoverSelect = () => {
		return roverSelect;
	}

	return {
		getDashboard : getDashboard,
		getRoverSelect : getRoverSelect,
	}
})();


const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(domData.getDashboard(), store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
	let { selectedRover, roverInfo, gallery } = state
	if(selectedRover){
		return `

	    <div class="rover-data">
	    	<h2>
	        ${selectedRover}
	    	</h2>
	    	${roverWidget(roverInfo)}
	    	<div class="gallery">
	    		<h3>Cameras</h3>
	    		${roverCams(roverInfo, gallery)}
	    	</div>
		`
	}
	else {
		return `
		<p>Pick a rover to start the mission!</p>
	`
	}
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(domData.getDashboard(), store)
})

// ------------------------------------------------------  COMPONENTS


// Rover data display on widget
const roverWidget = (roverInfo) => {
    // If the rover data object does not yet exist, request it again
    if (!roverInfo ) {
       getRoverInfo(store)
       return 'loading...';
    } else {
  		let rover = roverInfo.manifest;
  		console.log(rover)
	    // TODO get the different values and build up the html with those
	    return (`
	        <p>${rover.name}</p>
	        <p>${rover.launch_date}</p>
	        <p>${rover.max_sol}</p>
	    `)
    }
}

// Rover image galleries
const roverCams = (roverInfo, gallery) => {
	// If the rover data object does not yet exist, request it again
    if (!roverInfo ) {
       getRoverInfo(store)
       return 'loading...';
    } else {
  		let rover = roverInfo[Object.keys(roverInfo)[0]];
	    // TODO get the different values and build up the html with those
	    if(!gallery) {
	    	getGallery(store)
	    	return 'loading gallery...';
	    } else {
	    	console.log(gallery.pics);
	    	gallery.pics.latest_photos.map( photo => console.log(photo));
	    	return (`
	        <p>Most recent data aquired on: ${rover.max_date}</p>
	    `);
	    }

    }
}



// ------------------------------------------------------  API CALLS

const getGallery = (state) => {
	let { selectedRover, roverInfo } = state
	console.log('get Images for: ' + selectedRover);
	fetch(`http://localhost:3000/${selectedRover}/photos`)
        .then(res => res.json())
        .then(gallery => updateStore(store, { gallery }))
}

const getRoverInfo = (state) => {
    let { selectedRover } = state
    console.log('getData for: ' + selectedRover);
    fetch(`http://localhost:3000/${selectedRover}`)
        .then(res => res.json())
        .then(roverInfo => updateStore(store, { roverInfo }))
}
