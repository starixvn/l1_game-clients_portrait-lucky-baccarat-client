const win = window as any;
export const languages = {
    "Bac81": {
        "game_name": "Lucky Baccarat"
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.es = languages;