const debug = require('debug')('teamsync:hears');
const utils = require('./functions.js');

module.exports = (framework) => {
  let responded = false;
  // Say Hello
  framework.hears('hello', (bot, trigger) => {
    debug('triggers hears:hello');
    responded = true;

    if (trigger.message.roomType === 'group') {
      bot.say(`Hello <@personId:${trigger.person.id}>!`);
    } else {
      bot.say(`Hello ${trigger.person.displayName}!`);
    }
  });

  framework.hears('resync', (bot, trigger) => {
    debug('triggers hears:resync');
    responded = true;

    // Get Room Details
    bot.framework.webex.rooms.get(trigger.message.roomId).then((room) => {
      // Get Team Details
      bot.framework.webex.teams.get(room.teamId).then((team) => {
        // Check if Team General Space
        // WARNING - Logic FLAW if Team Space has same name as Team.
        if (room.title === team.name && room.teamId === team.id) {
          // Verify Moderator Initiated Sync
          bot.framework.webex.memberships
            .list({ roomId: room.id, personId: trigger.personId })
            .then((membership) => {
              if (membership.items[0].isModerator) {
                debug('running full sync from General Space');
                bot.say(`<@personId:${trigger.personId}>, Running Team Re-sync...`);
                bot.framework.webex.memberships
                  .list({ roomId: room.id })
                  .then((members) => {
                    members.items.forEach((member) => {
                      if (member.personId === bot.person.id) {
                        debug('skip bot');
                        return;
                      }
                      utils.syncMember(framework, bot, member, room);
                    });
                  });
              } else {
                bot.say(`<@personId:${trigger.personId}>, you are not a moderator.`);
              }
            });
        }
      });
    });
  });

  // Handle Unexpected Input
  framework.hears(/.*/gim, (bot, trigger) => {
    if (!responded) {
      debug('triggers hears:fallback');
      bot.say(`Sorry, I don't know how to respond to ${trigger.message.text}`);
    }
  });
};
