const Users = require("../../models/users.model");
const userSocketIO = require("../../socketIO/client/user.socket");

module.exports.notFriend = async (req, res) => {
    // SocketIO
    userSocketIO(res)
    // End SocketIO

    const userId = res.locals.user.id;
    const myUserId = await Users.findOne({
        _id: userId
    });
    const requestFriends = myUserId.requestFriends;
    const acceptFriends = myUserId.acceptFriends;
    const friendList = myUserId.friendList.map(item=> item.user_id);
    const users = await Users.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: friendList } }
        ],
        deleted: false,
        status: "active"
    }).select("id avatar fullName");
    res.render("client/pages/userSocket/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

module.exports.request = async (req, res) => {
    // SocketIO
    userSocketIO(res)
    // End SocketIO

    const userId = res.locals.user.id;
    const myUserId = await Users.findOne({
        _id: userId
    });
    const requestFriends = myUserId.requestFriends;
    const users = await Users.find({
        _id: { $in: requestFriends },
        deleted: false,
        status: "active"
    }).select("id avatar fullName");
    res.render("client/pages/userSocket/request", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

module.exports.accept = async (req, res) => {
    // SocketIO
    userSocketIO(res)
    // End SocketIO

    const userId = res.locals.user.id;
    const myUserId = await Users.findOne({
        _id: userId
    });
    const acceptFriends = myUserId.acceptFriends;
    const users = await Users.find({
        _id: { $in: acceptFriends },
        deleted: false,
        status: "active"
    }).select("id avatar fullName");
    res.render("client/pages/userSocket/accept", {
        pageTitle: "Lời mời kết bạn",
        users: users
    })
}

module.exports.friends = async (req, res) => {
    // SocketIO
    userSocketIO(res)
    // End SocketIO

    const userId = res.locals.user.id;

    const myUserId = await Users.findOne({
        _id: userId
    });

    const friendListId = myUserId.friendList.map(friend => friend.user_id);
    const users = await Users.find({
        _id: { $in: friendListId },
        deleted: false,
        status: "active"
    }).select("id avatar fullName statusOnline");

    for (const user of users) {
        const infoFriend = myUserId.friendList.find(friend => friend.user_id == user.id);
        user.infoFriend = infoFriend;
    }
    res.render("client/pages/userSocket/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users
    })
}