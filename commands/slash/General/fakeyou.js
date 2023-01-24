const { speak } = require("fakeyou-api");
const characters = require("../../../utils/characterFakeYou");

module.exports = {
    name: "fakeyou",
    description: "Lista de personajes disponibles.",
    type: 1,
    options: [
        {
            type: 3,
            name: "personaje",
            description: "Elige Personaje",
            required: true,
            choices: [
                { name: "🔉Apu Nahasapeemapetilon", value: "apu" },
                { name: "🔉Auron (época de Twitch)", value: "aurontwitch" },
                { name: "🔉Auronplay (época de YouTube)", value: "auronyoutube" },
                { name: "🔉Bart Simpson", value: "bartsimpson" },
                { name: "🔉Bob Esponja", value: "bobesponja" },
                { name: "🔉Bugs Bunny", value: "bugsbunny" },
                { name: "🔉Chiquito de la Calzada", value: "chiquito" },
                { name: "🔉Doraemon", value: "doraemon" },
                { name: "🔉El Xokas", value: "elxokas" },
                { name: "🔉Glados (Portal)", value: "glados" },
                { name: "🔉Homer Simpson", value: "homersimpson" },
                { name: "🔉Illojuan", value: "illojuan" },
                { name: "🔉Mariano Rajoy", value: "marianorajoy" },
                { name: "🔉Matías Prats", value: "matiasprats" },
                { name: "🔉Shin-chan, Shinnosuke Nohara", value: "shinshan" },
                { name: "🔉Skippy (El mensajero de Dios)", value: "skippy" },
                { name: "🔉Sonic", value: "sonic" },
                { name: "🔉Vegetta777", value: "vegeta777" },
                { name: "🔉Yoda", value: "yoda" },
                { name: "🔉2Pac (Tupac Amaru Shakur)", value: "2pac" },
            ],
        },
        {
            type: 3,
            name: "texto",
            description: "Texto a enviar.",
            required: true,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const char = interaction.options.get("personaje").value;
        const text = interaction.options.get("texto").value;

        const found = await characters.find((e) => e.name === char);

        const fetchData = async () => {
            return await speak(found.value, text, interaction);
        };

        await interaction.deferReply({ content: "Cargando..." });
        const result = await fetchData();
        await interaction.editReply({ content: null, files: [result] });
    },
};
