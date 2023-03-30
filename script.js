// CANVAS
const canvas = document.getElementById("test"),
    context = canvas.getContext("2d");

// BUTTONS
const btnClear = document.getElementById("clear"),
    btnSend = document.getElementById("send"),
    imgResult = document.getElementById("img-test");

// TOUCHES ARRAY
const activeTouches = [];

// ---MOUSE IMPLEMENTATION---
// VALIDATOR TO CHECK WETHER WE'RE DRAWING OR NOT
let drawing = false,
    x = 0,
    y = 0;

canvas.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    drawing = true;
});

canvas.addEventListener("mouseup", (e) => {
    drawPath(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    drawing = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    drawPath(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
});

// ---TOUCH IMPLEMENTATION---
canvas.addEventListener("touchstart", (e) => {
    const touches = e.changedTouches;
    x = canvas.getBoundingClientRect().left;
    y = canvas.getBoundingClientRect().top;

    for (let touch of touches)
        activeTouches.push(touch);
});

canvas.addEventListener("touchend", (e) => {
    const touches = e.changedTouches;

    for (let touch of touches) {
        if (findTouch(touch.identifier) < 0)
            continue;

        context.lineWidth = 1;
        context.fillStyle = "black";
        activeTouches.splice(findTouch(touch.identifier), 1);
    }
});

canvas.addEventListener("touchcancel", (e) => {
    const touches = e.changedTouches;

    for (let touch of touches) {
        activeTouches.splice(findTouch(touch.identifier), 1);
    }
});

canvas.addEventListener("touchmove", (e) => {
    const touches = e.changedTouches;

    for (let touch of touches) {
        const idActive = findTouch(touch.identifier);
        if (idActive < 0)
            continue;

        drawPath(context,
            activeTouches[idActive].clientX - x,
            activeTouches[idActive].clientY - y,
            touch.clientX - x,
            touch.clientY - y);
        activeTouches.splice(idActive, 1, touch);
    }
});

// ---BUTTONS FUNCTIONING---
// CLEAR CANVAS
btnClear.addEventListener("click", (e) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

// TRANSFORM CANVAS CONTENT INTO IMAGE AND DOWNLOAD IT
btnSend.addEventListener("click", (e) => {
    const b64 = canvas.toDataURL(),
        file = base64toImage(b64);
    imgResult.href = URL.createObjectURL(file);
    imgResult.download = file.name;
    imgResult.click();
});

// ---GENERAL FUNCTIONS---
// RECIEVE: 2D CONTEXT, OLD X, OLD Y, NEW X, NEW Y
const drawPath = (context, x1, y1, x2, y2) => {
    context.beginPath();
    // COLOR AND WIDTH
    context.strokeStyle = "black";
    context.lineWidth = 1;
    // LOCATION TO DRAW THE LINE
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
};

// BASE64 TO IMG FILE CONVERTER
const base64toImage = (b64) => {
    let arr = b64.split(','),
        type = arr[0].slice(arr[0].indexOf(':') + 1, arr[0].indexOf(';')),
        binaryStr = atob(arr[1]),
        uint8 = new Uint8Array(binaryStr.length);

    for (let i = 0; i < binaryStr.length; i++) {
        uint8[i] = binaryStr.charCodeAt(i);
    }

    return new File([uint8], "test", { type: type });
}

// FIND TOUCH BY ID
const findTouch = (touchId) => {
    for (let touch of activeTouches) {
        if (touch.identifier !== touchId)
            continue;

        return touch.identifier;
    }

    return -1;
}