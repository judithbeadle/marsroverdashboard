require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

const Immutable = require('immutable');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
const apiKey = process.env.API_KEY;

// rover manifests and latest images
const rovers = Immutable.List(['spirit', 'opportunity', 'curiosity']);

let roverDates = {
    spirit : [],
    opportunity : [],
    curiosity : []
}

const getRoverDates = (rover) => {
    return roverDates[rover];
}

const updateRoverDates = (rover, array) => {
    roverDates[rover] = array;
    //Object.assign(roverDates[rover], array);
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
          case 'day':
            date.setDate(parseInt(day + number));
            break;
        }
        return date.toISOString().slice(0,10);
    }
}

const addDays = addtoDate('day');
const addYears = addtoDate('year');

const crucialDatesArr = (landingDate, totalDays) => {
    const fullYears = Math.floor(parseInt(totalDays) / 355);
    return new Array(fullYears).fill('').map((item, index) => {
        if(index === 0){
            return addDays(landingDate, 1);
        } else {
            return addYears(landingDate, index)
        }
    })
}

rovers.forEach(rover => {
    app.get(`/${rover}/manifest`, async (req, res) => {
        try {
            let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`)
                .then(res => res.json())
                .then( manifest => manifest.photo_manifest)
            res.send({ manifest })
        } catch (err) {
            console.log('error:', err);
        }
    })
    app.get(`/${rover}/photos`, async (req, res) => {
        try {
            let roverDates = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${apiKey}`)
                .then(res => res.json())
                .then( roverDates =>  updateRoverDates(rover, crucialDatesArr( roverDates.latest_photos[0].rover.landing_date, roverDates.latest_photos[0].sol )))
            let photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${getRoverDates(rover)[0]}&api_key=${apiKey}`)
            .then( res => res.json())
            .then( photos => photos.photos )
            res.send({ photos })
        } catch (err) {
            console.log('error:', err);
        }
    })

    getRoverDates(rover).forEach(roverDate => {
        // TODO create more urls like so: rover/photos/yyyy-m-dd

    })
})



app.listen(port, () => console.log(`MarsRoverDashboard app listening on port ${port}!`))