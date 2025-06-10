// Chức năng gửi yêu cẩu kb
const listButtonAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listButtonAddFriend.length > 0) {
    listButtonAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("btn-add-friend");
            // console.log(userId);

            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    })
}
// HẾt Chức năng gửi yêu cẩu kb


// Chức năng hủy yêu cẩu kb
const listButtonCanceldFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listButtonCanceldFriend.length > 0) {
    listButtonCanceldFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend");
            // console.log(userId);

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}
// HẾt Chức năng Hủy yêu cẩu kb

// Chức năng từ chối kb
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse")
        const userId = button.getAttribute("btn-refuse-friend");
        // console.log(userId);

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    })
}
const listButtonRefusedFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listButtonRefusedFriend.length > 0) {
    listButtonRefusedFriend.forEach(button => {
        refuseFriend(button);
    })
}
// HẾt Chức năng từ chối kb

// Chức năng chấ nhận kết bạn 
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted")
        const userId = button.getAttribute("btn-accept-friend");
        // console.log(userId);

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    })
}
const listButtonAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listButtonAcceptFriend.length > 0) {
    listButtonAcceptFriend.forEach(button => {
        acceptFriend(button);
    })
}
// hết Chức năng chấ nhận kết bạn 


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUsersUccept = document.querySelector("[badge-users-accept]");
if (badgeUsersUccept) {
    const userId = badgeUsersUccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data => {
        if (userId === data.userId) {
            badgeUsersUccept.innerHTML = data.lengthAcceptFriends;
        }
    }));
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_LENGTH_REQUEST_FRIEND
const badgeUsersRequest = document.querySelector("[badge-users-request]");
if (badgeUsersUccept) {
    const userId = badgeUsersRequest.getAttribute("badge-users-request");
    socket.on("SERVER_RETURN_LENGTH_REQUEST_FRIEND", (data => {
        if(userId === data.userId){
            badgeUsersRequest.innerHTML = data.lengthRequestFriends;
        }
    }));
}
// END SERVER_RETURN_LENGTH_REQUEST_FRIEND


// SERVER_RETURN_LENGTH_FRIEND_FRIEND
const badgeUsersFriend = document.querySelector("[badge-users-friend]");
if (badgeUsersUccept) {
    const userId = badgeUsersFriend.getAttribute("badge-users-friend");
    socket.on("SERVER_RETURN_LENGTH_FRIEND_FRIEND", (data => {
        if(userId === data.userIdA){
            badgeUsersFriend.innerHTML = data.lengthFriendsA;
        }
        if(userId === data.userIdB){
            badgeUsersFriend.innerHTML = data.lengthFriendsB;
        }
    }));
}
// END SERVER_RETURN_LENGTH_FRIEND_FRIEND


// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    // Traang lời mời đã nhận
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId === data.userId) {

            // vẻ user ra giao diện
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);
            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avt">
                        <img src="/img/avtUserSocket.png" alt="${data.infoUserA.fullName}">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                        <div class="inner-btn">
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accept-friend="${data.infoUserA._id}"
                            >
                                Chấp nhận
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-refuse-friend="${data.infoUserA._id}"
                            >
                                Xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-delete-friend="" 
                                disabled=""
                            >
                                Đã xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accepted-friend="" 
                                disabled=""
                            >
                                Bạn bè
                            </button>
                        </div>
                    </div>
                </div>
            `;

            dataUsersAccept.appendChild(div);
            // hết vẽ user ra giao điện

            // huỷ kết bạn
            const buttonRefuse = div.querySelector("[btn-refuse-friend]");

            refuseFriend(buttonRefuse);
            // hết hủy kết bạn 

            // chấp nhận lời mời kết bạn
            const buttonAccept = div.querySelector("[btn-accept-friend]");
            acceptFriend(buttonAccept);
            // hết chấp nhận lời mời kết bạn 

        }
    }

    // Trang danh sách người dùng
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if(dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if(userId === data.userId){
            const boxUserRemove = document.querySelector(`[user-id='${data.infoUserA._id}']`);
            if (boxUserRemove){
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }

})
// END SERVER_RETURN_INFO_ACCEPT_FRIEND


// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}'`);
    if (boxUserRemove) {
        const dataUsersAccept = document.querySelector("[data-users-accept]");
        const userIdB = badgeUsersUccept.getAttribute("badge-users-accept");
        if (userIdB === data.userIdB) {
            dataUsersAccept.removeChild(boxUserRemove);
        }

    }
})
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_INFO_FRIEND
socket.on("SERVER_RETURN_INFO_FRIEND", (data) => {
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if(dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if(userId === data.userId){
            const boxUserRemove = document.querySelector(`[user-id='${data.infoUserB._id}']`);
            if (boxUserRemove){
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }
})
// END SERVER_RETURN_INFO_FRIEND

// SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (userId) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if(dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if(boxUser){
            const boxStatus = boxUser.querySelector("[status]")
            boxStatus.setAttribute("status", "online");
        }
    }
})
// END SERVER_RETURN_USER_STATUS_ONLINE

// SERVER_RETURN_USER_STATUS_OFFLINE
socket.on("SERVER_RETURN_USER_STATUS_OFFLINE", (userId) => {
    console.log(userId)
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if(dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if(boxUser){
            const boxStatus = boxUser.querySelector("[status]")
            boxStatus.setAttribute("status", "offline");
        }
    }
})
// END SERVER_RETURN_USER_STATUS_OFFLINE

