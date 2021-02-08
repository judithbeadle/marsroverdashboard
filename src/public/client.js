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
		rovers : Immutable.List(['spirit', 'opportunity', 'curiosity']),
    selectedRover : '',
    roverInfo : '',
    gallery : '',
    camera : '',
}

// IIFE to create methods for grabbing things from the DOM and setting basics
const domData = (() => {
	const dashboard = document.getElementById('dashboard');
	const roverSelect = document.getElementById('roverSelect');
	roverSelect.addEventListener('change', (event) => {
		//update store data when select value changes
	   updateStore(store, { selectedRover: roverSelect.value, roverInfo : '', gallery : '' });
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
	    	${roverWidget(roverInfo)}
	    </div>
	    <div class="gallery">
	    	<p>Cameras: ${roverCams(gallery)}</p>
	    	<div class="gallery">
	    		${roverGallery(gallery)}
	    	</div>
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
    createDropdown( store.rovers, domData.getRoverSelect() )
})

// ------------------------------------------------------  COMPONENTS

// helper functions to create HTML components
const createDropdown = (array, selectContainer) => {
	array.forEach(item => {
		const option = document.createElement("option");
		// capitalizing first letter from: https://masteringjs.io/tutorials/fundamentals/capitalize-first-letter
		option.text = item.charAt(0).toUpperCase() + item.slice(1);
		option.value = item;
		selectContainer.appendChild(option);
	})
}

const imageDataToHTML = (data) => {
	return data.map(photo => `<img src="${photo.img_src}" alt="Photo taken by ${photo.camera.name}">`).reduce( ( fullGallery, photo ) => fullGallery + photo)
}

// Rover data display on widget
const roverWidget = (roverInfo) => {
    // If the rover data object does not yet exist, request it again
    if (!roverInfo ) {
       getRoverInfo(store)
       return 'loading...';
    } else {
    	// destructuring data
  		let { landing_date, launch_date, max_date, max_sol, name, photos, status, total_photos } = roverInfo.manifest;
	    // TODO get the different values and build up the html with those
	    return (`
				<h2>${name}</h2>
				<ul class="key-facts">
					<li>Launch Date: ${launch_date}</li>
					<li>Landing Date: ${landing_date}</li>
					<li>Status: ${status}</li>
					<li>Latest images taken on: ${max_date}</li>
					<li>Time on Mars: ${max_sol} Sols (Martian Days)</li>
				</ul>
	    `)
    }
}

// Rover image galleries
const roverCams = (gallery) => {
	if( !gallery ) {
		getGallery(store)
		return 'loading cameras...';
	} else {
		// map for cam name only
		// filter unique names (The indexOf method returns the first index it finds of the provided element)
		//reduce to one string
		const cams = gallery.photos
			.map(photo => photo.camera.name)
			.filter( (value, index, array) => array.indexOf(value) === index )
			.map(cam => `<span class="camera">${cam}</span>`)
		console.log(cams)
		return cams.join('')
  }
}

// Gallery
const roverGallery = (gallery) => {
	if( !gallery ) {
		getGallery(store)
		return 'loading gallery...';
	} else {
		const pictures = gallery.photos
		// TODO: check if camera has been selected and filter images like so:
		// const captainsArray = characters.filter(x => x.role === 'Captain').map( c => c.name );

		return imageDataToHTML(gallery.photos)

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
