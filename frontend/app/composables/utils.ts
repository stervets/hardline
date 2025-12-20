export function getComponentInstance(): ComponentInstance {
    return getCurrentInstance()!.proxy as ComponentInstance;
}

export function genId(): string {
    return crypto.randomUUID();
}

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Не удалось скопировать текст в буфер обмена:', err);
        return false;
    }
}

export const timeout = (delay: number = 0) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function firstLetterUpperCase(s: string) {
    return s[0]?.toUpperCase() + s.substring(1).toLowerCase();
}