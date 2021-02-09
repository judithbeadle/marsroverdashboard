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
    roversData : { spirit : {} , opportunity : {}, curiosity : {} } ,
    gallery : '',
    camera : '',
}

// IIFE to create methods for grabbing things from the DOM and setting basics
const domData = (() => {
	const dashboard = document.getElementById('dashboard');
	const roverSelect = document.getElementById('roverSelect');
	roverSelect.addEventListener('change', (event) => {
		//update store data when select value changes
	   updateStore(store, { selectedRover: roverSelect.value });
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
    console.log(store)
}

const render = async (root, state) => {
	root.innerHTML = App(state)
}


// create content
const App = (state) => {
	let { selectedRover, roversData, gallery } = state
	if(selectedRover){
		return `

	    <div class="rover-data">
	    	${roverWidget(roversData[selectedRover])}
	    </div>
	    <div class="gallery">
	    	<p>Cameras: ${roverCams(roversData[selectedRover])}</p>
	    	<div class="gallery">
	    		${roverGallery(roversData[selectedRover])}
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

// Rover data display on widget
const roverWidget = (roverObj) => {
    // If the rover data object does not yet exist, request it again
    if (!roverObj.manifest ) {
       //getRoverInfo(store)
       getRoverManifest(store);
       return 'loading manifest...';
    } else {
    	// destructuring data
  		let { landing_date, launch_date, max_date, max_sol, name, photos, status, total_photos } = roverObj.manifest;
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
const roverCams = (roverObj) => {
	if( !roverObj.photos ) {
		getRoverPhotos(store);
		return 'loading cameras...';
	} else {
		// map for cam name only
		// filter unique names (The indexOf method returns the first index it finds of the provided element)
		return roverObj.photos
			.map(photo => photo.camera.name)
			.filter( (value, index, array) => array.indexOf(value) === index )
			.map(cam => `<span class="camera">${cam}</span>`)
			.join('');
  }
}

// Gallery
const roverGallery = (roverObj) => {
	if( !roverObj.photos ) {
		console.log('no photos :(');
		getRoverPhotos(store);
		return 'loading photos...';
	} else {
		// TODO: check if camera has been selected and filter images like so:
		// const captainsArray = characters.filter(x => x.role === 'Captain').map( c => c.name );

		return imageDataToHTML(roverObj.photos)

  }
}

// ------------------------------------------------------  Helper Functions

// creating the inner HTML for the gallery from photos objects
const imageDataToHTML = (photosArray) => {
	const imageListItems = photosArray.map(photo => `<li class="image"><img src="${photo.img_src}" alt="Photo taken by ${photo.camera.name}"></li>`).join('');
	return `<ul class="gallery">${imageListItems}</ul>`;
}

// --------- Nested Store Object Data:
// store rover manifests and photos in the store roversData object, to avoid repeat API calls
const addToRoverObject = (subobject, currRoverSlug, roversData) => {
	// we keep all existing data and add the manifest or gallery object to the rover object
	return Object.assign(roversData, {
		[currRoverSlug] : Object.assign(roversData[currRoverSlug], subobject)
	});
}

// ------------------------------------------------------  API CALLS

// higher order function for getting the data
const getRoverData = (dataSlug) => {
	return state => {
    let { rovers, selectedRover, roversData } = state
    console.log(`get ${dataSlug} for ${selectedRover}`);
    fetch(`http://localhost:3000/${selectedRover}/${dataSlug}`)
        .then(res => res.json())
        .then(dataObj => updateStore(store, { roversData : addToRoverObject(dataObj, selectedRover, roversData) }))
      }
}

const getRoverPhotos = getRoverData('photos');
const getRoverManifest = getRoverData('manifest');
