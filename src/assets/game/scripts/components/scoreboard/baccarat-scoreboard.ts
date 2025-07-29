import { _decorator, Component, Layout, Node, Sprite, SpriteAtlas, UITransform } from "cc";
import { Scoreboard } from "db://shared-components/game/scoreboards/scripts/components/scoreboard";
import { ScoreboardDerived } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-derived";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";
import { GridLayoutBuilder } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout-builder";
import {
    beadRoadConfig,
    bigEyeBoyConfig,
    bigRoadConfig,
    cockroachPigConfig,
    lineHeightConfig,
    midLineConfig,
    smallRoadConfig,
} from "./baccarat-scoreboard-config";

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

    @property(Node)
    nodeBigEyeBoy: Node = null;

    @property(Node)
    nodeSmallRoad: Node = null;

    @property(Node)
    nodeCockroachPig: Node = null;

    @property(Node)
    nodeMiddleLine: Node = null;

    @property(Node)
    nodeBigEyeBoyLine: Node = null;

    @property(Node)
    nodeSmallRoadLine: Node = null;

    @property(ScoreboardDerived)
    baccaratDerivedRoad: ScoreboardDerived = null;

    private isExpandBeadRoad = false;
    private isExpandBigRoad = false;
    private isExpandDerivedRoad = false;
    private readonly zoomModes = {
        bigRoad: "zoomInBigRoad",
        derivedRoad: "zoomInDerivedRoad",
    };

    private readonly WIDTH_EXPAND_BEADROAD = 561;
    private readonly WIDTH_COLLAPSE_BEADROAD = 100;
    private readonly WIDTH_SPACING = 22;
    private readonly WIDTH_GAME = 828;
    private readonly UN_EXPAND_WIDTH = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEADROAD;
    private readonly EXPAND_WIDTH = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD;

    onClickExpandMode() {
        this.isExpandBeadRoad = !this.isExpandBeadRoad;

        this.nodeBeadRoad.getComponent(UITransform).width = this.isExpandBeadRoad
            ? this.WIDTH_EXPAND_BEADROAD
            : this.WIDTH_COLLAPSE_BEADROAD;
        this.nodeWrapperVertical.getComponent(UITransform).width = this.isExpandBeadRoad ? this.UN_EXPAND_WIDTH : this.EXPAND_WIDTH;

        this.renderScoreBoard();

        this.nodeContainer.getComponent(Layout).updateLayout();

        const bigRoadLayout = this.nodeBigRoad.getComponent(GridLayout);
        bigRoadLayout.scrollToEnd();
    }

    private updateZoomButtonUI() {
        const zoomOutIcon = "stats-icon-zoom-out";
        const zoomInIcon = "stats-icon-zoom";
        this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame(this.isExpandBeadRoad ? zoomOutIcon : zoomInIcon);

        const btnZoomBigRoad = this.nodeBigRoad.getChildByName("btnZoom");
        btnZoomBigRoad.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(this.isExpandBigRoad ? zoomOutIcon : zoomInIcon);

        [this.nodeBigEyeBoy, this.nodeSmallRoad, this.nodeCockroachPig].forEach((node) => {
            const btnZoom = node.getChildByName("btnZoom");
            btnZoom.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(this.isExpandDerivedRoad ? zoomOutIcon : zoomInIcon);
        });
    }

    private updateBeadRoadUI() {
        const expandedBeadRoadLayout = this.expandedBeadRoad.getComponent(GridLayoutBuilder);
        const beadRoadConfigItem = this.isExpandBeadRoad ? beadRoadConfig.expand : beadRoadConfig.normal;
        expandedBeadRoadLayout.settings.column = beadRoadConfigItem.col;
        expandedBeadRoadLayout.applySettings();

        const expandedBeadRoadScoreboard = this.expandedBeadRoad.getComponent(Scoreboard);
        expandedBeadRoadScoreboard.render(expandedBeadRoadScoreboard.cached, { isRenderAgain: true });
    }

    private resetUI() {
        this.nodeBigEyeBoy.active = !this.isExpandBigRoad;
        this.nodeSmallRoad.active = !this.isExpandBigRoad;
        this.nodeCockroachPig.active = !this.isExpandBigRoad;
        this.nodeMiddleLine.active = true;
        this.nodeBigRoad.active = true;
    }

    zoom(event: any, mode: string) {
        switch (mode) {
            case this.zoomModes.bigRoad:
                this.isExpandBigRoad = !this.isExpandBigRoad;
                break;

            case this.zoomModes.derivedRoad:
                this.isExpandDerivedRoad = !this.isExpandDerivedRoad;
                break;
        }

        this.renderScoreBoard();
    }

    private updateScoreboardByConfig(config: any, node: Node) {
        if (!config || !node) {
            console.log("invalid config or node for updateScoreboardByConfig");
            return;
        }
        const layoutBuilder = node.getComponent(GridLayoutBuilder);
        layoutBuilder.settings.column = config.col;
        layoutBuilder.settings.itemSize = config.size;
        layoutBuilder.grid.itemSettings.size = config.size;

        config.x !== undefined && config.y !== undefined && node.setPosition(config.x, config.y);
        const grid = layoutBuilder.grid.scrollView.node.getChildByName("grid");
        grid.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(config.grid.name);
        grid.getComponent(UITransform).width = config.grid.width;
        grid.getComponent(UITransform).height = config.grid.height;

        layoutBuilder.applySettings();
    }

    private renderScoreBoard() {
        this.resetUI();

        if (!this.isExpandBigRoad && !this.isExpandDerivedRoad && !this.isExpandBeadRoad) {
            this.updateScoreboardByConfig(bigRoadConfig.normal, this.nodeBigRoad);

            const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
            bigRoadScoreboard.render(bigRoadScoreboard.cached, { isRenderAgain: true });

            this.updateScoreboardByConfig(bigEyeBoyConfig.normal, this.nodeBigEyeBoy);
            this.updateScoreboardByConfig(smallRoadConfig.normal, this.nodeSmallRoad);
            this.updateScoreboardByConfig(cockroachPigConfig.normal, this.nodeCockroachPig);

            this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, { isRenderAgain: true });

            this.nodeMiddleLine.setPosition(0, midLineConfig.normal.y);
            this.nodeMiddleLine.getComponent(UITransform).width = midLineConfig.normal.width;
            this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.normal.height;

            this.nodeBigEyeBoyLine.active = true;
            this.nodeSmallRoad.active = true;
        } else if (!this.isExpandBigRoad && !this.isExpandDerivedRoad && this.isExpandBeadRoad) {
            this.updateScoreboardByConfig(bigRoadConfig.normalWithBeadRoadExpand, this.nodeBigRoad);

            const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
            bigRoadScoreboard.render(bigRoadScoreboard.cached, { isRenderAgain: true });

            this.updateScoreboardByConfig(cockroachPigConfig.expandSmall, this.nodeCockroachPig);

            this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, { isRenderAgain: true });

            this.nodeMiddleLine.setPosition(0, midLineConfig.normal.y);
            this.nodeMiddleLine.getComponent(UITransform).width = midLineConfig.expand.width;
            this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.normal.height;

            this.nodeBigEyeBoyLine.active = false;
            this.nodeBigEyeBoy.active = false;
            this.nodeSmallRoad.active = false;
        } else if (!this.isExpandBigRoad && this.isExpandDerivedRoad && !this.isExpandBeadRoad) {
            this.updateScoreboardByConfig(bigEyeBoyConfig.expand, this.nodeBigEyeBoy);
            this.updateScoreboardByConfig(smallRoadConfig.expand, this.nodeSmallRoad);
            this.updateScoreboardByConfig(cockroachPigConfig.expand, this.nodeCockroachPig);

            this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, {
                isDefaultSize: false,
                isRenderAgain: true,
            });

            this.nodeBigRoad.active = false;
            this.nodeMiddleLine.setPosition(0, midLineConfig.expand.y);
            this.nodeMiddleLine.getComponent(UITransform).width = midLineConfig.normal.width;
            this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.expand.height;
            this.nodeSmallRoad.active = true;
            this.nodeBigEyeBoyLine.active = false;
        } else if (!this.isExpandBigRoad && this.isExpandDerivedRoad && this.isExpandBeadRoad) {
            this.updateScoreboardByConfig(bigEyeBoyConfig.expandSmall, this.nodeBigEyeBoy);
            this.nodeSmallRoad.active = false;
            this.updateScoreboardByConfig(cockroachPigConfig.normalWithBeadRoadExpand, this.nodeCockroachPig);

            this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, {
                isDefaultSize: false,
                isRenderAgain: true,
            });

            this.nodeBigRoad.active = false;

            this.nodeMiddleLine.setPosition(0, midLineConfig.expand.y);
            this.nodeMiddleLine.getComponent(UITransform).width = midLineConfig.expand.width;
            this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.expand.height;
            this.nodeSmallRoad.active = false;
            this.nodeBigEyeBoyLine.active = false;
        } else if (this.isExpandBigRoad && !this.isExpandDerivedRoad && !this.isExpandBeadRoad) {
            this.updateScoreboardByConfig(bigRoadConfig.expand, this.nodeBigRoad);

            const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
            bigRoadScoreboard.render(bigRoadScoreboard.cached, { isDefaultSize: false, isRenderAgain: true });

            this.nodeMiddleLine.active = false;
            this.nodeBigEyeBoy.active = false;
            this.nodeSmallRoad.active = false;
            this.nodeBigEyeBoyLine.active = false;
        } else if (this.isExpandBigRoad && !this.isExpandDerivedRoad && this.isExpandBeadRoad) {
            this.updateScoreboardByConfig(bigRoadConfig.expandSmall, this.nodeBigRoad);

            const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
            bigRoadScoreboard.render(bigRoadScoreboard.cached, { isDefaultSize: false, isRenderAgain: true });

            this.nodeMiddleLine.active = false;
            this.nodeBigEyeBoy.active = false;
            this.nodeSmallRoad.active = false;
            this.nodeBigEyeBoyLine.active = false;
        }

        this.updateBeadRoadUI();

        this.updateZoomButtonUI();
    }

    setWidthForNodes(nodes: Node[], width: number) {
        nodes.forEach((node) => {
            node && (node.getComponent(UITransform).width = width);
        });
    }
}
