import storee from 'storee';
import nanoid from 'nanoid';
import histore from 'histore';

const ANONYMOUS_ANALYTICS_CLIENT_ID = 'ANONYMOUS_ANALYTICS_CLIENT_ID';

const loadGoogleAnalytics = () => {
	window.GoogleAnalyticsObject = 'ga';
	// eslint-disable-next-line
	window.ga || (window.ga = function() {
		// eslint-disable-next-line
		(window.ga.q = window.ga.q || []).push(arguments);
	});
	window.ga.l = +(new Date());
	const scriptElement = document.createElement('script');
	const firstScript = document.scripts[0];
	scriptElement.src = 'https://www.google-analytics.com/analytics.js';
	firstScript.parentNode.insertBefore(scriptElement, firstScript);

	return window.ga;
};

const supportsLocalStorage = (() => {
	try {
		localStorage.setItem('TEST_LOCAL_STORAGE', 'TEST_LOCAL_STORAGE');
		localStorage.removeItem('TEST_LOCAL_STORAGE');
		return true;
	} catch (error) {
		return false;
	}
})();

// We can do this because both `storee` and `histore`
// have a .set() and .get() method
//
// localStorage should be supported everywhere,
// but some privacy settings might disable it
// and we can then use the History API as a hacky way
// to identify user sessions
const store = supportsLocalStorage ? storee() : histore();

const getClientId = () => {
	const existing = store.get(ANONYMOUS_ANALYTICS_CLIENT_ID);

	if (existing) {
		return existing;
	}

	try {
		return nanoid();
	} catch (error) {
		// The Web Crypto API is probably not supported
		// Return a LEGACY-TIMESTAMP id
		return `LEGACY-${(new Date()).getTime()}`;
	}
};

function anonymousAnalytics(ua) {
	if (typeof ua !== 'string' || ua.toUpperCase().indexOf('UA-') !== 0) {
		throw new Error('Expected a valid property ID');
	}

	const ga = loadGoogleAnalytics();

	ga('create', ua, {
		storage: 'none',
		storeGac: false,
		clientId: getClientId(),
	});

	// eslint-disable-next-line
	ga(function whenTrackerReady(tracker) {
		store.set(ANONYMOUS_ANALYTICS_CLIENT_ID, tracker.get('clientId'));
	});

	ga('set', 'anonymizeIp', true);
	ga('send', 'pageview');
}

export default anonymousAnalytics;
