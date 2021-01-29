# Functional Programming with Javascript

## Student Instructions

### Big Picture

A Mars rover dashboard that consumes the NASA API.

### Getting Started

1. You may clone this repo and will need to install the dependencies

 - [ ] To clone the repo, remember to clone just the starter branch:

```git clone --single-branch --branch starter <repo-name>```

 - [ ] For this project we are using yarn as our package manager, so to install your depencies run:

```yarn install```

**If you don’t have yarn installed globally, follow their installation documentation here according to your operating system: https://yarnpkg.com/lang/en/docs/install

2. Next you'll need a NASA developer API key in order to access the API endpoints. To do that, go here: https://api.nasa.gov/. If you want to simply look around at what api endpoints NASA offers, you can use their provided DEMO_KEY to do this.

3. In your repo, you will see a .env-example file with a place for your API key. Rename or copy the file to one called `.env` and enter in your key. Now that you have your key, just remember to add it as a parameter to every request you make to NASA.

4. Run `yarn start` in your terminal and go to `http:localhost:3000` to check that your app is working. If you don't see an image on the page, check that your api key is set up correctly.



### Project Details

UI features:

- [ ] A gallery of the most recent images sent from each mars rover
- [ ] The launch date, landing date, name and status along with any other information about the rover
- [ ] A selection bar for the user to choose which rover's information they want to see
- [ ] Responsive layout, optimized for phones(max width 768px) and desktop(min-width 991px, max-width 1824px) and Tablet view.
- [ ] Dynamically switch the UI to view one of the three rovers via dropdown select

The frontend code:

- [ ] Uses only pure functions
- [ ] Uses at least one Higher Order Function
- [ ] Uses the array method `map`
- [ ] Uses the ImmutableJS library

The project is:

- [ ] Built with Node/Express
- [ ] Makes calls to the NASA API
- [ ] Uses pure functions to do any logic necessary
- [ ] Hides any sensetive information from public view (using a dotenv file)

### Further functionality

Details to be added here.


### Design

Details to be added here.



