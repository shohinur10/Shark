import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload, Image as ImageImpl } from '@react-three/drei';
import { ScrollControls, Scroll } from './ScrollControls';
import * as THREE from 'three';

function Image(props: any) {
	const ref = useRef<THREE.Group>();
	const group = useRef<THREE.Group>();

	return (
		// @ts-ignore
		<group ref={group}>
			<ImageImpl ref={ref} {...props} />
		</group>
	);
}

function Page({ m = 0.4, urls, ...props }: any) {
	const { width } = useThree((state) => state.viewport);
	const w = width < 10 ? 1.5 / 3 : 1 / 3;

	return (
		<group {...props}>
			<Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
			<Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
			<Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
		</group>
	);
}

function Pages() {
	const { width } = useThree((state) => state.viewport);

	return (
		<>
			<Page position={[width * 0, 0, 0]} urls={[
				'/img/gym.img/pexels-cavemantraining-682087.jpg',
				'/img/bodybuilders/pexels-gabflicks-13122470.jpg',
				'/img/gym.instruments/pexels-cottonbro-4325437.jpg'
			]} />
			<Page position={[width * 1, 0, 0]} urls={[
				'/img/gym.center/pexels-anush-1431283.jpg',
				'/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
				'/img/gym.img/pexels-jonathanborba-3076513.jpg'
			]} />
			<Page position={[width * 2, 0, 0]} urls={[
				'/img/gym.instruments/pexels-ivan-s-4162547.jpg',
				'/img/bodybuilders/pexels-leonmart-1552108.jpg',
				'/img/gym.center/pexels-leonmart-1552242.jpg'
			]} />
			<Page position={[width * 3, 0, 0]} urls={[
				'/img/gym.img/pexels-olly-864990.jpg',
				'/img/bodybuilders/pexels-mralpha-13451637.jpg',
				'/img/gym.instruments/pexels-tima-miroshnichenko-5327505.jpg'
			]} />
			<Page position={[width * 4, 0, 0]} urls={[
				'/img/gym.center/pexels-mastercowley-1153369.jpg',
				'/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
				'/img/gym.img/pexels-pixabay-416778.jpg'
			]} />
		</>
	);
}

// Check if WebGL is available
function isWebGLAvailable(): boolean {
	if (typeof window === 'undefined') return false;
	try {
		const canvas = document.createElement('canvas');
		const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		return !!gl;
	} catch (e) {
		return false;
	}
}

export default function FiberContainer() {
	const [webGLAvailable, setWebGLAvailable] = useState(false);

	useEffect(() => {
		setWebGLAvailable(isWebGLAvailable());
	}, []);

	if (!webGLAvailable) {
		return (
			<div className="threeJSContainer" style={{ marginTop: '100px', width: '100%', height: '512px' }}>
				{/* Fallback content when WebGL is not available */}
			</div>
		);
	}

	return (
		<div className="threeJSContainer" style={{ marginTop: '100px', width: '100%', height: '512px' }}>
			<Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
				<Suspense fallback={null}>
					<ScrollControls infinite horizontal damping={4} pages={4} distance={1}>
						<Scroll>
							<Pages />
						</Scroll>
					</ScrollControls>
					<Preload />
				</Suspense>
			</Canvas>
		</div>
	);
}
