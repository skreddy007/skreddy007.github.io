const STORAGE_KEY = 'theme';
const NAV_HEADING_GAP = 16;

function readStoredTheme(): 'light' | 'dark' | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark') return stored;
	} catch {
		/* private mode */
	}
	const match = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
	return match ? (match[1] as 'light' | 'dark') : null;
}

function writeStoredTheme(theme: 'light' | 'dark') {
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		/* private mode */
	}
	document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function preferredTheme(): 'light' | 'dark' {
	return readStoredTheme() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function syncToggles(theme: 'light' | 'dark') {
	const isDark = theme === 'dark';
	document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((button) => {
		button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
	});
}

function applyTheme(theme: 'light' | 'dark', persist: boolean) {
	document.documentElement.setAttribute('data-theme', theme);
	if (persist) writeStoredTheme(theme);
	syncToggles(theme);
}

function bindTheme() {
	applyTheme(preferredTheme(), false);
	document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((button) => {
		button.addEventListener('click', () => {
			const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
			applyTheme(next, true);
		});
	});

	const media = window.matchMedia('(prefers-color-scheme: dark)');
	const onChange = (event: MediaQueryListEvent) => {
		if (readStoredTheme()) return;
		applyTheme(event.matches ? 'dark' : 'light', false);
	};
	media.addEventListener('change', onChange);
}

function closedNavHeight(): number {
	const nav = document.querySelector('nav.navbar');
	const menu = document.getElementById('navbar-menu');
	if (menu?.classList.contains('in')) {
		const header = document.querySelector('.navbar-header');
		return header?.getBoundingClientRect().height ?? 0;
	}
	return nav?.getBoundingClientRect().height ?? 0;
}

function headingLead(): number {
	const section = document.getElementById('about');
	const heading = section?.querySelector(':scope > .section-heading');
	if (!section || !heading) return 0;
	const sectionTop = section.getBoundingClientRect().top + window.scrollY;
	const headingTop = heading.getBoundingClientRect().top + window.scrollY;
	return Math.max(0, headingTop - sectionTop);
}

function scrollPadding(): number {
	return closedNavHeight() + NAV_HEADING_GAP;
}

function easeInOutExpo(elapsed: number, start: number, change: number, duration: number): number {
	if (elapsed === 0) return start;
	if (elapsed === duration) return start + change;
	let t = elapsed / (duration / 2);
	if (t < 1) return (change / 2) * 2 ** (10 * (t - 1)) + start;
	t -= 1;
	return (change / 2) * (-(2 ** (-10 * t)) + 2) + start;
}

function scrollToY(top: number, duration: number, done?: () => void) {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const start = window.scrollY;
	const change = top - start;
	const dur = reduce ? 0 : duration;
	if (dur === 0) {
		window.scrollTo(0, top);
		done?.();
		return;
	}
	const t0 = performance.now();
	const frame = (now: number) => {
		const t = Math.min(dur, now - t0);
		window.scrollTo(0, easeInOutExpo(t, start, change, dur));
		if (t < dur) requestAnimationFrame(frame);
		else done?.();
	};
	requestAnimationFrame(frame);
}

function scrollToSection(href: string) {
	const target = document.querySelector(href);
	if (!target) return;
	const heading = target.querySelector('.section-heading');
	const anchor = heading ?? target;
	const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
	const top = Math.max(0, Math.round(anchorTop - scrollPadding()));
	scrollToY(top, 1200, updateScrollspy);
}

function updateScrollspy() {
	const offset = Math.max(1, scrollPadding() - headingLead() + 4);
	const links = [...document.querySelectorAll<HTMLAnchorElement>('li.smooth-menu a')];
	const scrollPos = window.scrollY + offset;
	let current: HTMLAnchorElement | null = null;
	for (const link of links) {
		const id = link.getAttribute('href');
		if (!id?.startsWith('#')) continue;
		const section = document.querySelector(id);
		if (!section) continue;
		const top = section.getBoundingClientRect().top + window.scrollY;
		if (top <= scrollPos) current = link;
	}
	const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
	if (atBottom && links.length) current = links[links.length - 1];
	for (const link of links) {
		link.parentElement?.classList.toggle('active', link === current);
	}
}

function setMenuOpen(open: boolean) {
	const menu = document.getElementById('navbar-menu');
	const toggle = document.querySelector<HTMLButtonElement>('.navbar-toggle');
	if (!menu || !toggle) return;
	menu.classList.toggle('in', open);
	toggle.classList.toggle('is-open', open);
	toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
	toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function bindNavigation() {
	const menu = document.getElementById('navbar-menu');
	const toggle = document.querySelector<HTMLButtonElement>('.navbar-toggle');
	toggle?.addEventListener('click', () => {
		setMenuOpen(!menu?.classList.contains('in'));
	});

	document.querySelectorAll<HTMLAnchorElement>('li.smooth-menu a').forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const href = link.getAttribute('href');
			if (!href) return;
			if (menu?.classList.contains('in')) {
				setMenuOpen(false);
				requestAnimationFrame(() => scrollToSection(href));
				return;
			}
			scrollToSection(href);
		});
	});

	updateScrollspy();
	window.addEventListener('load', updateScrollspy);
	let resizeTimer = 0;
	window.addEventListener('resize', () => {
		window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(updateScrollspy, 150);
	});
}

function bindScrollTop() {
	const button = document.querySelector<HTMLElement>('.return-to-top');
	if (!button) return;
	const sync = () => {
		button.classList.toggle('is-visible', window.scrollY > 600);
		updateScrollspy();
	};
	window.addEventListener('scroll', sync, { passive: true });
	sync();
	button.addEventListener('click', () => {
		scrollToY(0, 1500, updateScrollspy);
	});
}

bindTheme();
bindNavigation();
bindScrollTop();
