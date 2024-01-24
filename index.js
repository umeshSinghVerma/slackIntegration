const { App } = require('@slack/bolt')
const axios = require('axios')
const orgInstall = require("./database/auth/store_user_org_install");
const workspaceAuth = require("./database/auth/store_user_workspace_install");
const db = require("./database/db");

console.log('this is database',db);
db.connect();
let chatbotId = null;
const oauthRedirect = "https://6fa4-117-219-22-193.ngrok-free.app/slack/oauth_redirect";
const InstallHtml = `<a href='https://slack.com/oauth/v2/authorize?client_id=6518424113745.6501539481943&scope=chat%3Awrite%2Cim%3Ahistory&redirect_uri=${oauthRedirect}'><img alt="" add="" to="" slack""="" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>`
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
    signingSecret: '49528dcaebde762b793ca27bdf696a1b',
    clientId: '6518424113745.6501539481943',
    clientSecret: 'e7b65503c201a34c33474cd43707856b',
    stateSecret: 'my-state-secret',
    scopes: ['chat:write', 'im:history'],
    customRoutes: customRoutes,
    installationStore: {
        storeInstallation: async (installation) => {
            let NewUpdatedObjectWithChatBotId={};
            if(chatbotId){
                NewUpdatedObjectWithChatBotId={...installation,chatbotId:chatbotId};
            }else{
                NewUpdatedObjectWithChatBotId={...installation};
            }
            console.log(NewUpdatedObjectWithChatBotId)
            if (
                installation.isEnterpriseInstall &&
                installation.enterprise !== undefined
            ){
                return await orgInstall.saveUserOrgInstall(NewUpdatedObjectWithChatBotId);
            }
            if (installation.team !== undefined) {
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
(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    app.message(/^.*$/, async ({ message, say }) => {
        let resp = await axios.get('https://api.quotable.io/random');
        const userData = await db.findUser(message.team);
        const chatBotId = userData.chatbotId;
        console.log('this is the assigned chatBotId',chatBotId);
        const quote = resp.data.content;
        await say(`Hello,<@${message.user}>,${quote} \n your assigned chatBotid is ${chatBotId}`);
        console.log('this is message', message);
    });

    console.log('⚡️ Bolt app is running!');
})();