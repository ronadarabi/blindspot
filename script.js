/* DRAGGING GRAPHICS */ 
const graphicsLayer = document.getElementById("graphics");
const graphics = document.querySelectorAll(".graphic");
let highestZIndex = 10;

graphics.forEach((graphic) => {
    makeDraggable(graphic);
});

function makeDraggable(graphic) {

    let isDragging = false;
    let hasMoved = false;

    let startX;
    let startY;

    let startLeft;
    let startTop;

    graphic.addEventListener("pointerdown", (event) => {

        if (event.button !== 0) return;

        isDragging = true;
        hasMoved = false;

        // store the starting positions 
        startX = event.clientX;
        startY = event.clientY;

        startLeft = graphic.offsetLeft;
        startTop = graphic.offsetTop;
        
        // track pointer
        graphic.setPointerCapture(event.pointerId);

        // keep dragged img as top layer
        highestZIndex++;

        graphic.style.zIndex = highestZIndex;
    });

    graphic.addEventListener("pointermove", (event) => {

        if (!isDragging) return;

        // calculate change in position
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        // check how much has moved 
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 6) {
            hasMoved = true;
        }

        if (!hasMoved) return;

        // update css position, making sure the graphics dont go out of bounds
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        const label = graphic.querySelector(".graphic-label");
        const labelHeight = label.offsetHeight;

        const maxLeft = graphicsLayer.clientWidth - graphic.offsetWidth;
        const maxTop = graphicsLayer.clientHeight - graphic.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(labelHeight, Math.min(newTop, maxTop));

        graphic.style.left =
            `${(newLeft / graphicsLayer.clientWidth) * 100}%`;

        graphic.style.top =
            `${(newTop / graphicsLayer.clientHeight) * 100}%`;

        graphic.style.right = "auto";

        // lines to eye
        updateConnections();
    });

    graphic.addEventListener("pointerup", () => {
        isDragging = false;
    });

    graphic.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    graphic.addEventListener("click", (event) => {

        if (hasMoved && event.detail !== 0) {
            event.preventDefault();
        }

        hasMoved = false;
    });
}


/* EYE LINES */ 
const eyeAnchor = document.getElementById("eye-anchor");
const connections = document.getElementById("connections");
function updateConnections() {
     if (window.matchMedia("(max-width: 1024px)").matches) {
        return;
    }

    const svgRect = connections.getBoundingClientRect();
    const eyeRect = eyeAnchor.getBoundingClientRect();

    const eyeX = eyeRect.left + eyeRect.width / 2 - svgRect.left;
    const eyeY = eyeRect.top + eyeRect.height / 2 - svgRect.top;

    graphics.forEach((graphic) => {

        const graphicRect = graphic.getBoundingClientRect();

        const corner = graphic.dataset.corner;

        const graphicX = corner.includes("right")
            ? graphicRect.right - svgRect.left
            : graphicRect.left - svgRect.left;

        const graphicY = corner.includes("bottom")
            ? graphicRect.bottom - svgRect.top
            : graphicRect.top - svgRect.top;

        const line = document.getElementById(`line-${graphic.id}`);

        line.setAttribute("x1", eyeX);
        line.setAttribute("y1", eyeY);

        line.setAttribute("x2", graphicX);
        line.setAttribute("y2", graphicY);
    });
}

window.addEventListener("load", updateConnections);
window.addEventListener("resize", updateConnections);

updateConnections();

// reset button 
const resetButton = document.getElementById("reset-layout");
resetButton.addEventListener("click", () => {

    graphics.forEach((graphic) => {

        graphic.style.left = "";
        graphic.style.top = "";
        graphic.style.right = "";
        graphic.style.zIndex = "";

    });

    highestZIndex = 10;

    updateConnections();
});
