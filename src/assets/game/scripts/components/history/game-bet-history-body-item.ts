import { _decorator, Node, UIOpacity } from "cc";
import { BetHistoryBodyItemType } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";

import { BaccaratXBetHistorybodyItem } from "db://shared-components/game-baccarat/history/scripts/baccarat-x-bet-history-body-item";

const { ccclass, property } = _decorator;
@ccclass
export class GameBetHistoryBodyItem extends BaccaratXBetHistorybodyItem {
    
    
    @property({ type: Node, override: true, visible: false })
    result: Node = null;

    @property({ type: Node })
    iconVerify: Node = null;

    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        const { verifiable } = data.betHistoryLog;

        this.iconVerify.getComponent(UIOpacity).opacity = verifiable ? 225 : 125;
    }
}
