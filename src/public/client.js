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
    roverInfo: '',
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
    let { apod, selectedRover, roverInfo } = state
    if(selectedRover){
    	return `

        <div class="rover-data">
        	<h2>
            ${selectedRover}
        	</h2>
        	${roverWidget(roverInfo)}
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
		// TODO: check data matches selected rover
    // If the rover data object does not yet exist, request it again
    if (!roverInfo ) {
       getRoverInfo(store)
    } else {
  		console.log(roverInfo);
	    // TODO get the different values and build up the html with those
	    return (`
	        <p>${roverInfo.name}</p>
	        <p>${roverInfo.launch_date}</p>
	        <p>${roverInfo.max_sol}</p>
	    `)
    }


}



// ------------------------------------------------------  API CALLS

// TODO get data into a better format
const getRoverInfo = (state) => {
    let { apod, selectedRover } = state
    console.log('getData for: ' + selectedRover);
    fetch(`http://localhost:3000/manifests/${selectedRover}`)
        .then(res => res.json())
        .then(roverInfo => updateStore(store, { roverInfo }))
}
