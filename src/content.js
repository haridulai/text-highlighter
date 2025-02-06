let highlightMenu = document.createElement("div");
highlightMenu.id = "highlightMenu";
highlightMenu.style.position = "absolute";
highlightMenu.style.background = "white";
highlightMenu.style.border = "1px solid #ccc";
highlightMenu.style.padding = "5px";
highlightMenu.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";
highlightMenu.style.display = "none";
highlightMenu.style.zIndex = "1000";
highlightMenu.style.borderRadius = "5px";
highlightMenu.innerHTML = `
    <button id="highlightBtn">🟡 Highlight</button>
    <button id="copyBtn">📋 Copy</button>
`;
document.body.appendChild(highlightMenu);

// Track selected text globally
let selectedText = "";

document.addEventListener("mouseup", (event) => {
    selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 0) {
        showHighlightMenu(event.pageX, event.pageY);
    } else {
        hideHighlightMenu();
    }
});

function showHighlightMenu(x, y) {
    highlightMenu.style.top = `${y + 10}px`; // Offset a little below selection
    highlightMenu.style.left = `${x}px`;
    highlightMenu.style.display = "block";
}

function hideHighlightMenu() {
    highlightMenu.style.display = "none";
}

// Add event listeners for buttons
document.getElementById("highlightBtn").addEventListener("click", () => {
    highlightSelectedText("yellow");
    hideHighlightMenu();
});

document.getElementById("copyBtn").addEventListener("click", () => {
    copySelectedText();
    hideHighlightMenu();
});

// Function to highlight and store text
function highlightSelectedText(color) {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let span = document.createElement("span");
        span.style.backgroundColor = color;
        span.textContent = selection.toString();
        range.deleteContents();
        range.insertNode(span);

        saveHighlightedText(span.textContent, color);
    }
}

// Copy selected text
function copySelectedText() {
    navigator.clipboard.writeText(selectedText).then(() => {
        alert("Copied to clipboard!");
    });
}

// Save highlighted text persistently
function saveHighlightedText(text, color) {
    chrome.storage.local.get({ highlights: [] }, (data) => {
        let highlights = data.highlights;
        highlights.push({ text, color, url: window.location.href });
        chrome.storage.local.set({ highlights });
    });
}

// Load highlights on page refresh
function loadHighlights() {
    chrome.storage.local.get("highlights", (data) => {
        (data.highlights || []).forEach((item) => {
            if (item.url === window.location.href) {
                applyHighlight(item.text, item.color);
            }
        });
    });
}

// Reapply highlights to the page
function applyHighlight(text, color) {
    let bodyText = document.body.innerHTML;
    let highlightedText = `<span style="background-color:${color};">${text}</span>`;
    document.body.innerHTML = bodyText.replace(text, highlightedText);
}

// Run on page load
window.onload = loadHighlights;
