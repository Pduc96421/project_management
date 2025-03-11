// chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", (e) => {
            button.closest(".box-user").classList.add("add");

            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// end chức năng gửi yêu cầu

// d)Chắc năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", (e) => {
            button.closest(".box-user").classList.remove("add");

            const userId = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
//end  d)Chắc năng hủy yêu cầu

// Chưc năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", (e) => {
            button.closest(".box-user").classList.add("refuse");

            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}
// end Chưc năng từ chối kết bạn

// f)Chấp nhận kết bạn
const listBtnAcceptedFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptedFriend.length > 0) {
    listBtnAcceptedFriend.forEach(button => {
        button.addEventListener("click", (e) => {
            button.closest(".box-user").classList.add("accepted");

            const userId = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        });
    });
}
//end  f)Chấp nhận kết bạn

// SERVER_RETURN_LENGHT_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGHT_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector("[badge-users-accept]");
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    if (userId == data.userId) {
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
});
//end  SERVER_RETURN_LENGHT_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    // trang lời mời kết bạn
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        // vẽ user ra giao diên
        if (userId == data.userId) {
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.infoUserA._id);

            newBoxUser.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src=${data.infoUserA.avatar ? data.infoUserA.avatar : "https://robohash.org/hicveldicta.png"} alt=${data.infoUserA.fullName}>
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                        <div class="inner-buttons">
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accept-friend=${data.infoUserA._id}
                            >Chấp nhận</button>

                            <button 
                                class="btn btn-sm btn-secondary mr-1"
                                btn-refuse-friend=${data.infoUserA._id}
                            >Xóa</button>
                            
                            <button 
                                class="btn btn-sm btn-secondary mr-1"
                                btn-deleted-friend="btn-deleted-friend" disabled="disabled"
                            >Đã xóa</button>

                            <button 
                                class="btn btn-sm btn-primary mr-1"
                                btn-accepted-friend="btn-accepted-friend" disabled="disabled"
                            >Đã chấp nhận</button>
                        </div>
                    </div>
                </div>
            `;
            dataUsersAccept.appendChild(newBoxUser);
            // end vẽ user ra giao diên

            // bắt sự kiên xóa lời mời 
            const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");

            btnRefuseFriend.addEventListener("click", (e) => {
                btnRefuseFriend.closest(".box-user").classList.add("refuse");

                const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");

                socket.emit("CLIENT_REFUSE_FRIEND", userId);
            });
            // end bắt sự kiên xóa lời mời 

            // bắt sự kiên chấp nhận
            const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
            btnAcceptFriend.addEventListener("click", (e) => {
                btnAcceptFriend.closest(".box-user").classList.add("accepted");

                const userId = btnAcceptFriend.getAttribute("btn-accept-friend");

                socket.emit("CLIENT_ACCEPT_FRIEND", userId);
            });
            // end bắt sự kiên chấp nhận   
        }
    }
    // end trang lời mời kết bạn

    // Trang danh sách người dùng
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if (userId == data.userId) {
            const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if (boxUserRemove) {
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }
    // endTrang danh sách người dùng
});
// end SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");

        if (userId == data.userId) {
            // xóa A khỏi danh sách của B
            const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
            if (boxUserRemove) {
                dataUsersAccept.removeChild(boxUserRemove);
            }
        }
    }
});
// end SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector("[status]").setAttribute("status", "online");
        }
    }
});
// end SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector("[status]").setAttribute("status", "offline");
        }
    }
});
// end SERVER_RETURN_USER_OFFLINE