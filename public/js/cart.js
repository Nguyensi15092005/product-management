// Cập nhật số lượng ssản phẩm trong giot hàng
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity) {
  inputQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id");
      const quantity = e.target.value;
      console.log(productId);
      console.log(quantity)
      window.location.href = `/cart/update/${productId}/${quantity}`
    })
  })
}

// hết cập nhật số lượng

//Checkbox 
const checkboxMuli = document.querySelector("[checkbox-multi]");
if (checkboxMuli) {
  const inputCheckboxAll = checkboxMuli.querySelector("input[name='checkall']");
  const inputsID = checkboxMuli.querySelectorAll("input[name='id']");

  inputCheckboxAll.addEventListener("click", () => {
    if (inputCheckboxAll.checked) {
      inputsID.forEach(input => {
        input.checked = true
      });
    }
    else {
      inputsID.forEach(input => {
        input.checked = false
      });
    }
  });

  inputsID.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMuli.querySelectorAll("input[name='id']:checked").length;
      if (countChecked == inputsID.length) {
        inputCheckboxAll.checked = true
      }
      else {
        inputCheckboxAll.checked = false
      }
    });
  });

}
// end checkbox

// change-multi

// const checkbox = document.querySelectorAll("input[name='id']");
// if(checkbox.length > 0){
//   checkbox.forEach(input =>{
//     input.addEventListener("click", ()=>{
//       if(input.checked == true){
//         const productId = input.getAttribute("product-id");
//         console.log(productId)
//         window.location.href =`/cart/checked/${productId}`
//       }
//     })
//   })
// }
