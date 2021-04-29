# team-sync

Webex Team Sync Bot allows you to automatically add new Team Members to Team Spaces.

When a new user is added to the team (in the General Space), they will be added to each Team Space that the bot is a member of.

## Deployment
1. Register a Bot at [Webex Developers](https://developer.webex.com/my-apps) for your Organization
2. Build and Deploy Docker Container (or deploy to Cloud)

    **Note:** Webhook, Secret and Port can be omitted if you want to use Websockets.

    ```
    > docker build --tag team-sync .
    > docker create --name team-sync \
      -e TOKEN=bot-token-from-developer-dot-webex-dot-com \
      (optional) -e WEBHOOK_URL=https://yourdomain.com/framework \
      (optional) -e SECRET=replace-me-with-a-secret-string \
      (optional) -e PORT=3000 \
      (optional) -e GUIDE_EMAILS=comma-separated-list-of-people-required-in-space-for-bot-to-function \
      team-sync

3. Verify Docker logs to ensure bot as started successfully.

## Support
In case you've found a bug, please [open an issue on GitHub](../../issues).

## Credits
Leverages the [webex-node-bot-framework](https://github.com/WebexSamples/webex-node-bot-framework)

## Disclaimer
This script is NOT guaranteed to be bug free and production quality.
