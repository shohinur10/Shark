// Realistic mock supplement data matching backend schema
// All claims are medically accurate and evidence-based
import { Supplement } from '../types/supplement/supplement';

export const mockSupplements: Supplement[] = [
	{
		_id: '1',
		name: 'Vitamin D3',
		category: 'Essential Vitamins',
		description: 'A fat-soluble vitamin that plays a crucial role in calcium absorption, bone health, and immune system function. The body produces vitamin D when skin is exposed to sunlight, but many people have insufficient levels.',
		recommendedDosage: '600-2000 IU daily, taken with a meal containing fat for optimal absorption',
		keyBenefits: [
			'Bone Health',
			'Immune Support',
			'Calcium Absorption',
			'Muscle Function'
		],
		bestFor: [
			'Individuals with limited sun exposure',
			'Older adults',
			'Bone health support',
			'Immune system function'
		],
		rating: 4.8,
		usageNotes: 'Take with a meal containing fat. Higher doses may be needed during winter months or for those with limited sun exposure. Consult healthcare provider if taking blood thinners.',
	},
	{
		_id: '2',
		name: 'Vitamin B12',
		category: 'Essential Vitamins',
		description: 'A water-soluble vitamin essential for red blood cell formation, DNA synthesis, and proper nerve function. It plays a key role in converting food into energy.',
		recommendedDosage: '500-1000mcg daily, taken in the morning with food',
		keyBenefits: [
			'Energy Production',
			'Red Blood Cell Formation',
			'Nerve Health',
			'DNA Synthesis'
		],
		bestFor: [
			'Vegetarians and vegans',
			'Older adults',
			'Energy support',
			'Anemia prevention'
		],
		rating: 4.7,
		usageNotes: 'Particularly important for vegetarians, vegans, or those over 50 who may have reduced absorption. Water-soluble, so excess is excreted safely.',
	},
	{
		_id: '3',
		name: 'Vitamin C',
		category: 'Essential Vitamins',
		description: 'A water-soluble antioxidant that supports immune function, collagen production, and helps protect cells from oxidative damage. Essential for wound healing and tissue repair.',
		recommendedDosage: '500-1000mg daily, can be split into 2-3 doses throughout the day',
		keyBenefits: [
			'Immune Support',
			'Antioxidant Protection',
			'Collagen Production',
			'Wound Healing'
		],
		bestFor: [
			'Immune system support',
			'Active individuals',
			'Skin health',
			'Recovery from exercise'
		],
		rating: 4.6,
		usageNotes: 'Take with meals to enhance absorption. High doses (>2000mg) may cause digestive upset in some individuals. No serious toxicity at recommended doses.',
	},
	{
		_id: '4',
		name: 'Magnesium',
		category: 'Minerals',
		description: 'An essential mineral involved in over 300 biochemical reactions in the body, including muscle contraction, protein synthesis, energy production, and nervous system function.',
		recommendedDosage: '300-400mg daily, taken in the evening with food',
		keyBenefits: [
			'Muscle Function',
			'Energy Production',
			'Sleep Quality',
			'Nervous System Support'
		],
		bestFor: [
			'Muscle cramps',
			'Sleep support',
			'Stress management',
			'Athletes and active individuals'
		],
		rating: 4.8,
		usageNotes: 'Take in the evening as it may support relaxation. High doses may cause diarrhea. Avoid taking with calcium supplements as they compete for absorption.',
	},
	{
		_id: '5',
		name: 'Zinc',
		category: 'Minerals',
		description: 'A trace mineral essential for immune function, protein synthesis, wound healing, and numerous enzymatic reactions. Plays a role in over 100 biochemical processes.',
		recommendedDosage: '8-15mg daily, taken with food',
		keyBenefits: [
			'Immune Function',
			'Wound Healing',
			'Protein Synthesis',
			'Enzymatic Reactions'
		],
		bestFor: [
			'Immune support',
			'Wound healing',
			'Athletes',
			'Protein synthesis support'
		],
		rating: 4.7,
		usageNotes: 'Take with food to reduce stomach upset. High doses (>40mg) may interfere with copper absorption. Take separately from iron and calcium supplements.',
	},
	{
		_id: '6',
		name: 'Iron',
		category: 'Minerals',
		description: 'Essential mineral for oxygen transport in blood, energy production, and cognitive function. Forms part of hemoglobin, which carries oxygen throughout the body.',
		recommendedDosage: '8-18mg daily (varies by gender and needs), taken with vitamin C',
		keyBenefits: [
			'Oxygen Transport',
			'Energy Production',
			'Red Blood Cell Formation',
			'Cognitive Function'
		],
		bestFor: [
			'Women (especially during menstruation)',
			'Athletes',
			'Vegetarians',
			'Anemia prevention'
		],
		rating: 4.6,
		usageNotes: 'Only supplement if deficient or at risk. Take with vitamin C for enhanced absorption. Avoid taking with calcium or zinc. Excess iron can be toxic - consult healthcare provider before supplementing.',
	},
	{
		_id: '7',
		name: 'Whey Protein',
		category: 'Protein',
		description: 'A complete protein source derived from milk, containing all essential amino acids. Rapidly absorbed to support muscle repair and growth after exercise.',
		recommendedDosage: '20-30g per serving, ideally taken post-workout within 30 minutes',
		keyBenefits: [
			'Muscle Recovery',
			'Muscle Growth',
			'Complete Amino Acids',
			'Fast Absorption'
		],
		bestFor: [
			'Post-workout recovery',
			'Muscle building',
			'Meal replacement',
			'Athletes'
		],
		rating: 4.9,
		usageNotes: 'Generally safe for most people. May cause digestive issues in those with lactose intolerance. Choose isolate form if sensitive to lactose.',
	},
	{
		_id: '8',
		name: 'Casein Protein',
		category: 'Protein',
		description: 'A slow-digesting protein that provides a sustained release of amino acids over several hours. Forms a gel in the stomach, extending digestion time.',
		recommendedDosage: '20-40g per serving, best taken before bed or between meals',
		keyBenefits: [
			'Sustained Amino Acid Release',
			'Muscle Protection',
			'Anti-Catabolic Effect',
			'Complete Protein'
		],
		bestFor: [
			'Overnight muscle protection',
			'Between meals',
			'Extended fasting periods',
			'Bedtime nutrition'
		],
		rating: 4.7,
		usageNotes: 'Safe for most people. May cause digestive issues in those with lactose intolerance. Generally well-tolerated.',
	},
	{
		_id: '9',
		name: 'Creatine Monohydrate',
		category: 'Performance',
		description: 'A naturally occurring compound that helps regenerate ATP, the primary energy source for high-intensity activities. Stored in muscles as phosphocreatine.',
		recommendedDosage: '3-5g daily, taken consistently. Can be taken pre or post-workout',
		keyBenefits: [
			'Increased Strength',
			'Power Output',
			'Muscle Mass',
			'Exercise Performance'
		],
		bestFor: [
			'Strength training',
			'High-intensity exercise',
			'Muscle building',
			'Power athletes'
		],
		rating: 4.9,
		usageNotes: 'Extremely well-researched and safe. May cause slight water retention. Stay well-hydrated. No serious side effects at recommended doses.',
	},
	{
		_id: '10',
		name: 'Beta-Alanine',
		category: 'Performance',
		description: 'An amino acid that increases muscle carnosine levels, helping buffer acid during high-intensity exercise. Reduces muscle fatigue and improves endurance.',
		recommendedDosage: '2-5g daily, split into smaller doses (0.8-1.6g) throughout the day',
		keyBenefits: [
			'Reduced Muscle Fatigue',
			'Improved Endurance',
			'Performance Enhancement',
			'Acid Buffering'
		],
		bestFor: [
			'High-intensity interval training',
			'Repeated sprint performance',
			'1-4 minute activities',
			'Endurance athletes'
		],
		rating: 4.5,
		usageNotes: 'Safe at recommended doses. May cause harmless tingling sensation (paresthesia) which subsides with continued use. No serious side effects.',
	},
	{
		_id: '11',
		name: 'Omega-3 Fish Oil',
		category: 'Fatty Acids',
		description: 'Essential fatty acids (EPA and DHA) that the body cannot produce. They support cardiovascular health, brain function, and help reduce inflammation throughout the body.',
		recommendedDosage: '1000-2000mg daily (combined EPA + DHA), taken with meals',
		keyBenefits: [
			'Heart Health',
			'Brain Function',
			'Anti-Inflammatory',
			'Cognitive Support'
		],
		bestFor: [
			'Heart health support',
			'Brain function',
			'Inflammation reduction',
			'Athletes'
		],
		rating: 4.8,
		usageNotes: 'Take with meals for optimal absorption. High doses may increase bleeding risk. Consult healthcare provider if taking blood thinners. Choose quality sources to avoid contaminants.',
	},
	{
		_id: '12',
		name: 'Multivitamin Complex',
		category: 'Multivitamins',
		description: 'A comprehensive blend of essential vitamins and minerals designed to fill nutritional gaps in the diet and support overall health. Provides baseline micronutrient coverage.',
		recommendedDosage: '1 tablet daily, taken with breakfast or first meal',
		keyBenefits: [
			'Daily Nutrition',
			'Nutrient Insurance',
			'Overall Wellness',
			'Energy Support'
		],
		bestFor: [
			'Nutritional gaps',
			'Busy lifestyles',
			'General health support',
			'Dietary insurance'
		],
		rating: 4.6,
		usageNotes: 'Generally safe. Choose quality brands with appropriate dosages. Not a replacement for a balanced diet. Some nutrients may interact with medications - consult healthcare provider.',
	},
];

