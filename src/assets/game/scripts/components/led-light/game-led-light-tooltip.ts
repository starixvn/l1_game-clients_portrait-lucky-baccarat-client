import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { GameBaccaratResultUtil } from "db://baccarat-shared-components/utils/game-result-util";
import { LedLightTooltipAlignment } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip-alignment";

const { ccclass, property } = _decorator;

@ccclass()
export class GameLedLightToolTip extends LedLightTooltipAlignment {
    @property(Label)
    lblPlayerTotalPoint: Label = null;

    @property(Label)
    lblBankerTotalPoint: Label = null;

    @property({ type: Label, override: true, visible: false })
    result: Label = null;

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        const { roundId, result } = ledLightInfo;
        this.roundId.string = `#${roundId}`;

        if (typeof result !== "object") {
            return;
        }

        const { playerScore, bankerScore } = GameBaccaratResultUtil.getScores(result);
        this.lblPlayerTotalPoint.string = `${playerScore}`;
        this.lblBankerTotalPoint.string = `${bankerScore}`;
    }
}
