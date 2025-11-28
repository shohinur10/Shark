// Fitness Listing Types: Gyms, Studios, Equipment, Personal Trainers
export enum PropertyType {
	GYM = 'GYM',                           // Full gym facility
	STUDIO = 'STUDIO',                     // Yoga/Pilates/Dance studio
	EQUIPMENT = 'EQUIPMENT',               // Fitness equipment for sale/rent
	PERSONAL_TRAINER = 'PERSONAL_TRAINER', // Personal trainer services
	CROSSFIT_BOX = 'CROSSFIT_BOX',        // CrossFit facility
	SWIMMING_POOL = 'SWIMMING_POOL',      // Swimming pool/aquatic center
	SPORTS_CLUB = 'SPORTS_CLUB',          // Multi-sport facility
}


export enum PropertyStatus {
	ACTIVE = 'ACTIVE',       // Available/Active
	SOLD = 'SOLD',           // Sold (for equipment)
	RENTED = 'RENTED',       // Rented out
	BOOKED = 'BOOKED',       // Fully booked (for trainers/classes)
	INACTIVE = 'INACTIVE',   // Temporarily inactive
	DELETE = 'DELETE',       // Deleted
}


// Korean Cities + Major Global Fitness Hubs
export enum PropertyLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
