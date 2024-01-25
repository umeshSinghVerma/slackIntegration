const mongoose = require('mongoose');
require('dotenv').config()

const uri = process.env.mongoUrl;
const connect = async function () {
    // Connect to MongoDB
    mongoose.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true },
    );
};

const usersSchema = mongoose.Schema(
    {
        _id: String,
        team: { id: String, name: String },
        enterprise: { id: String, name: String },
        user: { token: String, scopes: [String], id: String },
        tokenType: String,
        isEnterpriseInstall: Boolean,
        appId: String,
        authVersion: String,
        bot: {
            scopes: [
                String,
            ],
            token: String,
            userId: String,
            id: String,
        },
        chatbotId: { type: String, required: false },
        conversation_id: { type: String, required: false },
    },
    { _id: false },
);

const teamsSchema = mongoose.Schema(
    {
        _id: String,
        chatbotId: String
    },
    { _id: false },
)
const usersInfoSchema = mongoose.Schema(
    {
        _id: String,
        conversation_id: String,
        chatbotId: String,
        messages: [
            {
                role: String,
                content: String,
                timestamp: Number
            }
        ]
    },
    { _id: false }
)

const User = mongoose.model('User', usersSchema);
const Team = mongoose.model('Team', teamsSchema);
const UserInfo = mongoose.model('UserInfo', usersInfoSchema)

const findUser = async function (id) {
    try {
        const user = await User.find({ _id: id });
        // return first user we find
        if (user[0] != undefined) {
            return user[0];
        }
    } catch (error) {
        console.error(error);
    }
};
const findTeam = async function (id) {
    try {
        const team = await Team.find({ _id: id });
        // return first user we find
        if (team[0] != undefined) {
            return team[0];
        }
    } catch (error) {
        console.error(error);
    }
}
const findUserInfo = async function (id) {
    try {
        const userInfo = await UserInfo.find({ _id: id });
        // return first user we find
        if (userInfo[0] != undefined) {
            return userInfo[0];
        }
    } catch (error) {
        console.error(error);
    }
}
const addNewMessagesInUserInfo = async function (userId, newMessages) {
    try {
        const updateUserInfo = await UserInfo.updateOne(
            { _id: userId },
            { $push: { messages: { $each: newMessages } } }
        );

        console.log("Messages added successfully:", updateUserInfo);
        return updateUserInfo;
    } catch (e) {
        console.error('Error in adding message in user info', e);
        return null;
    }
};
module.exports = {
    User,
    Team,
    UserInfo,
    connect,
    findUser,
    findTeam,
    findUserInfo,
    addNewMessagesInUserInfo
};