import gc from "@sg/game-client-base";
import { _decorator, Button, instantiate, Label, Node, Prefab } from "cc";
import { BetHistoryNewBodyItem } from "db://shared-components/game/bet-history-new/scripts/bet-history-new-body-item";
import { BetHistoryBodyItemType } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";

import GameBetHistoryBetOption from "./game-bet-history-bet-option";

const { ccclass, property } = _decorator;

type SeDieBetHistoryBodyItemType = BetHistoryBodyItemType & {
    betsPrefab: Prefab | null;
};

const { DateTimeUtils, FormatUtils } = gc;

@ccclass
export class GameBetHistoryBodyItem extends BetHistoryNewBodyItem {
    @property({ type: Label, override: true, visible: false })
    lblTime: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblTotalStake: Label = null;

    @property({ type: Button, override: true, visible: false })
    btnRound: Button = null;

    @property(Node)
    betOption: Node = null;

    @property(Prefab)
    betsPrefab: Prefab = null;

    setData(data: SeDieBetHistoryBodyItemType) {
        super.setData(data);
        const { time, settlementResult, freeBet, odds } = data.betHistoryLog;
        if (time) {
            const date = DateTimeUtils.getStringDate(time);
            const hour = DateTimeUtils.getStringHourByTime(time);
            this.lblDate && (this.lblDate.string = date);
            this.lblHour && (this.lblHour.string = hour);
        }

        if (settlementResult) {
            Object.keys(settlementResult).forEach((choice) => {
                const node = instantiate(this.betsPrefab);
                const option = node.getComponent(GameBetHistoryBetOption);
                let stake = data.betHistoryLog[choice];
                if (+stake > 0) {
                    stake = freeBet ? 0 : stake;
                    const odd = this.getFormatOdd(odds[choice]?.toString(), data?.fractionalOddsFormat);
                    option.handleBetOptionItem(choice, odd, FormatUtils.numberWithCommas(stake));
                    option.highlightForWinning(settlementResult[choice]);
                    this.betOption.addChild(node);
                }
            });
        }
    }
}
