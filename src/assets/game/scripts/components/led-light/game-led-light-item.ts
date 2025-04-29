import gc from "@sg/game-client-base";
import { _decorator, SpriteAtlas, SpriteFrame } from "cc";
import { LedLightItem } from "db://shared-components/game/led-light/scripts/components/led-light-item";
import { LedLightItemModel } from "db://shared-components/game/led-light/scripts/components/led-light-item-model";

const { ccclass, property } = _decorator;

@ccclass("GameLedLightItem")
export class GameLedLightItem extends LedLightItem {
    @property({ override: true, visible: false })
    itemModel: LedLightItemModel[] = [];

    @property(SpriteAtlas)
    spriteAtlas: SpriteAtlas = null;
    private readonly choiceNames = ["banker", "player", "tie"];

    protected getSpriteFrameFromSettlement(settlementResult: gc.GameServiceMessage.TSettlementResult): SpriteFrame {
        let spriteFrame: SpriteFrame = null;

        this.choiceNames.forEach((item) => {
            const frame = this.spriteAtlas.getSpriteFrame(`led-stats-${item}_${gc.Translator.getLanguageId()}`);
            if (settlementResult[item]) {
                spriteFrame = frame;
            }
        });
        return spriteFrame;
    }
}
