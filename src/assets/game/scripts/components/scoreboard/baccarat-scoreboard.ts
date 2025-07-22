import { _decorator, Component, Layout, Node, Sprite, SpriteAtlas, UITransform } from "cc";
import { Scoreboard } from "db://shared-components/game/scoreboards/scripts/components/scoreboard";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";

const { ccclass, property } = _decorator;

@ccclass()
export class BaccaratScoreBoard extends Component {
    @property(Node)
    nodeBeadRoad: Node = null;

    @property(Node)
    nodeWrapperVertical: Node = null;

    @property(Node)
    nodeContainer: Node = null;

    @property(Node)
    nodeBigRoad: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    @property(Sprite)
    sprChangeModeBeadRoad: Sprite = null;

    @property(Scoreboard)
    expandedBeadRoad: Scoreboard = null;

    @property(Scoreboard)
    collapsedBeadRoad: Scoreboard = null;

    @property(Scoreboard)
    collapsedDerivedRoad: Scoreboard = null;

    private isExpandBeadRoad = false;
    private readonly zoomModes = {
        normal: "normal",
        zoomInBigRoad: "zoomInBigRoad",
        zoomInDerivedRoad: "zoomInDerivedRoad",
        collapsedDerivedRoad: "collapsedDerivedRoad",
    };

    private readonly WIDTH_EXPAND_BEADROAD = 561;
    private readonly WIDTH_COLLAPSE_BEADROAD = 100;
    private readonly WIDTH_SPACING = 22;
    private readonly WIDTH_GAME = 828;

    protected start(): void {
        this.zoom(undefined, this.zoomModes.normal);
    }

    getCurrentZoomMode(): string {
        if (this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active) {
            return this.zoomModes.normal;
        } else if (this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active) {
            return this.zoomModes.zoomInBigRoad;
        } else if (this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active) {
            return this.zoomModes.zoomInDerivedRoad;
        } else if (this.nodeWrapperVertical.getChildByName(this.zoomModes.collapsedDerivedRoad).active) {
            return this.zoomModes.collapsedDerivedRoad;
        }
        return this.zoomModes.normal;
    }

    onClickExpandMode() {
        const currentZoomMode = this.getCurrentZoomMode();
        this.isExpandBeadRoad = !this.isExpandBeadRoad;

        const bigRoadZoomIn = this.nodeWrapperVertical.getChildByName("zoomInBigRoad");

        const nodes = [
            this.nodeWrapperVertical,
            this.nodeBigRoad,
            bigRoadZoomIn.children[0],
            bigRoadZoomIn.children[1],
            this.nodeBigRoad.children[0],
            this.nodeBigRoad.children[1],
        ];
        this.nodeWrapperVertical.children.forEach((child) => {
            nodes.push(child);
        });

        if (this.isExpandBeadRoad) {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_EXPAND_BEADROAD;
            this.setWidthForNodes(nodes, this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEADROAD);
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-zoom-out");
            this.expandedBeadRoad.node.active = true;
            this.collapsedBeadRoad.node.active = false;
        } else {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_COLLAPSE_BEADROAD;
            this.setWidthForNodes(nodes, this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD);
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-zoom");
            this.expandedBeadRoad.node.active = false;
            this.collapsedBeadRoad.node.active = true;
        }
        this.nodeContainer.getComponent(Layout).updateLayout();

        const bigRoadLayout = this.nodeBigRoad.getComponent(GridLayout);
        const bigRoadZoomInLayout = bigRoadZoomIn.getComponent(GridLayout);
        bigRoadLayout.scrollToEnd();
        bigRoadZoomInLayout.scrollToEnd();

        // Switch between derived road modes when expanding/collapsing
        if (currentZoomMode === this.zoomModes.zoomInDerivedRoad && this.isExpandBeadRoad) {
            this.zoom(undefined, this.zoomModes.collapsedDerivedRoad);
        } else if (currentZoomMode === this.zoomModes.collapsedDerivedRoad && !this.isExpandBeadRoad) {
            this.zoom(undefined, this.zoomModes.zoomInDerivedRoad);
        } else {
            // Maintain current zoom mode for other cases
            this.zoom(undefined, currentZoomMode);
        }
    }

    zoom(event: any, mode: string) {
        switch (mode) {
            case this.zoomModes.normal:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = true;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.collapsedDerivedRoad).active = false;
                break;

            case this.zoomModes.zoomInBigRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = true;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.collapsedDerivedRoad).active = false;
                break;

            case this.zoomModes.zoomInDerivedRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;

                if (this.isExpandBeadRoad) {
                    this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                    this.nodeWrapperVertical.getChildByName(this.zoomModes.collapsedDerivedRoad).active = true;
                } else {
                    this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = true;
                    this.nodeWrapperVertical.getChildByName(this.zoomModes.collapsedDerivedRoad).active = false;
                }
                break;

            case this.zoomModes.collapsedDerivedRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.collapsedDerivedRoad).active = true;
                break;
        }

        
    }

    setWidthForNodes(nodes: Node[], width: number) {
        nodes.forEach((node) => {
            node && (node.getComponent(UITransform).width = width);
        });
    }
}
