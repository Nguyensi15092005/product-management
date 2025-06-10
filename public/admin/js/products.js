console.log("ok")
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formchangeStatus = document.querySelector("#form-change-status");
  const path = formchangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let changeStatus = status == "active" ? "inactive" : "active";
      // console.log(status, id);
      // console.log(changeStatus);

      const action = path + `/${changeStatus}/${id}?_method=PATCH`;
      formchangeStatus.action = action;

      formchangeStatus.submit();
    })
  })
}

const aChangeStatus = document.querySelectorAll("[a-change-status]");
if (aChangeStatus.length > 0) {
  const formchangeStatus = document.querySelector("#form-change-status");
  const path = formchangeStatus.getAttribute("data-path");

  aChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      console.log("OK")
      const status = button.getAttribute("data-status");
      console.log(status)
      const id = button.getAttribute("data-id");

      let changeStatus = (status == "comfirm") ? "notcomfirm" : "comfirm";
      console.log(changeStatus)

      console.log(status, id);
      console.log(changeStatus);

      const action = path + `/${changeStatus}/${id}?_method=PATCH`;
      formchangeStatus.action = action;

      formchangeStatus.submit();
    })
  })
}

// delete item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formButtonDelete = document.querySelector("#form-delete-item");
  const patch = formButtonDelete.getAttribute("data-path")
  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn có chắc muốn xóa ko!");
      if (isComfirm) {
        const id = button.getAttribute("data-id");

        const action = `${patch}/${id}?_method=DELETE`;

        formButtonDelete.action=action;
        formButtonDelete.submit();
      }
    })

  })
}
