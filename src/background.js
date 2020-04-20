async function inject(tab) {
	return await browser.tabs.executeScript(tab.id, {
		file: 'inject.js',
	})
}

async function setFavicon(tab) {
	try {
		if (typeof tab.favIconUrl === 'undefined') {
			await inject(tab);
		} else if (/^https?:\/\/[^/]+\/favicon\.ico$/.test(tab.favIconUrl)) {
			// Workaround when loading never-before-seen domains:
			// If there's no cached favicon for a domain,
			// Firefox blindly sets the tab's favIconUrl to /favicon.ico without knowing if it exists.
			// We therefore fetch it ourselves (requesting the cached version if possible)
			// and if the request does not succeed, then set the favicon to an identicon.
			const resp = await fetch(tab.favIconUrl, { cache: 'force-cache' });
			if (!resp.ok) {
				await inject(tab);
			}
		}
	} catch (exc) {
		console.log('setFavicon:', exc);
	}
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status && changeInfo.status === 'complete') {
		setFavicon(tab)
	}
})
// browser.storage.onChanged.addListener((changes) => {
// 	// TODO: how to update existing favicon here?
// });
browser.tabs.query({ status: 'complete' }).then(tabs => tabs.forEach(setFavicon))
