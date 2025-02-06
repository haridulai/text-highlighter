document.addEventListener("DOMContentLoaded", () => {
    let highlightList = document.getElementById("highlightList");

    chrome.storage.local.get("highlights", (data) => {
        highlightList.innerHTML = ""; // Clear list before adding items

        (data.highlights || []).forEach((item) => {
            let div = document.createElement("div");
            div.className = "highlight-item";
            div.style.backgroundColor = item.color;
            div.textContent = item.text;
            highlightList.appendChild(div);
        });
    });
});
