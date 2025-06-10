import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
// upload-image
const inputImage = document.querySelector(".chat .inner-upload-image #upload-image");
if (inputImage) {
  inputImage.addEventListener("change", (e) => {
    const files = Array.from(e.target.files); 
    const image = document.querySelector(".inner-image");
    let imageFiles = [...files]; 

    files.forEach((file) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-wrapper");

      const itemImage = document.createElement("img");
      itemImage.src = URL.createObjectURL(file);
      itemImage.classList.add("image");

      const closeImg = document.createElement("i");
      closeImg.classList.add("fa-solid", "fa-circle-xmark", "close-image");

      closeImg.addEventListener("click", () => {
        imageFiles = imageFiles.filter(f => f !== file);
        if(imageFiles.length === 0){
          inputImage.value="";
        }
        else {
          const transfer = new DataTransfer();
        imageFiles.forEach(f => transfer.items.add(f));
        inputImage.files = transfer.files
        }


        imageWrapper.remove();
        URL.revokeObjectURL(itemImage.src); // Giải phóng bộ nhớ
      });

      imageWrapper.appendChild(itemImage);
      imageWrapper.appendChild(closeImg);
      image.appendChild(imageWrapper);
    });
  });
}

// End upload-image



// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = Array.from(inputImage.files);

    if (content || images.length > 0) {
      socket.emit('CLIENT_SEND_MESSAGE', {
        content: content,
        images: images
      });
      e.target.elements.content.value = "";
      inputImage.value = null; 
      const none = document.querySelector(".chat .inner-image");
      none.style.display="none";
    }
  })
}
// END CLIENT_SEND_MESSAGE

// CLIENT_RETURN _MESSAGE
socket.on("CLIENT_RETURN _MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  const boxTyping = document.querySelector(".chat .inner-list-typing");
  let htmlFullname = "";
  let htmlcontent = "";
  let htmlIamges = "";
  if (myId == data.user_id) {
    div.classList.add("inner-outgoing");
  }
  else {
    htmlFullname = `<div class="inner-name"> ${data.fullName} </div>`
    div.classList.add("inner-incoming");
  }
  if (data.content) {
    htmlcontent = `
      <div class="inner-content"> ${data.content} </div>
    `;
  }
  if (data.images.length > 0) {
    htmlIamges += `<div class="inner-images">`;
    for (const image of data.images) {
      htmlIamges += `<img src="${image}">`
    }
    htmlIamges += `</div>`;
    console.log("da chay vao")
  }
  console.log(data)
  div.innerHTML = `
    ${htmlFullname}
    ${htmlcontent}
    ${htmlIamges}        
  `;
  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight

  // Viewer Full Image 
  const gallery = new Viewer(div);
  // End Viewer Full Image 
})
// END CLIENT_RETURN _MESSAGE

// scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight // cách tóp 1 khoảng bằng height của thanh scroll
}
// end scroll chat to bottom


// Show icon chat
// show Popup
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}
// end show Popup

// Show typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", ("show"))
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", ("hisden"))
  }, 3000);
}
// End Show typing

// Insert Icon vao chat

const emojipicker = document.querySelector('emoji-picker');
if (emojipicker) {
  const input = document.querySelector(".chat .inner-form input[name='content']");
  emojipicker.addEventListener('emoji-click', event => {
    const icon = event.detail.unicode;
    input.value = input.value + icon;
    // khi viết full ô input thì gi icon vào sẻ quay về đầu
    const inputLength = input.value.length;
    input.setSelectionRange(inputLength, inputLength);
    input.focus();

    showTyping();
  });


  // Input keyup
  input.addEventListener("keyup", () => {
    showTyping();
  })

  // end Input keyup
}
// Insert Icon vao chat
// end Show icon chat

// CLIENT_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("CLIENT_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const exisTyping = elementListTyping.querySelector(`[user-id="${data.user_id}"]`)
      if (!exisTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.user_id);

        boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `

        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight
      }
    }
    else {
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.user_id}"]`);
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }

    }

  })
}
// END CLIENT_RETURN_TYPING


// Viewer full Img
const bodyViewerImage = document.querySelector(".chat .inner-body");
if(bodyViewerImage){
  const gallery = new Viewer(bodyViewerImage);
}
// End Viewer full Img









