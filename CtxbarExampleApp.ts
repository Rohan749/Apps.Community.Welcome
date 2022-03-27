import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

class OpenCtxBarCommand implements ISlashCommand {

    public command = 'guide-me';
    public i18nParamsExample = 'slashcommand_params';
    public i18nDescription = 'slashcommand_description';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, _read: IRead, modify: IModify): Promise<void> {
        const triggerId = context.getTriggerId() as string; 
        const user = context.getSender();

        const contextualbarBlocks = createContextualBarBlocks(modify); 

        await modify.getUiController().openContextualBarView(contextualbarBlocks, { triggerId }, user);
    }
}

function createContextualBarBlocks(modify: IModify, viewId?: string): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    const date = new Date().toISOString();

    blocks.addSectionBlock({
        text: blocks.newMarkdownTextObject(`
            Welcome To RocketChat Community!
            As a newcomer you must be overwhelmed by the huge codebase. Well, it is very obvious. Here are somethings you can do to start your Rocket-chat Journey!:

            Find out what Rocket.Chat is.
            Before jumping to conrtibution, spend some time discovering what rocket-chat is all about. Start creating direct messages, explore the functionalities, create new groups and explore all the possibilities. Also, introduce yourself in the community!

            Set up your Development Environment.
            Go to Rocket-chat Devs website (https://developer.rocket.chat/) and read the documentation. From there you can find the system requirements and how you can set the development environment. Learn how to create your first app and many more. 

            Learn how the Server code works.
            Every project in the Rocket-chat ecosystem revolves around the Rocket.Chat fullstack core server. This project gets more than 50% of all open source contribution across entire ecosystem.

            Get Yourself familiar with Rocket-chat.
            Please don't jump into resolving issues from GitHub from day one - it is important because even though you may be able to tackle an issue and open a PR, if it's not up to the standards, gets really hard to resolve since our team is extremely busy. Understand the project structure, understand the models, put random console.logs (I know you love 'em, don't lie), break it & fix it.

            Use Channels as per requirements.
            It is very important to understand the usage of channels in Rocket-chat. Please use Channels as per their purpose of creation. Don't spam everywhere as the team is very busy. Learn how to create threads and please use them if message is long. 

            Read the Contribution Code of Conduct: https://handbook.rocket.chat/company/tools/rocket.chat
            
            Go through Typescript defination Docs.
            If you want to know more about RC-apps, you can check-out the Typescript Definition documentation: https://rocketchat.github.io/Rocket.Chat.Apps-engine/ 
            It includes all the helpers offered.
        `),
              
    });
    

    return {
        id: viewId || 'contextualbarId',
        title: blocks.newPlainTextObject('Start Your Rocket-chat Journey!'),
        blocks: blocks.getBlocks(),
    };
}

export class CtxbarExampleApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(
            new OpenCtxBarCommand(this),
        )
    }

    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext): Promise<IUIKitResponse> {
        const data = context.getInteractionData()

        return {
            success: true
        };
    }
}