const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { profileImage } = require("discord-arts");
require("dotenv").config();

module.exports = {
    name: "usuario-info",
    description: "Mostar información de un usuario.",
    type: 1,
    options: [
        {
            type: 6,
            name: "usuario",
            description: "Usuario a mostrar la información.",
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        await interaction.deferReply();
        const memberOption = interaction.options.getMember("usuario");
        const member = memberOption || interaction.member;
        const member2 = interaction.options.get("usuario");

        // if (member.user.bot) {
        //     return interaction.editReply({
        //         embeds: [
        //             new EmbedBuilder().setDescription(
        //                 "At this moment, the bot isn't supported for the bots."
        //             )
        //         ],
        //         ephemeral: true
        //     });
        // }

        try {
            const fetchedMembers = await interaction.guild.members.fetch();

            const profileBuffer = await profileImage(member.id, {
                borderColor: ["#cc9900", "#b3b3b3"],
                badgesFrame: true,
                presenceStatus:
                    member2.member.presence?.status == "online"
                        ? "online"
                        : member2.member.presence?.status == "idle"
                        ? "idle"
                        : member2.member.presence?.status == "dnd"
                        ? "dnd"
                        : "offline",
                moreBackgroundBlur: true,
                localDateType: "es"
            });
            const imageAttachment = new AttachmentBuilder(profileBuffer, { name: "profile.png" });

            const joinPosition =
                Array.from(
                    fetchedMembers.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).keys()
                ).indexOf(member.id) + 1;

            const topRoles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map((role) => role)
                .slice(0, 3);

            const userBadges = member.user.flags.toArray();

            const joinTime = parseInt(member.joinedTimestamp / 1000);
            const createdTime = parseInt(member.user.createdTimestamp / 1000);

            const Booster = member.premiumSince ? "<:discordboost:1136752072369377410>" : "✖";

            const avatarButton = new ButtonBuilder()
                .setLabel("Avatar")
                .setStyle(5)
                .setURL(
                    member.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024
                    })
                );

            const disabled = (await member.user.fetch()).bannerURL();

            const bannerButton = new ButtonBuilder()
                .setLabel("Banner")
                .setStyle(5)
                .setDisabled(!disabled)
                .setURL(
                    (await member.user.fetch()).bannerURL() ||
                        "https://example.com/default-banner.jpg"
                );

            const row = new ActionRowBuilder().addComponents(avatarButton, bannerButton);

            const Embed = new EmbedBuilder()
                .setAuthor({
                    name: `${member.user.username}`,
                    iconURL: member.displayAvatarURL()
                })
                .setColor("Aqua")
                .setDescription(
                    `El <t:${joinTime}:D>, <@${member.user.id}> fué el miembro nº **${joinPosition}** en unirse a este Servidor.`
                )
                .setThumbnail(client.user.displayAvatarURL())
                .setImage("attachment://profile.png")
                .addFields([
                    { name: "Badges", value: `${addBadges(userBadges).join("")}`, inline: true },
                    { name: "Booster", value: `${Booster}`, inline: true },
                    {
                        name: "Estado",
                        value:
                            member2.member.presence?.status == "online"
                                ? "En linea"
                                : member2.member.presence?.status == "idle"
                                ? "Ausente"
                                : member2.member.presence?.status == "dnd"
                                ? "No molestar"
                                : "Desconectado",
                        inline: true
                    },
                    {
                        name: "Top Roles",
                        value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`,
                        inline: false
                    },
                    { name: "Creado", value: `<t:${createdTime}:R>`, inline: true },
                    { name: "Se Unió", value: `<t:${joinTime}:R>`, inline: true },
                    {
                        name: "Jugando a",
                        value: member.member?.presence?.activities[0]?.name || "Nada",
                        inline: true
                    },
                    { name: "Id", value: `${member.id}`, inline: false }
                ])
                .setTimestamp()
                .setFooter({
                    text: process.env.NAME_BOT,
                    iconURL: client.user.displayAvatarURL()
                });

            interaction.editReply({ embeds: [Embed], components: [row], files: [imageAttachment] });
        } catch (error) {
            interaction.editReply({ content: error });
            throw error;
        }
    }
};

const addBadges = (badgeNames) => {
    if (!badgeNames.length) return ["X"];
    const badgeMap = {
        ActiveDeveloper: "<:activedeveloper:1169257767396184115>",
        BugHunterLevel1: "<:discordbughunter1:1169257772479692800>",
        BugHunterLevel2: "<:discordbughunter2:1169257774522302567>",
        PremiumEarlySupporter: "<:discordearlysupporter:1169257775847714816>",
        Partner: "<:discordpartner:1169257781098991666>",
        Staff: "<:discordstaff:1169257783451988049>",
        HypeSquadOnlineHouse1: "<:hypesquadbravery:1169258215805034536>", // bravery
        HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1169257862837567500>", // brilliance
        HypeSquadOnlineHouse3: "<:hypesquadbalance:1169257785217785866>", // balance
        Hypesquad: "<:hypesquadevents:1169258218288058468>",
        CertifiedModerator: "<:olddiscordmod:1169258220003536937>",
        VerifiedDeveloper: "<:discordbotdev:1169257771070402570>"
    };

    return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔");
};
