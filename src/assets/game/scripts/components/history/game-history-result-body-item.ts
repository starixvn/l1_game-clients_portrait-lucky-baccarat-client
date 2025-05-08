import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { FairnessCard3D } from "db://shared-components/game/poker-cards/scripts/fairness-card-3D";

const { ccclass, property } = _decorator;

@ccclass()
export class GameHistoryResultBodyItem extends BaseResultBodyItem {
    @property(Node)
    nodePlayerCards: Node = null;

    @property(Node)
    nodeBankerCards: Node = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        this.setCardsData(result.player as any, this.nodePlayerCards);
        this.setCardsData(result.banker as any, this.nodeBankerCards);
    }

    private setCardsData(data: any, cardNode: Node) {
        if (!data) return;

        const cards = cardNode.getComponentsInChildren(FairnessCard3D);
        const cardKeys = ["card1", "card2", "card3"];

        cardKeys.forEach((key, index) => {
            const cardData = data[key];
            if (cardData && cards[index]) {
                cards[index].setCardData({ rank: cardData.card, suit: cardData.type });
                cards[index].openCard(false, 0.1);
            } else {
                cards[index].node.active = false;
            }
        });
    }
}
