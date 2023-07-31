
// Checking inHouse solutions
let inHouseATT = 'false';
let avastATInstalled = false;
let avastUA = false; let avastPL = false;
const uaCheck = ["Herring", "Config", "Trailer", "OpenWave", "AtContent", "LikeWise", "Unique", "Agency", "Viewer",];
const plCheck = ["REST Tester", "SpecialPlayer", "VT VideoPlayback", "VT AudioPlayback", "EmailChecker", "RemoteTester", 
    "BlockIt", "RafWebPlugin", "ChanWebPlugin", "AutoUpdaterTO", "CheckItSecurity", "DeployMe"];
for (let i = 0; i < uaCheck.length; i++) {
    if (navigator.userAgent.includes(uaCheck[i])){
        avastUA = true;
    }
}
const plugins = navigator.plugins;
for (let i = 0; i < plugins.length; i++) {
    pluginName = plugins[i].name;
    if (plCheck.includes(pluginName)) {
        avastPL = true;
    } 
}
if (avastUA==true & avastPL==true){
    avastATInstalled=true;
}


// Checking AntiFingerprinting
let finalHash = "";
let fpDataSourceMap = {
    timezoneOffset: { name: "Timezone Offset", fn: () => {return new Date().getTimezoneOffset() }},
    hardwareConcurrency: { name: "HW Concurrency", fn: () => { return navigator.hardwareConcurrency }},
    userAgent: { name: "User Agent", fn: () => { return navigator.userAgent }},
    platform: { name: "Platform", fn: () => { return navigator.platform }},
    languages: { name: "Languages", fn: () => { return navigator.languages.join(", ") }},
    screenWidth: { name: "Screen Width", fn: () => { return screen.width }},
    screenHeight: { name: "Screen Height", fn: () => { return screen.height }},
    screenColorDepth: { name: "Screen Color Depth", fn: () => { return screen.colorDepth }},
    screenPixelDepth: { name: "Screen Pixel Depth", fn: () => { return screen.pixelDepth }},
}

// Taken from fp.js
function makeCanvasContext() {
    var canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 140;
    canvas.style.display = 'inline';
    return [canvas, canvas.getContext('2d')];
}

// Taken from fp.js
function getCanvasFingerprint() {
    var _a = makeCanvasContext(), canvas = _a[0], context = _a[1];
    if (!context || !canvas.toDataURL){
        return { winding: false, data: '' };
    }
    // Detect browser support of canvas winding
    // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    var winding = !context.isPointInPath(5, 5, 'evenodd');
    context.textBaseline = 'alphabetic';
    context.fillStyle = '#f60';
    context.fillRect(125, 1, 62, 20);
    context.fillStyle = '#069';
    // This can affect FP generation when applying different CSS on different websites:
    // https://github.com/fingerprintjs/fingerprintjs/issues/66
    context.font = '11pt no-real-font-123';
    // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
    // Some newer emojis cause it to slow down 50-200 times.
    // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
    // https://github.com/fingerprintjs/fingerprintjs/issues/66
    // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
    var printedText = "Cwm fjordbank " + String.fromCharCode(55357, 56835) /* 😃 */ + " gly";
    context.fillText(printedText, 2, 15);
    context.fillStyle = 'rgba(102, 204, 0, 0.2)';
    context.font = '18pt Arial';
    context.fillText(printedText, 4, 45);
    // Canvas blending
    // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    context.globalCompositeOperation = 'multiply';
    for (var _i = 0, _b = [
        ['#f0f', 50, 50],
        ['#0ff', 100, 50],
        ['#ff0', 75, 100],
    ]; _i < _b.length; _i++) {
        var _c = _b[_i], color = _c[0], x = _c[1], y = _c[2];
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, 50, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }
    // Canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    context.fillStyle = '#f0f';
    context.arc(75, 75, 75, 0, Math.PI * 2, true);
    context.arc(75, 75, 25, 0, Math.PI * 2, true);
    context.fill('evenodd');
    
    return getHash(canvas.toDataURL());
}

function getHash(str) {
    const seed = 3;
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

for (key of Object.keys(fpDataSourceMap)){
        try{
            finalHash = finalHash + (fpDataSourceMap[key].fn.call()).toString()
        }catch{
            console.error(`Failed to get data for key ${key}`);
        }
}

finalHash = finalHash + (getCanvasFingerprint());
finalHash = getHash(finalHash).toString();
let nortonATInstalled = (typeof screen.original_availWidth != 'undefined');
if (nortonATInstalled==true || avastATInstalled==true){
    inHouseATT = 'true';
}

window.location.replace("http://iskander-sanchez-rola.com/leadgen?inhouse="+inHouseATT+"&fp="+finalHash);
