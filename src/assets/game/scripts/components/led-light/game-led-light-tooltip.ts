import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
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
        const { banker, player } = result;

        this.lblPlayerTotalPoint.string = `${player?.score}`;
        this.lblBankerTotalPoint.string = `${banker?.score}`;
    }
}
