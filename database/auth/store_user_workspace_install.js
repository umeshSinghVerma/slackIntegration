const model = require('../db');
const saveUserWorkspaceInstall = async function(installation) {
  const resp = await model.User.updateOne(
      {_id: installation.team.id},
      {
        team: {id: installation.team.id, name: installation.team.name},
        // entperise id is null on workspace install
        enterprise: {id: 'null', name: 'null'},
        // user scopes + token is null on workspace install
        user: {token: 'null', scopes: 'null', id: installation.user.id},
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: {
          scopes: installation.bot.scopes,
          token: installation.bot.token,
          userId: installation.bot.userId,
          id: installation.bot.id,
        },
        chatbotId:installation.chatbotId,
        conversation_id:installation.conversation_id
      },
      {upsert: true},
  );
  return resp;
};
const saveTeamInfo = async function(teamId,chatBotId) {
  const resp = await model.Team.updateOne(
      {_id: teamId},
      {
        chatbotId:chatBotId,
      },
      {upsert: true},
  );
  return resp;
};
const saveUserInfo = async function(userId,chatBotId,conversation_id) {
  const resp = await model.UserInfo.updateOne(
      {_id: userId},
      {
        chatbotId:chatBotId,
        conversation_id:conversation_id
      },
      {upsert: true},
  );
  return resp;
};

module.exports = {saveUserWorkspaceInstall,saveTeamInfo,saveUserInfo};