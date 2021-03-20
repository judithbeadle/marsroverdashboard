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
		selectedDate : 'latest',
		roversData : { spirit : {} , opportunity : {}, curiosity : {}, perseverance : {} } ,
}

// IIFE to create methods for grabbing things from the DOM and setting basics
// it's not short, but it's a function rather than a declaration of a static const
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
	addSelectListener('roverSelect');
	addDateListener('dateSelect');
	addClickListener('camera');
	addClickListener('image');
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

const createDateSelect = (array, selectId) => {
	const options = array.map(option => {
		return `<option value="${option.id}">${option.earth_date} / ${option.label}</option>`
	}).join('');
	return `
	<div class="select-wrap">
	<select id="${selectId}">
		${options}
	</select>
	</div>
	`;
}

const addDateListener = (selectId) => {
	const selectNode = document.getElementById(selectId);
	if(selectNode){
		selectNode.value = store.selectedDate; // as this is part of the updated dashboard we need to keep setting this
		selectNode.addEventListener('change', (event) => {
			updateStore(store, { selectedDate : selectNode.value })
		})
	}
}

// Rover data display on widget
const roverWidget = (roverObj) => {
		if(!roverObj) {
			return '<p><span class="mode-info">Rover Controls ready</span></p>'
		}
		// If the rover data object does not yet exist, request it again
		else if (!roverObj.manifest ) {
			 getRoverManifest(store);
			 return `
				<p class="mode-info">Loading: <span class="loading">rover manifest<span></p>
			`
		} else {
			// destructuring data
			let { landing_date, launch_date, max_date, max_sol, name, photos, status, total_photos } = roverObj.manifest;
			const staticRoverInfo = staticRovers.find(rover => rover.name === name);
			const dates = { dates : crucialDatesArr(roverObj.manifest) };

			// get the different values and build up the html with those
			return (`
				<div class="image-wrap status-${status}">
					<img src="/assets/images/rovers/${name.toLowerCase()}.jpg" alt="${staticRoverInfo.photo.alt}">
				</div>
				<h2>${name}</h2>
				<ul class="key-facts">
					<li><span class="label">Launch Date:</span> ${launch_date}</li>
					<li><span class="label">Landing Date:</span> ${landing_date}</li>
					<li class="label status-${status}"><span class="label">Status:</span> ${status}</li>
					<li><span class="label">Latest images taken on:</span> ${max_date}</li>
					<li><span class="label">Time on Mars:</span> ${max_sol} sols</li>
				</ul>
				<p>${staticRoverInfo.shortInfo}</p>
			`)
		}
}

const roverMain = (roverObj) => {
	if(!roverObj) {
			return `
			<div class="main">
				<div class="widget instructions centered">
					<span class="mode-info">Dashboard on standby</span>
				</div>
			</div>
			`
	} else if(!roverObj.manifest ) {
		// first getting the manifest data, as this is the basis of everything else
		getRoverManifest(store);
		 return `
			<div class="main">
				<p class="mode-info">Loading: <span class="loading">controls...<span></p>
			</div>
			`
	} else {
		const datesObj = { dates : crucialDatesArr(roverObj.manifest) };
		// drop down with dates
		const dateSelect = createDateSelect(datesObj.dates, 'dateSelect');
		return  `
		<div class="main">
			${dateSelect}
			${roverGallery(roverObj.galleries)}
		</div>
		`
	}
}

const roverGallery = (galleriesObj) => {
	if(!galleriesObj){
		// if the empty gallery object has not been created yet for this rover, go ahead and add it to the roversData
		setRoverGalleryObj(store);
		return `
			<p class="mode-info">Loading: <span class="loading">data...<span></p>
			`
	} else {
		// important: latest images always need to be loaded first as this is the trigger on the server to fetch json data for the other dates too.
		let galleryId = store.selectedDate; // get current date selection

		if( !galleriesObj[galleryId] ) {
			getRoverPhotos(store, galleryId);
			return `
			<p class="mode-info">Loading: <span class="loading">cameras...<span></p>
			`
		} else {
			let gallery = galleriesObj[galleryId];
			if(gallery.photos.length > 0){
				return  `
					<div class="gallery">
						<p class="mode-info">Images available: ${gallery.photos.length} - Cameras ready for activation</p>
						<div id="imageGallery">

							${roverImageViewer(gallery)}
						</div>
					</div>
				`
			} else {
				// sometimes there are no images for a specific date (Spirit Y5) - error handling
				return `<p class="mode-info error">No images available for this date - pick a new milestone.</p>`
			}
		}
	}
}

// Gallery
const roverImageViewer = (gallery) => {
		return getCameraGalleries(gallery.photos)
}

// =======================================  Helper Functions  ==========================

// capitalize - useful for lowercase identifiers
const capitalize = (word) => {
	return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

// using variable as object key
const newObject = (key, value) => {
	obj = {[key] : value};
	return obj;
}

// Galleries by camera
// -------------------
const getCamerasArray = (photosArr) => {

	const camArray = photosArr.map(photo => photo.camera);
	const key = 'name';
	const uniqueCams = [...new Map(camArray.map(item => [item[key], item])).values()];

	return uniqueCams;
}

// creating the inner HTML for the gallery from photos objects
const imageDataToHTML = (photosArr, camera) => {
	const imageListItems = photosArr.map(photo => `<li class="image"><img src="${photo.img_src}" alt="Photo taken by ${photo.camera.name}"></li>`).join('');
	return `<div class="gallery-wrap ${camera.name}"><div class="camera"><span class="btn">${camera.name}</span><h3>${camera.full_name}, ID: ${camera.id} Images: ${photosArr.length}</h3></div><div class="image-slider"><div class="big-img"></div><ul>${imageListItems}</ul></div></div>`;
}

// just for better readability of code - an extra function to filter by camera
const filterByCamera = (photosArr, camera) => {
	return photosArr.filter( photo => photo.camera.name === camera);
}

// finally the function using all above functions and returning the html for image sets
const getCameraGalleries = (photosArr) => {
	const camerasArr = getCamerasArray(photosArr);
	let cameraGallery = camerasArr.map(camera => imageDataToHTML(filterByCamera(photosArr, camera.name), camera )).join('');
	return cameraGallery;
}

// Adding to nested Store Object Data
// ----------------------------------

// store rover manifests and photos in the store roversData object, to avoid repeat API calls
const addToRoverObject = (subobject, currRoverSlug, roversData) => {
	// we keep all existing data and add the manifest and dates objects to the rover object
	if(typeof subobject === 'object' && subobject !== null){
		return Object.assign(roversData, {
			[currRoverSlug] : Object.assign(roversData[currRoverSlug], subobject)
		});
	}
}

// same with photos
// nesting one level deeper for adding photo sets to galleries object
const addToRoverSubobject = (subobject, currRoverSlug, roversData, subkey) => {
	// we keep all existing data and add the manifest or gallery object to the rover object
	let parent = store.roversData[currRoverSlug];
	target = parent.galleries;
	return Object.assign(roversData, {
		[currRoverSlug] : Object.assign(parent, {
			[subkey] : Object.assign(parent[subkey], subobject)
		 })
	});
}

// allowing filtering of cameras via button and html classes
const filter = (event) => {
	let clickedEl = event.target;
	// if we have an image we want to show this full size in a container above
	if(clickedEl.tagName == 'IMG'){
		const bigImg = clickedEl.cloneNode(true);
		const wrapper = clickedEl.closest('.image-slider').getElementsByClassName('big-img')[0];
		wrapper.innerHTML = ''; // clear from previous content
		wrapper.appendChild(bigImg); // append clicked image
	} else {
		let filteredEl = document.getElementById("imageGallery").getElementsByClassName(clickedEl.innerHTML)[0];
		if(filteredEl){
			if(filteredEl.classList.contains("active")){
				filteredEl.classList.remove("active");
				clickedEl.classList.remove("active");
			} else {
				filteredEl.classList.add("active");
				clickedEl.classList.add("active");
			}
		}
	}
}

const addClickListener = (className) => {
	let htmlElements = document.querySelectorAll(`.${className}`);
	htmlElements.forEach(el => {
		el.style.cursor = "pointer";
		el.addEventListener("click", () => { filter(event) }, false);
	});
}

const addSelectListener = (selectId) => {
	const selectNode = document.getElementById(selectId);
	selectNode.value = store.selectedRover; // as this is part of the updated dashboard we need to keep setting this
	selectNode.addEventListener('change', (event) => {
		updateStore(store, { selectedRover : selectNode.value })
		updateStore(store, { selectedDate : 'latest' })
	})
}

const setRoverGalleryObj = (state) => {
	let { rovers, selectedRover, roversData } = state;
	const galleries = { galleries: {}};
	updateStore(store, { roversData : addToRoverObject(galleries, selectedRover, roversData) })
}

// higher order function for changing dates
const addtoDate = (dmy) => {
		return (orignalDate, number)=> {
				let date = new Date(orignalDate);
				const year = date.getFullYear();
				const month = date.getMonth();
				const day = date.getDate();
				switch(dmy) {
					case 'year':
						date.setFullYear(parseInt(year + number));
						break;
					case 'month':
							 date.setMonth(parseInt(month + number));
						break;
					case 'week':
						date.setDate(parseInt(day + (number*7)));
						break;
					case 'day':
						date.setDate(parseInt(day + number));
						break;
				}
				return date.toISOString().slice(0,10);
		}
}

const addDays = addtoDate('day');
const addWeeks = addtoDate('week');
const addMonths = addtoDate('month');
const addYears = addtoDate('year');

const crucialDatesArr = (manifest) => {
	const landingDate = new Date(manifest.landing_date);
	const fullYears = Math.floor(parseInt(manifest.max_sol) / 356);
	const fullMonths = Math.floor(parseInt(manifest.max_sol) / (356 / 12));
	const fullWeeks = Math.floor(parseInt(manifest.max_sol) / 7);
	let array = [{ id : 0, label : 'first images', earth_date : manifest.photos[0].earth_date }];
	let keyDates;

	if(fullYears > 0){
		keyDates = new Array(fullYears).fill('').map((item, index) => {
			let label = 'Year ' + parseInt(index + 1) + ' Milestone';
			return { id : parseInt(index + 1), label : label, earth_date : addYears(landingDate, index + 1) };
		})
	} else if(fullMonths > 0){
		keyDates = new Array(fullMonths).fill('').map((item, index) => {
			let label = 'Month' + parseInt(index + 1) + ' Milestone';
			return { id : parseInt(index + 1), label : label, earth_date : addMonths(landingDate, index + 1) };
		})
	} else if(fullWeeks > 0){
		keyDates = new Array(fullWeeks).fill('').map((item, index) => {
			let label = 'Week' + parseInt(index + 1) + ' Milestone';
			return { id : parseInt(index + 1), label : label, earth_date : addWeeks(landingDate, index + 1) };
		})
	} else {
		keyDates = new Array(manifest.max_sol).fill('').map((item, index) => {
			let label = 'Day ' + parseInt(index + 1);
			return { id : parseInt(index + 1), label : label, earth_date : addDays(landingDate, index + 1) };
		})
	}
	const allDates = array.concat(keyDates);
	allDates.push({ id : 'latest', label : 'most recent', earth_date : manifest.max_date });
	return allDates;
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
			}
		}
}

const getRoverPhotos = getRoverData('photos');
const getRoverManifest = getRoverData('manifest');
