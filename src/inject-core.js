(async () => {
	// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1417721 :
	// check if the document already declares a <link rel="icon">
	// and don't inject ours if it does.
	let link = document.querySelector('link[rel~="icon"]');
	if (link && !link.getAttribute('data-is-identfavicon')) {
		return;
	}

	// Another workaround.
	const probe_url = new URL("/favicon.ico", document.baseURI).href;
	const probe_resp = await fetch(probe_url, { cache: 'force-cache' });
	if (probe_resp.ok) {
		return;
	}

	const options = await browser.storage.local.get();
	const theIcon = blockies.create({
		seed: document.location.host,
		size: options.block_size,
		color: options.fg_color,
		bgcolor: options.bg_color,
		spotcolor: options.spot_color,
	});

	link = link || document.createElement('link')
	link.type = 'image/x-icon'
	link.rel = 'shortcut icon'
	link.href = theIcon.toDataURL('png')
	link.setAttribute('data-is-identfavicon', 'true');
	link.setAttribute('data-explanation', 'Injected by IdentFavIcon Quantum extension')
	document.head.appendChild(link)
})();

undefined // https://stackoverflow.com/a/44774834
