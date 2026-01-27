export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;


const thisYear = new Date().getFullYear();


export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

 export const topPropertyRank = 2;

// Property square footage options (in m²)
export const propertySquare = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000];

// Property years options
export const propertyYears = Array.from({ length: thisYear - 1950 + 1 }, (_, i) => 1950 + i);
