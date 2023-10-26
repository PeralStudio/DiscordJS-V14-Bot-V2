declare abstract class ImageGenerator {
    abstract getImage(...args: any[]): Promise<Buffer>;
}

declare class DefaultImageGenerator extends ImageGenerator {
    getImage(avatar: string): Promise<Buffer>;
}

export class Blur extends ImageGenerator {
    getImage(avatar: string, level?: number): Promise<Buffer>;
}

export class Gay extends DefaultImageGenerator { }

export class Greyscale extends DefaultImageGenerator { }

export class Invert extends DefaultImageGenerator { }

export class Sepia extends DefaultImageGenerator { }

export class Blink extends ImageGenerator {
    getImage(delay: number, ...avatar: any[]): Promise<Buffer>;
}

export class Triggered extends DefaultImageGenerator { }

export class Ad extends DefaultImageGenerator { }

export class Affect extends DefaultImageGenerator { }

export class Batslap extends ImageGenerator {
    getImage(avatar: string, avatar2: string): Promise<Buffer>;
}

export class Beautiful extends DefaultImageGenerator { }

export class Bed extends ImageGenerator {
    getImage(avatar: string, avatar2: string): Promise<Buffer>;
}

export class Bobross extends DefaultImageGenerator { }

export class Clown extends DefaultImageGenerator { }

export class ConfusedStonk extends DefaultImageGenerator { }

export class Deepfry extends DefaultImageGenerator { }

export class Delete extends DefaultImageGenerator { }

export class DiscordBlack extends DefaultImageGenerator { }

export class DiscordBlue extends DefaultImageGenerator { }

export class DoubleStonk extends ImageGenerator {
    getImage(avatar: string, avatar2: string): Promise<Buffer>;
}

export class Facepalm extends DefaultImageGenerator { }

export class Heartbreaking extends DefaultImageGenerator { }

export class Hitler extends DefaultImageGenerator { }

export class Jail extends DefaultImageGenerator { }

export class Karaba extends DefaultImageGenerator { }

export class Kiss extends ImageGenerator {
    getImage(avatar: string, avatar2: string): Promise<Buffer>;
}

export class LisaPresentation extends ImageGenerator {
    getImage(text: string): Promise<Buffer>;
}

export class Mikkelsen extends DefaultImageGenerator { }

export class Mms extends DefaultImageGenerator { }

export class NotStonk extends DefaultImageGenerator { }

export class Podium extends ImageGenerator {
    getImage(
        avatar: string,
        avatar2: string,
        avatar3: string,
        name: string,
        name2: string,
        name3: string
    ): Promise<Buffer>;
}

export class Poutine extends DefaultImageGenerator { }

export class Rip extends DefaultImageGenerator { }

export class Snyder extends DefaultImageGenerator { }

export class Spank extends ImageGenerator {
    getImage(avatar: string, avatar2: string): Promise<Buffer>;
}

export class Stonk extends DefaultImageGenerator { }

export class Tatoo extends DefaultImageGenerator { }

export class Thomas extends DefaultImageGenerator { }

export class Trash extends DefaultImageGenerator { }

export class Wanted extends ImageGenerator {
    getImage(avatar: string, currency: string): Promise<Buffer>;
}

export class Circle extends DefaultImageGenerator { }

export class Color extends ImageGenerator {
    getImage(color: string): Promise<Buffer>;
}

export class Denoise extends ImageGenerator {
    getImage(avatar: string, level?: number): Promise<Buffer>;
}

export class Mirror extends ImageGenerator {
    getImage(avatar: string, horizontal?: boolean, vertical?: boolean): Promise<Buffer>;
}
