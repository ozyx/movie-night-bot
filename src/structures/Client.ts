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
            const appCommands = await this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registered commands for guild ${guildId}`);

            // Disable admin commands for users without the specified
            // admin role (set in environment variables)
            const getRoles = (commandName: string) => {
                const permissions = this.commands.find(
                    (cmd) => cmd.name === commandName
                )?.userPermissions;

                if (!permissions) return null;
                return this.guilds.cache.get(guildId)?.roles.cache.filter(
                    (role) => role.name.toLowerCase() === process.env.ADMIN_ROLE
                );
            }

            const fullPermissions = appCommands.reduce((acc, cmd) => {
                const roles = getRoles(cmd.name);

                if (!roles) return acc;

                const perms = roles.reduce((acc, role) => {
                    return [
                        ...acc,
                        {
                            id: role.id,
                            type: "ROLE",
                            permission: true
                        }
                    ]
                }, []);

                return [
                    ...acc,
                    {
                        id: cmd.id,
                        permissions: perms
                    }
                ];
            }, []);

            await this.guilds.cache.get(guildId)?.commands.permissions.set({ fullPermissions });
            console.log(`Set permissions for guild ${guildId}`);            
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
            if (command.userPermissions) command.defaultPermission = false;
            console.log(`Imported command '${command.name}'`);
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
            if (process.env.ACTIVITY_TYPE && process.env.ACTIVITY_CONTENT) {
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