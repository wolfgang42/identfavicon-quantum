// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1417721 :
// check if the document already declares a <link rel="icon">
// and don't inject ours if it does.
if (!document.querySelector('link[rel~="icon"]')) {
	const theIcon = blockies.create({
		seed: document.location.host,
	})

	const link = document.createElement('link')
	link.type='image/x-icon'
	link.rel='shortcut icon'
	link.href=theIcon.toDataURL('png')
	link.setAttribute('data-explanation', 'Injected by IdentFavIcon Quantum extension')
	document.head.appendChild(link)
}

undefined // https://stackoverflow.com/a/44774834
