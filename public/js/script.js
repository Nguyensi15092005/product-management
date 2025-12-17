// Show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("date-time"));
  const close = showAlert.querySelector("[close-alert]")

  setTimeout(() => {
    showAlert.classList.add("alert-hidden")
  }, time);

  close.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden")
  })
}
// end Show-alert

// preview
const showPreview = document.querySelector("#show-preview");
const preview = document.querySelector(".preview");
const previewError = document.querySelector(".preview-error");
if(showPreview){
  showPreview.addEventListener("click", ()=>{
    if(preview){
      preview.style.display="block";
    }
    
    if(previewError){
      console.log("chay vao day");
      previewError.style.display="block";
    }
  })
}
const closePreview = document.querySelector("#close-preview");
if(closePreview){
  closePreview.addEventListener("click", ()=> {
    if(preview) preview.style.display="none";
    if(previewError){
      previewError.style.display="none";
    }
    
  }) 
}
// end preview