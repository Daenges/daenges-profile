const wp = document.getElementById("desktop");
const windowList = [];
var currentZlvl = 10;

function addContentToScreen(content, id) {
    fullId = id + "-window";
    
    if (!windowList.includes(fullId)) {
        windowList.push(fullId);
        wp.innerHTML += content;
        
        var windowhtml = document.getElementById(fullId);
        windowhtml.style.top = `${Math.max((window.innerHeight - windowhtml.offsetHeight) / 2, 0)}px`;
        windowhtml.style.left = `${Math.max((window.innerWidth - windowhtml.offsetWidth) / 2, 0)}px`;

        windowList.forEach(windowID => {
            makeElementDraggable(document.getElementById(windowID));
        });
    }
}

function makeElementDraggable(elmnt) {
    var dragPosStart = { X: 0, Y: 0 };

    document.getElementById(elmnt.id + "-header").addEventListener("mousedown", dragMouseDown);
    elmnt.style.zIndex = currentZlvl++;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        if(currentZlvl-1 != elmnt.style.zIndex)
            elmnt.style.zIndex = currentZlvl++;
        
        dragPosStart = { X: e.clientX, Y: e.clientY };
        document.addEventListener("mouseup", closeDragElement);
        document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        var dragPosDifference = { X: dragPosStart.X - e.clientX, Y: dragPosStart.Y - e.clientY };
        dragPosStart = { X: e.clientX, Y: e.clientY };

        elmnt.style.top = `${Math.max(elmnt.offsetTop - dragPosDifference.Y, 0)}px`;
        elmnt.style.left = `${Math.max(elmnt.offsetLeft - dragPosDifference.X,0)}px`;
    }

    function closeDragElement() {
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
    }
}

function removeWindow(id) {
    const index = windowList.indexOf(id);
    if(index > -1) {
        windowList.splice(index, 1);
        document.getElementById(id).remove();
    }
}