const win = window as any;
export const languages = {
    "Bac81": {
        "game_name": "ラッキーバカラ"
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ja = languages;