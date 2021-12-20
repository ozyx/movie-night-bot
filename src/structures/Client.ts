import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, ExcludeEnum } from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/Client";
import { Event } from "./Event";
import { ActivityTypes } from "discord.js/typings/enums";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: 32767 });
    }

    start() {
        this.registerModules();
        this.login(process.env.BOT_TOKEN);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registered commands for guild ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log(`Registered global commands`);
        }
    }

    async registerModules() {
        // Register commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(
            `${__dirname}/../commands/*/*{.ts,.js}`
        );

        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;
            console.log(command);
            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.GUILD_ID
            });
        });

        // Register events
        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );

        eventFiles.forEach(async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });

        this.once("ready", () => {
            if (process.env.ACTIVITY_TYPE) {
                this.user.setPresence({
                    activities: [
                        {
                            name: process.env.ACTIVITY_CONTENT,
                            type: process.env.ACTIVITY_TYPE as ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>
                        }
                    ]
                });
            }
        });
    }
}