const debug = require('debug')('team-sync:events');
const utils = require('./functions.js');

module.exports = (framework) => {
  /*
  // Room Locked Event
  framework.on('roomLocked', (bot) => {
    debug('trigger roomLocked');
    if (!bot.isModerator) {
      debug('Bot is not moderator in moderated room');
      bot.say('Please make me a moderator so I can function correctly.');
    }
  });

  // Room Unlocked Event
  framework.on('roomUnlocked', (bot) => {
    debug('trigger roomUnlocked');
  });

  // Bot Added as Moderator Event
  framework.on('botAddedAsModerator', (bot) => {
    debug('trigger botAddMod');
  });

  // Bot Removed as Moderator Event
  framework.on('botRemovedAsModerator', (bot) => {
    debug('trigger botRemMod');
    if (!bot.isModerator) {
      debug('Bot is not moderator in moderated room');
      bot.say('Please make me a moderator so I can function correctly.');
    }
  });
  */

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
          bot.say(`Running Sync for <@personId:${trigger.personId}>`);
          utils.syncMember(framework, bot, trigger, room);
        }
      });
    });
  });
};
