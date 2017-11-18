browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status && changeInfo.status === 'complete' && typeof tab.favIconUrl === 'undefined') {
		browser.tabs.executeScript(tabId, {
			file: 'inject.js',
		})
	}
})
