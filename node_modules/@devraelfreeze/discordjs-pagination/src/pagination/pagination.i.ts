import {
    ButtonInteraction,
    Embed,
    Message,
    User,
    ButtonStyle,
    CommandInteraction
} from "discord.js"

export interface PaginationOptions {
    /**
     * Interaction to reply with the pagination system
     */
    interaction?: CommandInteraction

    /**
     * Message to send the pagination system
     */
    message?: Message

    /**
     * Whether the reply should be ephemeral or not
     */
    ephemeral?: boolean

    /**
     * Author's user class
     */
    author: User

    /**
     * array of embed messages to paginate
     */
    embeds: Embed[]

    /**
     * customize your buttons!
     */
    buttons?: Buttons[]

    /**
     * Disable or remove buttons after timeout
     */
    disableButtons?: boolean

    /**
     * travel pages by sending page numbers?
     */
    pageTravel?: boolean

    /**
     * two additional buttons, a button to skip to the end and a button to skip to the first page
     */
    fastSkip?: boolean

    /**
     * how long before pagination get disabled
     */
    time?: number

    /**
     * maximum interactions before disabling the pagination
     */
    max?: number
    /**
     * custom filter for message component collector
     */
    customFilter?(interaction: ButtonInteraction): boolean
}

export const TypesButtons = {
    first: 1,
    previous: 2,
    next: 3,
    last: 4,
    number: 5
} as const;
export const StylesButton = {
    Primary: 1,
    Secondary: 2,
    Success: 3,
    Danger: 4,
    Link: 5
} as const;

type Keys = keyof typeof TypesButtons;
type Styles = keyof typeof StylesButton;
export type ButtonsValues = typeof TypesButtons[Keys];
export type StylesButtonValues = typeof StylesButton[Styles];

export interface Buttons {
    value: ButtonsValues
    label?: string|null
    emoji?: string|null
    style: StylesButtonValues
}