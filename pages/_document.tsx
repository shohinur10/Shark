import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'shark, shark.uz, fitness platform, workout, meal plan, nutrition tracking'} />
				<meta
					name={'description'}
					content={
						'Shark - Your Complete Fitness Platform. Track workouts, plan meals, achieve goals, and connect with trainers. Best fitness experience on shark.uz | ' +
						'Shark - Ваша полная фитнес-платформа. Отслеживайте тренировки, планируйте питание, достигайте целей и общайтесь с тренерами. Лучший фитнес-опыт на shark.uz | ' +
						'Shark - 완벽한 피트니스 플랫폼. 운동 추적, 식단 계획, 목표 달성, 트레이너 연결. shark.uz에서 최고의 피트니스 경험을 만나보세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
