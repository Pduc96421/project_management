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
    if(userId == data.userId){
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
});

//end  SERVER_RETURN_LENGHT_ACCEPT_FRIEND