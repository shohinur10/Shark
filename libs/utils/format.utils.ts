/**
 * Formats enum values to display labels.
 * Converts underscore-separated enum values to title case.
 * 
 * @example
 * formatEnumLabel("FULL_GYM") // "Full Gym"
 * formatEnumLabel("HIIT") // "HIIT"
 * formatEnumLabel("MARTIAL_ARTS") // "Martial Arts"
 * 
 * @param enumValue - The enum value string to format
 * @returns Formatted label string
 */
export const formatEnumLabel = (enumValue: string): string => {
	return enumValue.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};


















