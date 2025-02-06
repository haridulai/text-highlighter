document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("highlights", (data) => {
        let highlightList = document.getElementById("highlightList");
        highlightList.innerHTML = "";
        (data.highlights || []).forEach((item) => {
            let div = document.createElement("div");
            div.className = "highlight-item";
            div.style.backgroundColor = item.color;
            div.textContent = item.text;
            highlightList.appendChild(div);
        });
    });
});
