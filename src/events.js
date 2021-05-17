const debug = require('debug')('team-sync:events');
const utils = require('./functions.js');

module.exports = (framework) => {
  // Member Enters Event
  framework.on('memberEnters', (bot, trigger) => {
    debug('trigger memberEnters');

    // Get Room Details
    bot.framework.webex.rooms.get(trigger.roomId).then((room) => {
      // Get Team Details
      bot.framework.webex.teams.get(room.teamId).then((team) => {
        // Check if Team General Space
        if (room.created === team.created) {
          debug('new member in general space, adding to team spaces');
          if (process.env.DEBUG_SPACE) {
            const debugBot = framework.getBotByRoomId(process.env.DEBUG_SPACE);
            if (debugBot) {
              const buff = Buffer.from(room.id, 'base64');
              const base64 = buff.toString('utf-8');
              const roomUid = base64.slice(base64.lastIndexOf('/') + 1);
              debugBot.say(`Running Sync for ${trigger.personDisplayName} in [${room.title}](webexteams://im?space=${roomUid})`);
            } else {
              bot.say(`Running Sync for <@personId:${trigger.personId}>`);
            }
          } else {
            bot.say(`Running Sync for <@personId:${trigger.personId}>`);
          }
          utils.syncMember(framework, bot, trigger, room);
        }
      });
    });
  });
};
