const debug = require('debug')('team-sync:utils');

function utils() {
  async function syncMember(framework, bot, person, srcRoom) {
    bot.framework.webex.rooms.list({ teamId: srcRoom.teamId }).then((rooms) => {
      debug(`room count ${rooms.items.length}`);
      if (rooms.items.length === 1) {
        bot.say('There are no Spaces in this team!');
        return;
      }
      rooms.items.forEach((room) => {
        if (room.id === srcRoom.id) {
          debug('skipping general room');
          return;
        }
        if ((process.env.DEBUG_SPACE) && (room.id === process.env.DEBUG_SPACE)) {
          debug('skipping debug space');
          return;
        }
        // If Bot is member of space, add user.
        const roomBot = framework.getBotByRoomId(room.id);
        if (roomBot) {
          // Check if already a member
          roomBot.framework.webex.memberships
            .list({ roomId: room.id, personId: person.personId })
            .then((result) => {
              if (result.items.length === 0) {
                // Verify Moderation Status
                if (
                  // eslint-disable-next-line operator-linebreak
                  !roomBot.isLocked ||
                  (roomBot.isModerator && roomBot.isLocked)
                ) {
                  roomBot
                    .add(person.personEmail)
                    .then(() => {
                      debug(
                        `added ${person.personDisplayName} to ${room.title}`,
                      );
                    })
                    .catch((err) => {
                      debug(err);
                    });
                } else {
                  debug(`${room.title} is locked and I am not a moderator`);
                  const buff = Buffer.from(room.id, 'base64');
                  const base64 = buff.toString('utf-8');
                  const roomUid = base64.slice(base64.lastIndexOf('/') + 1);
                  bot.say(
                    'html',
                    `Unable to add ${person.personDisplayName} to <a href="webexteams://im?space=${roomUid}">${room.title}</a>, I am not a Moderator.`,
                  );
                }
              }
            });
        }
      });
    });
  }

  return {
    syncMember,
  };
}

module.exports = utils();
