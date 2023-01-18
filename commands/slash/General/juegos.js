const Gamecord = require("discord-gamecord");

module.exports = {
    name: "juegos",
    description: "Lista de juegos disponibles.",
    type: 1,
    options: [
        {
            type: 3,
            name: "juego",
            description: "Juegos disponibles",
            required: true,
            choices: [
                { name: "🆎 Wordle 🆎", value: "wordle" },
                { name: "🐍 Snake 🐍", value: "snake" },
                { name: "🎩 Ahorcado 🎩", value: "ahorcado" },
                { name: "💣 buscaminas 💣", value: "buscaminas" },
                { name: "🔎 Busca el Emoji 🔎", value: "buscaelemoji" },
                { name: "🤔 Acierta el Pokemon 🤔", value: "aciertaelpokemon" },
                { name: "🔖 ¿Qué prefieres? 🔖", value: "queprefieres" },
                { name: "🧩 parejas 🧩", value: "parejas" },
                { name: "🔢 2048 🔢", value: "2048" },
                { name: "🧨 Inundación 🧨", value: "inundacion" },
                { name: "📝 Dedos Ágiles 📝", value: "dedosagiles" },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
    },
    run: async (client, interaction, config) => {
        const selected = interaction.options.data[0].value;

        const Snake = new Gamecord.Snake({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Snake Game",
                overTitle: "Game Over",
                color: "#5865F2",
            },
            emojis: {
                board: "⬛",
                food: "🍎",
                up: "⬆️",
                down: "⬇️",
                left: "⬅️",
                right: "➡️",
            },
            stopButton: "Salir",
            timeoutTime: 120000,
            snake: { head: "🟢", body: "🟩", tail: "🟢", over: "💀" },
            foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const Minesweeper = new Gamecord.Minesweeper({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Buscaminas",
                color: "#5865F2",
                description: "Haz click en los botones para revelar los bloques excepto las minas.",
            },
            emojis: { flag: "🚩", mine: "💣" },
            mines: 5,
            timeoutTime: 120000,
            winMessage: "¡Ganaste el juego! Has evitado con éxito todas las minas.",
            loseMessage: "💥 ¡Perdiste el juego!\nCuidado con las minas la próxima vez.",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const TwoZeroFourEight = new Gamecord.TwoZeroFourEight({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "CÓMO JUGAR: Utiliza las flechas para mover las fichas.\nLos mosaicos con el mismo número se fusionan en uno cuando se tocan.\n¡Súmalos para llegar a 2048!",
                color: "#5865F2",
            },
            emojis: {
                up: "⬆️",
                down: "⬇️",
                left: "⬅️",
                right: "➡️",
            },
            timeoutTime: 120000,
            buttonStyle: "PRIMARY",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const GuessThePokemon = new Gamecord.GuessThePokemon({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Who's The Pokemon",
                color: "#5865F2",
            },
            timeoutTime: 120000,
            winMessage: "¡Lo Adivinaste! Era un {pokemon}.",
            loseMessage: "¡Mejor suerte la próxima vez! Era un {pokemon}.",
            errMessage: "¡No se pueden obtener los datos de Pokémon! Inténtalo de nuevo.",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const MatchPairs = new Gamecord.MatchPairs({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Parejas",
                color: "#5865F2",
                description: "**Haz click en los botones para unir emojis con su pareja.**",
            },
            timeoutTime: 120000,
            emojis: ["🍉", "🍇", "🍊", "🥭", "🍎", "🍏", "🥝", "🥥", "🍓", "🫐", "🍍", "🥕", "🥔"],
            winMessage: "**¡Ganaste el juego! Emparejaste un total de `{tilesTurned}` fichas.**",
            loseMessage: "**¡Perdiste el juego! Emparejaste un total de `{tilesTurned}` fichas.**",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const WouldYouRather = new Gamecord.WouldYouRather({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "¿Qué prefieres?",
                color: "#5865F2",
            },
            buttons: {
                option1: "Opción 1",
                option2: "Opción 2",
                option3: "Terminar",
            },
            timeoutTime: 120000,
            errMessage: "¡No se pueden obtener los datos de la pregunta! Inténtalo de nuevo.",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const Flood = new Gamecord.Flood({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Inundación",
                color: "#5865F2",
            },
            //Gamemodes
            // Easy Mode   => 8
            // Normal Mode => 13
            // Hard Mode   => 18
            difficulty: 13,
            timeoutTime: 120000,
            buttonStyle: "PRIMARY",
            emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
            winMessage: "¡Ganaste! Jugaste **{turns}** turnos.",
            loseMessage: "¡Perdiste! Jugaste **{turns}** turnos.",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const FindEmoji = new Gamecord.FindEmoji({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Busca el Emoji",
                color: "#5865F2",
                description: "Recuerda los emojis del tablero de abajo.",
                findDescription: "Encuentra el {emoji} emoji antes de que se acabe el tiempo.",
            },
            timeoutTime: 120000,
            hideEmojiTime: 5000,
            buttonStyle: "PRIMARY",
            emojis: ["🍉", "🍇", "🍊", "🍋", "🥭", "🍎", "🍏", "🥝"],
            winMessage: "¡Ganaste! Seleccionaste el emoji correcto. {emoji}",
            loseMessage: "¡Perdiste! Seleccionaste el emoji equivocado. {emoji}",
            timeoutMessage: "¡Perdiste! Te has quedado sin tiempo. El emoji es {emoji}",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const Hangman = new Gamecord.Hangman({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Ahorcado",
                color: "#5865F2",
            },
            hangman: { hat: "🎩", head: "😟", shirt: "👕", pants: "🩳", boots: "👞👞" },
            customWord: "",
            timeoutTime: 120000,
            theme: "palabras",
            winMessage: "¡Ganaste! la palabra era **{word}**.",
            loseMessage: "¡Perdiste! la palabra era **{word}**.",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        const FastType = new Gamecord.FastType({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Dedos Ágiles",
                color: "#5865F2",
                description: "Tienes {time} segundos para escribir la siguiente oración.",
            },
            timeoutTime: 120000,
            sentence: "",
            winMessage: "¡Ganaste! Terminaste en {time} segundos con {wpm}ppm.",
            loseMessage: "¡Perdiste! No escribiste la frase correcta a tiempo.",
        });

        const Wordle = new Gamecord.Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Wordle",
                color: "#5865F2",
                description: "Adivina la palabra oculta en 6 intentos",
            },
            customWord: null,
            timeoutTime: 120000,
            winMessage: "¡Ganaste! la palabra era **{word}**.",
            loseMessage: "¡Perdiste! la palabra era **{word}**.",
            playerOnlyMessage: "Solo {player} puede usar estos botones.",
        });

        switch (selected) {
            case "snake":
                Snake.startGame();
                break;
            case "buscaminas":
                Minesweeper.startGame();
                break;
            case "2048":
                TwoZeroFourEight.startGame();
                break;
            case "aciertaelpokemon":
                GuessThePokemon.startGame();
                break;
            case "parejas":
                MatchPairs.startGame();
                break;
            case "queprefieres":
                WouldYouRather.startGame();
                break;
            case "inundacion":
                Flood.startGame();
                break;
            case "buscaelemoji":
                FindEmoji.startGame();
                break;
            case "ahorcado":
                Hangman.startGame();
                break;
            case "dedosagiles":
                FastType.startGame();
                break;
            case "wordle":
                Wordle.startGame();
                break;
        }
    },
};
