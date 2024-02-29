const baseStyle = " flex text-md items-center h-18 w-48 rounded-lg fixed top-4 right-4 p-4 transition ease-in-out duration-300"
const successIcon = "<svg class='w-6 h-6' xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill=\"#63E6BE\" d=\"M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z\"/></svg>"
const errorIcon = "<svg class='h-6 w-6' xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill=\"#fc0303\" d=\"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z\"/></svg>"
const infoIcon = "<svg class='h-6 w-6' xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill=\"#3d52e7\" d=\"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z\"/></svg>"
function getIconType(type: string) {

    switch (type) {
        case 'success':
            return successIcon;
        case 'error':
            return errorIcon;
        case 'info':
            return infoIcon;
        default:
            return infoIcon;
    }
}
export function tipMessage(msg: string, type: string = 'success', duration: number = 3000) {

    const tipContainer = document.createElement('div');
    tipContainer.className = "text-black bg-white" + baseStyle;
    tipContainer.innerHTML = getIconType(type);

    const tip = document.createElement('div');
    tip.className = `ml-4`
    tip.innerHTML = msg;
    tipContainer.appendChild(tip)
    document.body.appendChild(tipContainer);

    setTimeout(() => {
        document.body.removeChild(tipContainer);
    }, duration);

    return tip;
}