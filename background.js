function setFavicon(tab) {
	if (typeof tab.favIconUrl === 'undefined') {
		browser.tabs.executeScript(tab.id, {
			file: 'inject.js',
		})
	}
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status && changeInfo.status === 'complete') {
		setFavicon(tab)
	}
})
browser.tabs.query({status: 'complete'}).then(tabs => tabs.forEach(setFavicon))
