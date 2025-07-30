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

enum ScoreboardState {
    Normal = "normal",
    BeadRoadExpanded = "beadRoadExpanded",
    BigRoadExpanded = "bigRoadExpanded",
    DerivedRoadExpanded = "derivedRoadExpanded",
    DerivedRoadExpandedSmall = "derivedRoadExpandedSmall",
    BigRoadExpandedSmall = "bigRoadExpandedSmall",
}

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

    private readonly WIDTH_EXPAND_BEAD_ROAD = 561;
    private readonly WIDTH_COLLAPSE_BEAD_ROAD = 100;
    private readonly WIDTH_SPACING = 22;
    private readonly WIDTH_GAME = 828;
    private readonly WIDTH_SCOREBOARD_REDUNDANT = 2;

    private readonly UN_EXPAND_WIDTH = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEAD_ROAD - this.WIDTH_SCOREBOARD_REDUNDANT;
    private readonly EXPAND_WIDTH = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEAD_ROAD;

    onClickExpandMode() {
        this.isExpandBeadRoad = !this.isExpandBeadRoad;

        this.nodeBeadRoad.getComponent(UITransform).width = this.isExpandBeadRoad
            ? this.WIDTH_EXPAND_BEAD_ROAD
            : this.WIDTH_COLLAPSE_BEAD_ROAD;
        this.nodeWrapperVertical.getComponent(UITransform).width = this.isExpandBeadRoad ? this.UN_EXPAND_WIDTH : this.EXPAND_WIDTH;

        this.renderScoreBoard();

        this.nodeContainer.getComponent(Layout).updateLayout();

        const bigRoadLayout = this.nodeBigRoad.getComponent(GridLayout);
        bigRoadLayout.scrollToEnd();
    }

    private updateZoomButtonUI() {
        [this.nodeBigEyeBoy, this.nodeSmallRoad, this.nodeCockroachPig].forEach((node) => {
            this.updateZoomButton(node, this.isExpandDerivedRoad);
        });
        this.updateZoomButton(this.nodeBigRoad, this.isExpandBigRoad);
        this.updateZoomButton(this.expandedBeadRoad.node, this.isExpandBeadRoad);
    }

    private updateZoomButton(node: Node, isExpanded: boolean) {
        const btnZoom = node.getChildByName("btnZoom");
        const iconName = isExpanded ? "stats-icon-zoom-out" : "stats-icon-zoom";
        btnZoom.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(iconName);
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
        const state = this.getCurrentState();
        this.nodeBigRoad.active = !(state === ScoreboardState.DerivedRoadExpanded || state === ScoreboardState.DerivedRoadExpandedSmall);

        this.nodeBigEyeBoyLine.active = state === ScoreboardState.Normal;
        this.nodeBigEyeBoy.active =
            state === ScoreboardState.Normal ||
            state === ScoreboardState.DerivedRoadExpanded ||
            state === ScoreboardState.DerivedRoadExpandedSmall;
        this.nodeSmallRoad.active = state === ScoreboardState.Normal || state === ScoreboardState.DerivedRoadExpanded;

        this.nodeMiddleLine.active = !(state === ScoreboardState.BigRoadExpanded || state === ScoreboardState.BigRoadExpandedSmall);
        this.nodeCockroachPig.active = !this.isExpandBigRoad;
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
        const state = this.getCurrentState();
        this.applyStateConfig(state);
        this.updateBeadRoadUI();
        this.updateZoomButtonUI();
    }

    private getCurrentState(): ScoreboardState {
        const stateKey = `${this.isExpandBigRoad}-${this.isExpandDerivedRoad}-${this.isExpandBeadRoad}`;
        const stateMap = {
            "false-false-false": ScoreboardState.Normal,
            "false-false-true": ScoreboardState.BeadRoadExpanded,
            "false-true-false": ScoreboardState.DerivedRoadExpanded,
            "false-true-true": ScoreboardState.DerivedRoadExpandedSmall,
            "true-false-false": ScoreboardState.BigRoadExpanded,
            "true-false-true": ScoreboardState.BigRoadExpandedSmall,
        };
        return stateMap[stateKey] || ScoreboardState.Normal;
    }

    private applyStateConfig(state: ScoreboardState) {
        switch (state) {
            case ScoreboardState.Normal:
                this.applyNormalState();
                break;
            case ScoreboardState.BeadRoadExpanded:
                this.applyBeadRoadExpandedState();
                break;
            case ScoreboardState.DerivedRoadExpanded:
                this.applyDerivedRoadExpandedState();
                break;
            case ScoreboardState.DerivedRoadExpandedSmall:
                this.applyDerivedRoadExpandedSmallState();
                break;
            case ScoreboardState.BigRoadExpanded:
                this.applyBigRoadExpandedState();
                break;
            case ScoreboardState.BigRoadExpandedSmall:
                this.applyBigRoadExpandedSmallState();
                break;
        }
    }

    private applyNormalState() {
        const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
        this.updateScoreboardByConfig(bigRoadConfig.normal, this.nodeBigRoad);
        bigRoadScoreboard.render(bigRoadScoreboard.cached, { isRenderAgain: true });

        this.updateScoreboardByConfig(bigEyeBoyConfig.normal, this.nodeBigEyeBoy);
        this.updateScoreboardByConfig(smallRoadConfig.normal, this.nodeSmallRoad);
        this.updateScoreboardByConfig(cockroachPigConfig.normal, this.nodeCockroachPig);
        this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, { isRenderAgain: true });

        this.nodeMiddleLine.setPosition(0, midLineConfig.normalY);

        this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.normal.height;
    }

    private applyBeadRoadExpandedState() {
        const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
        this.updateScoreboardByConfig(bigRoadConfig.normalWithBeadRoadExpand, this.nodeBigRoad);
        bigRoadScoreboard.render(bigRoadScoreboard.cached, { isRenderAgain: true });

        this.updateScoreboardByConfig(cockroachPigConfig.expandSmall, this.nodeCockroachPig);
        this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, { isRenderAgain: true });

        this.nodeMiddleLine.setPosition(0, midLineConfig.normalY);
        this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.normal.height;
    }

    private applyDerivedRoadExpandedState() {
        this.updateScoreboardByConfig(bigEyeBoyConfig.expand, this.nodeBigEyeBoy);
        this.updateScoreboardByConfig(smallRoadConfig.expand, this.nodeSmallRoad);
        this.updateScoreboardByConfig(cockroachPigConfig.expand, this.nodeCockroachPig);
        this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, {
            isDefaultSize: false,
            isRenderAgain: true,
        });

        this.nodeMiddleLine.setPosition(0, midLineConfig.expandY);
        this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.expand.height;
    }

    private applyDerivedRoadExpandedSmallState() {
        this.updateScoreboardByConfig(bigEyeBoyConfig.expandSmall, this.nodeBigEyeBoy);
        this.updateScoreboardByConfig(cockroachPigConfig.normalWithBeadRoadExpand, this.nodeCockroachPig);
        this.baccaratDerivedRoad.render(this.baccaratDerivedRoad.cached, {
            isDefaultSize: false,
            isRenderAgain: true,
        });

        this.nodeMiddleLine.setPosition(0, midLineConfig.expandY);
        this.nodeSmallRoadLine.getComponent(UITransform).height = lineHeightConfig.expand.height;
    }

    private applyBigRoadExpandedState() {
        const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
        this.updateScoreboardByConfig(bigRoadConfig.expand, this.nodeBigRoad);
        bigRoadScoreboard.render(bigRoadScoreboard.cached, { isDefaultSize: false, isRenderAgain: true });
    }

    private applyBigRoadExpandedSmallState() {
        const bigRoadScoreboard = this.nodeBigRoad.getComponent(Scoreboard);
        this.updateScoreboardByConfig(bigRoadConfig.expandSmall, this.nodeBigRoad);
        bigRoadScoreboard.render(bigRoadScoreboard.cached, { isDefaultSize: false, isRenderAgain: true });
    }

    setWidthForNodes(nodes: Node[], width: number) {
        nodes.forEach((node) => {
            node && (node.getComponent(UITransform).width = width);
        });
    }
}
