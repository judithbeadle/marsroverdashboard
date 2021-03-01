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


// static info added manually, i.e. not from API / JSON Data
const staticRovers = Immutable.List([
	{
		name : 'Spirit',
		photo : {
			alt : 'By NASA/JPL/Cornell University, Maas Digital LLC - http://photojournal.jpl.nasa.gov/catalog/PIA04413 (image link), Public Domain, https://commons.wikimedia.org/w/index.php?curid=565283',
			src : '',
		},
		shortInfo : `Together with Opportunity, Spirit was built to have the mobility and toolkit for functioning as a robotic geologist and found evidence for past wet conditions that possibly could have supported microbial life. Spirit lasted 20 times longer than its original design until it concluded its mission in 2010. <br> Find out more about the <a href="https://mars.nasa.gov/mer/" target="_blank">Mars Exploration Rovers (MER)</a> mission.`
	},
	{
		name : 'Opportunity',
		photo : {
			alt : 'By NASA/JPL/Cornell University, Maas Digital LLC - http://photojournal.jpl.nasa.gov/catalog/PIA04413 (image link), Public Domain, https://commons.wikimedia.org/w/index.php?curid=565283',
			src : '',
		},
		shortInfo : `Together with Spirit, Opportunity was built to have the mobility and toolkit for functioning as a robotic geologist and found evidence for past wet conditions that possibly could have supported microbial life. Opportunity has worked on Mars longer than any other robot — nearly 15 years. <br> Find out more about the <a href="https://mars.nasa.gov/mer/" target="_blank">Mars Exploration Rovers (MER)</a> mission.`,
	},
	{ name : 'Curiosity',
		photo : {
			alt : 'By NASA/JPL/Cornell University, Maas Digital LLC - http://photojournal.jpl.nasa.gov/catalog/PIA04413 (image link), Public Domain, https://commons.wikimedia.org/w/index.php?curid=565283',
			src : '',
		},
		shortInfo : `Curiosity set out to answer the question: Did Mars ever have the right environmental conditions to support small life forms called microbes? Early in its mission, Curiosity's scientific tools found chemical and mineral evidence of past habitable environments on Mars. It continues to explore the rock record from a time when Mars could have been home to microbial life.`,
		},
		{ name : 'Perseverance',
		photo : {
			alt : 'By NASA/JPL/Cornell',
			src : '',
		},
		shortInfo : `Perseverance, nicknamed Percy, is a car-sized Mars rover designed to explore Jezero Crater on Mars as part of NASA's Mars 2020 mission. The rover is also carrying the mini-helicopter Ingenuity, an experimental aircraft that will attempt the first powered flight on another planet.`,
		},

])

// holding states
let store = {
		rovers : Immutable.List(['spirit', 'opportunity', 'curiosity', 'perseverance']),
    selectedRover : '',
    roversData : { spirit : {} , opportunity : {}, curiosity : {}, perseverance : {} } ,
    cameras : '',
}

// IIFE to create methods for grabbing things from the DOM and setting basics
const domData = (() => {
	const dashboard = document.getElementById('dashboard');
	const getDashboard = () => {
		return dashboard;
	}

	return {
		getDashboard : getDashboard,
	}
})();

const updateStore = (store, newState) => {
  store = Object.assign(store, newState)
  render(domData.getDashboard(), store)
}

const render = async (root, state) => {
	root.innerHTML = App(state)
	addFilters("camera");
	addSelectListener('roverSelect');
}


// create dashboard html

const App = (state) => {
	let { rovers, selectedRover, roversData } = state

	return `
	<section class="configuration">
		${selectDropdown(rovers, 'roverSelect', 'Select Rover')}
		${roverWidget(roversData[selectedRover])}
	</section>
		${roverMain(roversData[selectedRover])}
	`
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(domData.getDashboard(), store)
})

// ------------------------------------------------------  COMPONENTS

// helper functions to create HTML components
const selectDropdown = (array, selectId, selectLabel) => {
	const options = array.map(option => `<option value="${option}">${capitalize(option)}</option>`).join('');
	return `
	<div class="select-wrap">
	<select id="${selectId}">
		<option value="">${selectLabel}</option>
		${options}
	</select>
	</div>
	`;
}

// Rover data display on widget
const roverWidget = (roverObj) => {
		if(!roverObj) {
			return ''
		}
    // If the rover data object does not yet exist, request it again
    else if (!roverObj.manifest ) {
       getRoverManifest(store);
       return 'loading manifest...';
    } else {
    	// destructuring data
  		let { landing_date, launch_date, max_date, max_sol, name, photos, status, total_photos } = roverObj.manifest;
  		const staticRoverInfo = staticRovers.find(rover => rover.name === name);
  		const dates = crucialDatesArr(roverObj.manifest);



	    // TODO get the different values and build up the html with those
	    return (`
	    	<img src="/assets/images/rovers/${name}.jpg" alt="${staticRoverInfo.photo.alt}">
				<h2>${name}</h2>
				<ul class="key-facts">
					<li><span class="label">Launch Date:</span> ${launch_date}</li>
					<li><span class="label">Landing Date:</span> ${landing_date}</li>
					<li><span class="label">Status:</span> ${status}</li>
					<li><span class="label">Latest images taken on:</span> ${max_date}</li>
					<li><span class="label">Time on Mars:</span> ${max_sol} sols</li>
				</ul>
				<p>Dates: ${dates.join(', ')}</p>
				<p>${staticRoverInfo.shortInfo}</p>
	    `)
    }
}

const roverMain = (roverObj) => {
	if(!roverObj) {
    	return `
			<div class="main">
				<p class="centered">Pick a rover to start your mission</p>
			</div>
			`
	} else if(!roverObj.manifest ) {
		// first getting the manifest data, as this is the basis of everything else
   	getRoverManifest(store);
	   return `
			<div class="main">
				<p>getting Rover data...</p>
			</div>
			`
	} else {
		return  `
		<div class="main">
			${roverGallery(roverObj.galleries)}
		</div>
	  `
	}
}

const roverGallery = (galleriesObj) => {
	if(!galleriesObj){
		// if the empty gallery object has not been created yet for this rover, go ahead and add it to the roversData
		setRoverGalleryObj(store);
	} else {
		// important: latest images always need to be loaded first as this is the trigger on the server to fetch json data for the other dates too.
		let galleryId = 'latest'; // Initital value
		// needs to be replaced with a function returning the drop down value
		const dateSelect = selectDropdown(['1', '2', '3', '4', '5', 'latest'], 'dateSelect', 'Pick Date');


		if( !galleriesObj[galleryId] ) {
			getRoverPhotos(store, galleryId);
			return 'loading gallery...';
		} else {
			let gallery = galleriesObj[galleryId];
			return  `
				${dateSelect}
				<div class="date-info">TODO basic info, like weather based on date</div>
				<div class="gallery">
		    	<ul class="filters"> ${roverCams(gallery)}</ul>
		    	<div id="imageGallery">
		    		${roverImageViewer(gallery)}
		    	</div>
		    </div>
		  `
		}
	}
}

// Rover image galleries
const roverCams = (gallery) => {
	// map for cam name only
	// filter unique names (The indexOf method returns the first index it finds of the provided element)
	return gallery.photos
		.map(photo => photo.camera.name)
		.filter( (value, index, array) => array.indexOf(value) === index )
		.map(cam => `<li class="camera ${cam}"><span class="btn">${cam}</span></li>`)
		.join('');
}

// Gallery
const roverImageViewer = (gallery) => {
		return getCameraGalleries(gallery.photos)
}

// ------------------------------------------------------  Helper Functions

const capitalize = (word) => {
	return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

const getCamerasArray = (photosArr) => {
	return photosArr.map(photo => photo.camera.name).filter( (value, index, array) => array.indexOf(value) === index );
}

// creating the inner HTML for the gallery from photos objects
const imageDataToHTML = (photosArr, listName = "list") => {
	const imageListItems = photosArr.map(photo => `<li class="image"><img src="${photo.img_src}" alt="Photo taken by ${photo.camera.name}"></li>`).join('');
	return `<ul class="${listName}">${imageListItems}</ul>`;
}

const filterByCamera = (photosArr, camera) => {
	return photosArr.filter( photo => photo.camera.name === camera);
}

const getCameraGalleries = (photosArr) => {
	const camerasArr = getCamerasArray(photosArr);
	let cameraGallery = camerasArr.map(camera => imageDataToHTML(filterByCamera(photosArr, camera), camera)).join('');
	return cameraGallery;
}

// --------- Nested Store Object Data:
// store rover manifests and photos in the store roversData object, to avoid repeat API calls
const addToRoverObject = (subobject, currRoverSlug, roversData) => {
	// we keep all existing data and add the manifest object to the rover object
 	if(typeof subobject === 'object' && subobject !== null){
 		return Object.assign(roversData, {
			[currRoverSlug] : Object.assign(roversData[currRoverSlug], subobject)
		});
 	}
}
// same with photos
const addToRoverSubobject = (subobject, currRoverSlug, roversData, subkey) => {
	// we keep all existing data and add the manifest or gallery object to the rover object
	let parent = store.roversData[currRoverSlug];
	target = parent.galleries;
	console.log('galleries: ');
	console.log(parent.galleries);
	return Object.assign(roversData, {
		[currRoverSlug] : Object.assign(parent, {
			[subkey] : Object.assign(parent[subkey], subobject)
		 })
	});
}

const filter = (event) => {
	let button = event.target;
	let filteredEl = document.getElementById("imageGallery").getElementsByClassName(button.innerHTML)[0];
	if(filteredEl.length > 0){
		if(filteredEl.classList.contains("active")){
			filteredEl.classList.remove("active");
			button.classList.remove("active");
		} else {
			filteredEl.classList.add("active");
			button.classList.add("active");
		}
	}
}

const addFilters = (className) => {
	let htmlElements = document.querySelectorAll(`.${className}`);
	htmlElements.forEach(el => {
		el.addEventListener("click", () => { filter(event) }, false);
	});
}

const addSelectListener = (selectId) => {
	const selectNode = document.getElementById(selectId);
	selectNode.value = store.selectedRover; // as this is part of the updated dashboard we need to keep setting this
	selectNode.addEventListener('change', (event) => {
		updateStore(store, { selectedRover : selectNode.value })
	})
}

const newObject = (key, value) => {
  obj = {[key] : value};
  return obj;
}

const setRoverGalleryObj = (state) => {
	let { rovers, selectedRover, roversData } = state;
	const galleries = { galleries: {}};
	updateStore(store, { roversData : addToRoverObject(galleries, selectedRover, roversData) })
}

const crucialDatesArr = (manifest) => {
  const fullYears = Math.floor(parseInt(manifest.max_sol) / 355);
  console.log(manifest.max_sol);
  console.log('full Years on Mars' + fullYears);
  if(fullYears > 0){
  	console.log('rover has been there for more than a year!')
	  return new Array(fullYears+1).fill('').map((item, index) => {
	  	let photoData;
	      if(index === 0){
	      		photoData = manifest.photos[index + 1];
	          return photoData.earth_date;
	      } else {
	      	photoData = manifest.photos[index];
	          return photoData.earth_date;
	      }
	  })
	} else {
		console.log('rover has been there less than a year.')
		return [`rover has been on Mars for ${manifest.max_sol} days`];
	}
}

// ------------------------------------------------------  API CALLS

// higher order function for getting the data
const getRoverData = (dataSlug) => {
	return (state, bd) => {
		let { rovers, selectedRover, roversData } = state
		let fetchURL = `/${selectedRover}/${dataSlug}`;
		if(dataSlug === 'photos') {
			fetchURL = `/${selectedRover}/${dataSlug}/${bd}`
	    fetch(fetchURL)
        .then(res => res.json())
        .then(dataObj => dataObj )
        .then(dataObj => updateStore(store, {
        	roversData : addToRoverSubobject( newObject(bd, dataObj), selectedRover, roversData, 'galleries')
        }))
		} else {
	    fetch(fetchURL)
        .then(res => res.json())
        .then(dataObj => updateStore(store, { roversData : addToRoverObject(dataObj, selectedRover, roversData) }))
        .then(console.log('done fetching data'))
      }
    }
}

const getRoverPhotos = getRoverData('photos');
const getRoverManifest = getRoverData('manifest');
