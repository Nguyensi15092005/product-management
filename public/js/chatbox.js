const iconChat = document.querySelector(".chatbox-icon");
const chatboxCart = document.querySelector(".chatbox-card");
if(iconChat){
    iconChat.addEventListener("click", () => {
        iconChat.style.display="none"
        chatboxCart.style.display="flex";
    })
}

// Tắt chat
const clearChat = document.querySelector(".boxchat-clear");
if(clearChat){
    clearChat.addEventListener("click", () => {
        iconChat.style.display="block"
        chatboxCart.style.display="none";
    })
}

//chatboxai
document.querySelector("#sendBtn").addEventListener("click", async () => {
    const input = document.querySelector("#chatInput");
    const text = input.value.trim();

    if (!text) return;

    // Thêm message của user vào UI
    addMessage("user", text);

    input.value = "";

    // Gửi sang server
    const res = await fetch("/geminiAI/chatbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    console.log(data);


    // Xuất reply lên UI
    addMessage("ai", data.reply);
});


function addMessage(sender, text) {
    const box = document.querySelector("#chatBody");
    const div = document.createElement("div");

    div.className = sender === "user" ? "msg-right" : "msg-left";
    div.innerText = text;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}
