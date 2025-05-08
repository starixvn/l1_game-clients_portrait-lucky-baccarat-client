import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label } from "cc";

const { property, ccclass } = _decorator;

@ccclass
export default class GameBetHistoryBetOption extends Component {
    @property(Label)
    choice: Label = null;

    @property(Label)
    stake: Label = null;

    protected convertChoiceData(choice: string): string {
        let betChoice = "";
        const choiceData = ["big", "small", "banker", "bankerPair", "player", "playerPair", "tie"];
        const choiceStr = [
            "Baccarat.glossary_big",
            "Baccarat.glossary_small",
            "Baccarat.glossary_banker",
            "Baccarat.banker_pair_shorten",
            "Baccarat.glossary_player",
            "Baccarat.player_pair_shorten",
            "Baccarat.glossary_tie",
        ];
        choiceData.forEach((item, index) => {
            if (choice === item) {
                betChoice = choiceStr[index];
            }
        });
        return betChoice;
    }

    handleBetOptionItem(choice: string, odd: string, stake: string) {
        const choiceStr = this.convertChoiceData(choice);
        this.choice.string = `${gc.Translator.translate(choiceStr)} @ ${odd}`;
        this.stake.string = stake;
    }

    highlightForWinning(win: boolean) {
        const color = win ? Color.YELLOW : Color.WHITE;
        this.choice.color = color;
        this.stake.color = color;
    }
}
