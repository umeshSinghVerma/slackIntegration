const { App } = require('@slack/bolt')
const axios = require('axios')
require('dotenv').config()
const orgInstall = require("./database/auth/store_user_org_install");
const workspaceAuth = require("./database/auth/store_user_workspace_install");
const db = require("./database/db");

console.log('this is database', db);
db.connect();
let chatbotId = null;
const oauthRedirect = `https://slackintegration-klh6.onrender.com/slack/oauth_redirect`;
// const oauthRedirect = `${process.env.baseUrlLocal}/slack/oauth_redirect`;
// const oauthRedirect = "https://abeb-117-219-22-193.ngrok-free.app/slack/oauth_redirect";
const InstallHtml = `<a href='https://slack.com/oauth/v2/authorize?client_id=6518424113745.6511549174791&scope=chat%3Awrite%2Cim%3Ahistory&redirect_uri=${oauthRedirect}'><img alt="" add="" to="" slack""="" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>`
const customRoutes = [
    {
        path: '/slack/install/:id',
        method: ['GET'],
        handler: (req, res) => {
            res.writeHead(200);
            const { id } = req.params;
            chatbotId = id;
            console.log('this is the chatbotId', chatbotId);
            res.end(InstallHtml);
        },
    },
    {
        path: '/slack/events',
        method: ['GET'],
        handler: (req, res) => {
            res.writeHead(200);
            res.end();
        },
    }
];
console.log('this is the chatbot id now', chatbotId);
const app = new App({

    signingSecret: "af0dffd7fe222a8338fcb7d5909304c9",
    clientId: "6518424113745.6511549174791",
    clientSecret: 'dea0c84fdf4d476fc3797a61f98ae9a4',
    stateSecret: 'my-state-secret',
    scopes: ['chat:write', 'im:history'],
    customRoutes: customRoutes,
    installationStore: {
        storeInstallation: async (installation) => {
            let NewUpdatedObjectWithChatBotId = {};
            if (chatbotId) {
                NewUpdatedObjectWithChatBotId = { ...installation, chatbotId: chatbotId };
            } else {
                NewUpdatedObjectWithChatBotId = { ...installation };
            }
            console.log(NewUpdatedObjectWithChatBotId)
            if (
                installation.isEnterpriseInstall &&
                installation.enterprise !== undefined
            ) {
                return await orgInstall.saveUserOrgInstall(NewUpdatedObjectWithChatBotId);
            }
            if (installation.team !== undefined) {
                const teamInstallation = await workspaceAuth.saveTeamInfo(installation.team.id, chatbotId);
                console.log('this is team Installation', teamInstallation);
                return await workspaceAuth.saveUserWorkspaceInstall(NewUpdatedObjectWithChatBotId);
            }
            throw new Error("Failed saving installation data to installationStore");
        },
        fetchInstallation: async (installQuery) => {
            console.log('installQuery')
            console.log(installQuery)
            if (
                installQuery.isEnterpriseInstall &&
                installQuery.enterpriseId !== undefined
            ) {
                return await db.findUser(installQuery.enterpriseId);
            }
            if (installQuery.teamId !== undefined) {
                return await db.findUser(installQuery.teamId);
            }
            throw new Error("Failed fetching installation");
        },
    },
    installerOptions: {
        stateVerification: false
    }
});
function isWithinLast12Hours(timestamp) {
    const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    // const twelveHoursInMilliseconds = 120 * 1000; 
    const currentTime = new Date().getTime();
    return currentTime - timestamp <= twelveHoursInMilliseconds;
}
(async () => {
    await app.start(process.env.PORT || 3000);

    app.message(/^.*$/, async ({ message, say }) => {

        const userId = message.user;
        const messageText = message.text;
        console.log("this is the message",message);
        const userInfo = await db.findUserInfo(userId);
        const MessageTimeStamp = new Date().getTime();
        const previousMessages = userInfo?.messages;
        console.log('this is previousMessages above ',previousMessages,"is witing ",isWithinLast12Hours(previousMessages[previousMessages.length-1].timestamp));
        console.log('testing go inside ',userInfo && previousMessages &&  isWithinLast12Hours(previousMessages[previousMessages.length-1].timestamp));
        if (userInfo && previousMessages &&  isWithinLast12Hours(previousMessages[previousMessages.length-1].timestamp)) {
            console.log('now the messages are coming here',userInfo);
            const chatBotId = userInfo.chatbotId;
            const conversation_id = userInfo.conversation_id;
            const previousMessages = userInfo.messages;
            console.log('chatbot_id,conversation_id',chatBotId,conversation_id);
            let messageResponse = "";
            try {
                let response = await axios.post("https://py-server-ssra.onrender.com/api/v1/send-message", {
                    query: `${messageText}`,
                    chatbot_id: chatBotId,
                    conversation_id: conversation_id,
                    messages: previousMessages
                });
                const responseData = response.data;
                console.log('this is the response', responseData);
                messageResponse = responseData.answer;
                const ReplyTimeStamp = new Date().getTime();
                
                const newMessages = [
                    {
                        role: "user",
                        content: messageText,
                        timestamp: MessageTimeStamp
                    },
                    {
                        role: "assistant",
                        content: messageResponse,
                        timestamp: ReplyTimeStamp
                    }
                ];
                const messageSaving = await db.addNewMessagesInUserInfo(userId, newMessages);
                console.log('this is message saving',messageSaving);
                await say(messageResponse);
            }
            catch (e) {
                console.log("this is the error", e);
                await say("some error has occured");
            }
        } else {
            const teamId = message.team;
            const teamInfo = await db.findTeam(teamId);
            const chatBotId = teamInfo.chatbotId;
            console.log('this is team Info',teamInfo);
            console.log('this is the chatbot id',chatBotId);
            const userId = message.user;
            let conversation_id="";
            try {
                let response = await axios.post("https://py-server-ssra.onrender.com/api/v1/create-conversation", {
                    chatbot_id: `${chatBotId}`
                }
                );
                const responseData = response.data;
                console.log('this is the response', responseData);
                conversation_id = responseData.conversation_id;
                const saving = await workspaceAuth.saveUserInfo(userId,chatBotId,conversation_id);
                console.log('this is the saving', saving);
            }
            catch (e) {
                console.log("this is the error", e);
                await say("Error generating the conversation id");
                throw new Error("Error generating the conversation id");
            }
            let messageResponse = "";
            try {
                let response = await axios.post("https://py-server-ssra.onrender.com/api/v1/send-message", {
                    query: `${messageText}`,
                    chatbot_id: chatBotId,
                    conversation_id: conversation_id,
                    messages: []
                });
                const responseData = response.data;
                console.log('this is the response', responseData);
                messageResponse = responseData.answer;
                const ReplyTimeStamp = new Date().getTime();
                
                const newMessages = [
                    {
                        role: "user",
                        content: messageText,
                        timestamp: MessageTimeStamp
                    },
                    {
                        role: "assistant",
                        content: messageResponse,
                        timestamp: ReplyTimeStamp
                    }
                ];
                const messageSaving = await db.addNewMessagesInUserInfo(userId, newMessages);
                console.log('this is message saving',messageSaving);
                await say(messageResponse);
            }
            catch (e) {
                console.log("this is the error", e);
                await say("some error has occured");
            }

        }
    });

    console.log('⚡️ Bolt app is running!');
})();