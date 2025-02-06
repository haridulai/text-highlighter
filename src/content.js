document.addEventListener("mouseup", function(event) {
    let selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        showHighlightMenu(event.pageX, event.pageY, selection);
    }
});

function showHighlightMenu(x, y, selectedText) {
    let menu = document.getElementById("highlightMenu");
    if (!menu) {
        menu = document.createElement("div");
        menu.id = "highlightMenu";
        menu.innerHTML = `
            <button class="highlight-btn" style="background-color: yellow" onclick="highlightText('yellow')">Yellow</button>
            <button class="highlight-btn" style="background-color: pink" onclick="highlightText('pink')">Pink</button>
            <button class="highlight-btn" style="background-color: lightblue" onclick="highlightText('lightblue')">Blue</button>
            <button onclick="copyText()">Copy</button>
        `;
        document.body.appendChild(menu);
    }
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.style.display = "block";

    document.addEventListener("click", function hideMenu(e) {
        if (!menu.contains(e.target)) {
            menu.style.display = "none";
            document.removeEventListener("click", hideMenu);
        }
    });
}

function highlightText(color) {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let span = document.createElement("span");
        span.style.backgroundColor = color;
        span.textContent = selection.toString();
        range.deleteContents();
        range.insertNode(span);

        chrome.storage.local.get({ highlights: [] }, (data) => {
            let highlights = data.highlights;
            highlights.push({ text: selection.toString(), color });
            chrome.storage.local.set({ highlights });
        });
    }
}

function copyText() {
    let selection = window.getSelection().toString();
    navigator.clipboard.writeText(selection).then(() => {
        alert("Copied to clipboard!");
    });
}
