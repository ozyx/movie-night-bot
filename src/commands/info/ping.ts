import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "Pong!",
    ephemeral: true,
    run: async ({ interaction }) => {
        interaction.followUp("Pong!");
    }
})