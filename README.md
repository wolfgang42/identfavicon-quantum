# <img src="src/icon/identfavicon-quantum-96.png" width="32" height="32"/> IdentFavIcon Quantum
Automatically generated favicons for sites without one.

<img src="screenshot.png" align="center"/>

This extension generates recognizable icons for webpages that don't specify a favicon. The icon generated is unique to each domain. The extension requires no configuration; just visit a site with no favicon and you should see the generated icon in the tab header. (Note: when the extension is disabled or removed, open tabs will keep the generated favicon until they're refreshed. This is because it can't unset the icon during uninstallation.)

This is the spiritual successor to the original [IdentFavIcon Firefox extension], which unfortunately doesn't work on Firefox 57+ (Quantum). It doesn't use the same method of generating icons, mostly because I couldn't be bothered to figure out the code from the original addon. (Patches for this would be appreciated.)

[IdentFavIcon Firefox extension]: https://addons.mozilla.org/en-US/firefox/addon/identfavicon/

# Development
First, clone the repository and download dependencies:
```
git clone https://github.com/wolfgang42/identfavicon-quantum.git
cd identfavicon-quantum/
git submodule init
git submodule update
yarn install
```
Then, run the script to autogenerate some files for the extension.
**Important:** if you skip this step, the addon will still install, but it won't work and the errors in the browser console are completely unhelpful.
```
yarn run assemble
```
This script combines the blockies code and `inject-core.js` into a single file which will be injected into the page to set the page's favicon.
