const wp = document.getElementById("desktop");
const windowList = [];
var currentZlvl = 10;

// Gets raw HTML as content and the corresponding id
function addContentToScreen(content, id) {
    fullId = id + "-window";
    
    // Check if we have not opened this window yet
    if (!windowList.includes(fullId)) {
        windowList.push(fullId);
        wp.innerHTML += content;
        
        // Set initial coordinates, prevent clipping out of the browser window
        var windowhtml = document.getElementById(fullId);
        windowhtml.style.top = `${Math.max((window.innerHeight - windowhtml.offsetHeight) / 2, 0)}px`;
        windowhtml.style.left = `${Math.max((window.innerWidth - windowhtml.offsetWidth) / 2, 0)}px`;

        // Add responsive functions to created window
        windowList.forEach(windowID => {
            makeElementDraggable(document.getElementById(windowID));
        });
    }
}

function makeElementDraggable(elmnt) {
    var dragPosStart = { X: 0, Y: 0 };

    document.getElementById(elmnt.id + "-header").addEventListener("mousedown", dragMouseDown);
    elmnt.style.zIndex = currentZlvl++;

    // Start tracking mouse movement if click is hold on the header
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        if(currentZlvl-1 != elmnt.style.zIndex)
            elmnt.style.zIndex = currentZlvl++;
        
        dragPosStart = { X: e.clientX, Y: e.clientY };
        document.addEventListener("mouseup", closeDragElement);
        document.addEventListener("mousemove", elementDrag);
    }

    // Track the mouse position, calculate the offset and move the window relative to it
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        var dragPosDifference = { X: dragPosStart.X - e.clientX, Y: dragPosStart.Y - e.clientY };
        dragPosStart = { X: e.clientX, Y: e.clientY };

        elmnt.style.top = `${Math.max(elmnt.offsetTop - dragPosDifference.Y, 0)}px`;
        elmnt.style.left = `${Math.max(elmnt.offsetLeft - dragPosDifference.X,0)}px`;
    }

    // User stopped dragging the window, remove functions
    function closeDragElement() {
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
    }
}

// User closed the window
function removeWindow(id) {
    const index = windowList.indexOf(id);
    if(index > -1) {
        windowList.splice(index, 1);
        document.getElementById(id).remove();
    }
}