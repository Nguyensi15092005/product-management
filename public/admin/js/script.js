// Button status lọc trạng thái và thay url
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status")
      if (status) {
        url.searchParams.set("status", status)
      }
      else {
        url.searchParams.delete("status")
      }

      window.location.href = url.href; //thay dổi url trên params
    });
  })
}

// Form Seach
const formseach = document.querySelector("#form-seach");
if (formseach) {
  let url = new URL(window.location.href);

  formseach.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }
    else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  })
}
// End Form Seach


// Page pagination

const buttonPagination = document.querySelectorAll("[button-page]")

if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-page");
      if (page > 0) {
        url.searchParams.set("page", page)
        window.location.href = url.href
      }
    })
  })
}
// end Page pagination

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


// form change Multi
const formchangeMulti = document.querySelector("[form-change-multi]");
if (formchangeMulti) {

  formchangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMuli = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMuli.querySelectorAll("input[name='id']:checked");

    const tyChange = e.target.type.value;

    if (tyChange == "delete-all") {
      const isComfirm = confirm("Bạn có chắt muốn xóa các sản phẩm này ko!!!");
      if (!isComfirm) {
        return;
      }
    }


    if (inputChecked.length > 0) {
      let ids = [];

      const inputIds = document.querySelector("input[name='ids']")

      inputChecked.forEach(input => {
        const id = input.value;

        if (tyChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`)

        }
        else {
          ids.push(id);
        }

      })

      inputIds.value = ids.join(", ");

      formchangeMulti.submit();


    }
    else {
      alert("vui lòng chon 1 sản phẩm!");
    }
  })

}
// end form change Multi

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

// upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]")
  const uploadImagePreview = document.querySelector("[upload-image-preview]")
  const closeImage = document.querySelector("[close-image]")

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file)
    }
  })
  closeImage.addEventListener("click", () => {
    uploadImageInput.value = ""
    uploadImagePreview.src = ""
  })

}
// end upload Image


// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]")
  const sortClear = sort.querySelector("[sort-clear]")

  // sắp xếp
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortkey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  })

  // Xóa sắp xép
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortkey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  })

  // thêm selected cho option
  const sortKey = url.searchParams.get("sortkey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    if (optionSelected) {
      optionSelected.selected = true;
    }
  }
}
// end Sort



