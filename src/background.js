chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "highlightText",
        title: "Highlight Text",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "copyText",
        title: "Copy to Clipboard",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "highlightText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: highlightSelectedText
        });
    } else if (info.menuItemId === "copyText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: copySelectedText
        });
    }
});

function highlightSelectedText() {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let span = document.createElement("span");
        span.style.backgroundColor = "yellow";
        span.textContent = selection.toString();
        range.deleteContents();
        range.insertNode(span);

        chrome.storage.local.get({ highlights: [] }, (data) => {
            let highlights = data.highlights;
            highlights.push(selection.toString());
            chrome.storage.local.set({ highlights });
        });
    }
}

function copySelectedText() {
    let selection = window.getSelection().toString();
    navigator.clipboard.writeText(selection).then(() => {
        alert("Copied to clipboard!");
    });
}
