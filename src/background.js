function inject(tab) {
	browser.tabs.executeScript(tab.id, {
		file: 'inject.js',
	})
}

function setFavicon(tab) {
	if (typeof tab.favIconUrl === 'undefined') {
		inject(tab)
	} else if (/^https?:\/\/[^/]+\/favicon\.ico$/.test(tab.favIconUrl)) {
		// Workaround when loading never-before-seen domains:
		// If there's no cached favicon for a domain,
		// Firefox blindly sets the tab's favIconUrl to /favicon.ico without knowing if it exists.
		// We therefore fetch it ourselves (requesting the cached version if possible)
		// and if the request does not succeed, then set the favicon to an identicon.
		fetch(tab.favIconUrl, {cache: 'force-cache'}).then(r => {
			if (!r.ok) inject(tab)
		})
	}
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status && changeInfo.status === 'complete') {
		setFavicon(tab)
	}
})
browser.tabs.query({status: 'complete'}).then(tabs => tabs.forEach(setFavicon))
