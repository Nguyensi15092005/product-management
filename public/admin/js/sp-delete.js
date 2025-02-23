const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
    const formDelete = document.querySelector("#form-delete-item");
    const path = formDelete.getAttribute("data-path");
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isComfirm=confirm("Bạn có chắt muốn xóa sản phẩm này vĩnh viễn ko!!");
            if(isComfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDelete.action= action;
                formDelete.submit()
            }
            
        })
    })
}

//khôi phục sản phẩm 

const buttonRestore = document.querySelectorAll("[button-restore]");
if(buttonRestore.length > 0){
    const formButtonRestore = document.querySelector("#form-restore-item");
    const path = formButtonRestore.getAttribute("data-path");
    
    buttonRestore.forEach(button => {
        button.addEventListener("click", () => {
            const isComfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này ko!!!");
            if(isComfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=PATCH`
                
                formButtonRestore.action=action;
                formButtonRestore.submit();
            }
        })
    })
}