const mongoose = require('mongoose');

const urid = 'mongodb+srv://' + process.env.DB_USERNAME + ':' +
    process.env.DB_PASSWORD +
    '@cluster0.yvswg.mongodb.net/' + process.env.DB_NAME +
    '?retryWrites=true&w=majority';
const uri = 'mongodb+srv://usv0308:umesh0308@cluster0.pbdpdct.mongodb.net/slacktest?retryWrites=true&w=majority';
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
        chatbotId: String
    },
    { _id: false }
)

const User = mongoose.model('User', usersSchema);
const Team = mongoose.model('Team', teamsSchema);
const UserInfo = mongoose.model('UserInfo',usersInfoSchema)

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

module.exports = {
    User,
    Team,
    UserInfo,
    connect,
    findUser,
    findTeam,
    findUserInfo
};