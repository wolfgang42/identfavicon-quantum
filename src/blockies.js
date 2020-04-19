// Derived from https://github.com/dylanseago/blockies/blob/86c3e71ec33a31424ac8dcae449ec9c09c4ab3cb/blockies.js
(function () {
    // The random number is a js implementation of the Xorshift PRNG
    // Xorshift: [x, y, z, w] 32 bit values

    function seedrand(state, seed) {
        for (var i = 0; i < state.length; i++) {
            state[i] = 0;
        }
        for (var i = 0; i < seed.length; i++) {
            state[i % 4] = ((state[i % 4] << 5) - state[i % 4]) + seed.charCodeAt(i);
        }
    }

    function rand(state) {
        // based on Java's String.hashCode(), expanded to 4 32bit values
        var t = state[0] ^ (state[0] << 11);

        state[0] = state[1];
        state[1] = state[2];
        state[2] = state[3];
        state[3] = (state[3] ^ (state[3] >> 19) ^ t ^ (t >> 8));

        return (state[3] >>> 0) / ((1 << 31) >>> 0);
    }

    function createColor(state) {
        //saturation is the whole color spectrum
        var h = Math.floor(rand(state) * 360);
        //saturation goes from 40 to 100, it avoids greyish colors
        var s = ((rand(state) * 60) + 40) + '%';
        //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
        var l = ((rand(state) + rand(state) + rand(state) + rand(state)) * 25) + '%';

        var color = 'hsl(' + h + ',' + s + ',' + l + ')';
        return color;
    }

    function createImageData(state, size) {
        var width = size; // Only support square icons for now
        var height = size;

        var dataWidth = Math.ceil(width / 2);
        var mirrorWidth = width - dataWidth;

        var data = [];
        for (var y = 0; y < height; y++) {
            var row = [];
            for (var x = 0; x < dataWidth; x++) {
                // TODO: configurable probability
                // this makes foreground and background color to have a 43% (1/2.3) probability
                // spot color has 13% chance
                row[x] = Math.floor(rand(state) * 2.3);
            }
            var r = row.slice(0, mirrorWidth);
            r.reverse();
            row = row.concat(r);

            for (var i = 0; i < row.length; i++) {
                data.push(row[i]);
            }
        }

        return data;
    }

    function buildOpts(opts) {
        var newOpts = {};

        newOpts.seed = opts.seed || Math.floor((Math.random() * Math.pow(10, 16))).toString(16);

        newOpts.state = new Array(4);
        seedrand(newOpts.state, newOpts.seed);

        // Modification: Call createColor() unconditionally to get a consistent icon
        // regardless of the user-supplied options.
        const color = createColor(newOpts.state);
        const bgcolor = createColor(newOpts.state);
        const spotcolor = createColor(newOpts.state);

        newOpts.size = opts.size || 8;
        // Modification: icon_size is used instead of size * scale to avoid blurred icon
        newOpts.icon_size = opts.icon_size || opts.size * 3;
        if (newOpts.icon_size < newOpts.size) {
            newOpts.icon_size = newOpts.size;
        }
        newOpts.color = opts.color || color;
        newOpts.bgcolor = opts.bgcolor || bgcolor;
        newOpts.spotcolor = opts.spotcolor || spotcolor;

        return newOpts;
    }

    function renderIcon(opts, canvas) {
        opts = buildOpts(opts || {});
        var imageData = createImageData(opts.state, opts.size);
        var width = Math.sqrt(imageData.length);

        canvas.width = canvas.height = opts.icon_size;
        var block_width = Math.floor(opts.icon_size / opts.size);
        var padding = Math.floor((opts.icon_size - opts.size * block_width) / 2);

        var cc = canvas.getContext('2d');
        cc.fillStyle = opts.bgcolor;
        cc.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < imageData.length; i++) {

            // if data is 0, leave the background
            if (imageData[i]) {
                var row = Math.floor(i / width);
                var col = i % width;

                // if data is 2, choose spot color, if 1 choose foreground
                cc.fillStyle = (imageData[i] == 1) ? opts.color : opts.spotcolor;

                cc.fillRect(
                    padding + col * block_width, padding + row * block_width,
                    block_width, block_width
                );
            }
        }
        return canvas;
    }

    function createIcon(opts) {
        var canvas = document.createElement('canvas');

        renderIcon(opts, canvas);

        return canvas;
    }

    var api = {
        create: createIcon,
        render: renderIcon
    };

    if (typeof module !== "undefined") {
        module.exports = api;
    }
    if (typeof window !== "undefined") {
        window.blockies = api;
    }

})();
