const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "crear-canal",
    description: "Crear un canal de discord.",
    type: 1,
    options: [
        {
            type: 3,
            name: "tipo-canal",
            description: "Tipo de canal.",
            required: true,
            choices: [
                { name: "Texto", value: "text" },
                { name: "Voz", value: "voice" }
            ]
        },
        {
            type: 3,
            name: "nombre-canal",
            description: "Nombre del canal.",
            required: true
        },
        {
            type: 7,
            name: "padre",
            description: "Categoria del canal.",
            required: true
        },
        {
            type: 8,
            name: "permisos-rol",
            description: "Permisos del canal.",
            required: true
        },
        {
            type: 8,
            name: "excluidos",
            description: "Excluidos del canal."
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        const { guild, options } = interaction;

        if (interaction.user.id !== process.env.ID_OWNER) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setDescription("⛔ No tienes permisos para cambiar niveles.")
                        .setColor("#EA3939")
                ]
            });
            return;
        }

        const { ViewChannel, ReadMessageHistory, SendMessages, Connect, Speak } =
            PermissionFlagsBits;

        const channelType = options.getString("tipo-canal");
        const channelName = options.getString("nombre-canal");
        const parent = options.getChannel("padre");
        const permissions = options.getRole("permisos-rol");
        const everyone = options.getRole("excluidos");

        let areExcludes;
        if (everyone) {
            areExcludes = {
                id: everyone || guild.id,
                deny: [ViewChannel, ReadMessageHistory, SendMessages]
            };
        } else {
            areExcludes = {
                id: everyone || guild.id,
                allow: [ViewChannel, ReadMessageHistory, SendMessages]
            };
        }

        if (channelType === "text") {
            await guild.channels.create({
                name: `${channelName}`,
                type: ChannelType.GuildText,
                parent: parent,
                permissionOverwrites: [
                    {
                        id: permissions,
                        allow: [ViewChannel, Connect, Speak]
                    },
                    areExcludes
                ]
            });

            await interaction.reply({
                content: "Canal `" + channelName + "` creado correctamente.",
                ephemeral: true
            });
        }

        if (channelType === "voice") {
            await guild.channels.create({
                name: `${channelName}`,
                type: ChannelType.GuildVoice,
                parent: parent,
                permissionOverwrites: [
                    {
                        id: permissions,
                        allow: [ViewChannel, Connect, Speak]
                    },
                    areExcludes
                ]
            });

            await interaction.reply({
                content: "Canal `" + channelName + "` creado correctamente.",
                ephemeral: true
            });
        }
    }
};
