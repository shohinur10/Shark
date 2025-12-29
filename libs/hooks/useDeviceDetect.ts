import { useEffect, useState } from 'react';

const useDeviceDetect = (): string => {
	// Initialize with 'desktop' to match server-side rendering
	const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Mark as mounted (client-side only)
		setMounted(true);
		
		// Only check device on client-side
		if (typeof window !== 'undefined') {
			const userAgent = navigator.userAgent;
			const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
			setDevice(isMobile ? 'mobile' : 'desktop');
		}
	}, []);

	// Return 'desktop' during SSR to match initial render
	return mounted ? device : 'desktop';
};

export default useDeviceDetect;
