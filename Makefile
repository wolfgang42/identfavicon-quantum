all: IdentFavIcon.xpi

src/inject.js: src/blockies.js src/inject-core.js
	cat src/blockies.js src/inject-core.js >src/inject.js

SRCS := src/inject.js src/background.js src/manifest.json \
        src/options.html src/options.js

IdentFavIcon.xpi: $(SRCS)
	cd src && zip -r ../IdentFavIcon.xpi -- .
