function saveOptions(e) {
    e.preventDefault();
    const options = {
        block_size: parseInt(document.querySelector("#id_block_size").value),
        fg_color: document.querySelector("#id_fg_color").value,
        bg_color: document.querySelector("#id_bg_color").value,
        spot_color: document.querySelector("#id_spot_color").value,
    };
    browser.storage.local.set(options);
}

async function restoreOptions() {
    const options = await browser.storage.local.get();
    document.querySelector("#id_block_size").value = options.block_size || 8;
    document.querySelector("#id_fg_color").value = options.fg_color || '';
    document.querySelector("#id_bg_color").value = options.bg_color || '';
    document.querySelector("#id_spot_color").value = options.spot_color || '';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
