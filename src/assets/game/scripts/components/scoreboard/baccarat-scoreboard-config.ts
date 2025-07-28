// Types for grid configuration
interface GridConfig {
    width: number;
    height: number;
    name: string;
}

interface ScoreboardConfigItem {
    x?: number;
    y?: number;
    col: number;
    size: number;
    grid: GridConfig;
}

interface PositionConfig {
    y: number;
    width: number;
}

interface SizeConfig {
    height: number;
}

interface BeadRoadConfigItem {
    col: number;
}

// Configuration interfaces
interface MidLineConfigType {
    normal: PositionConfig;
    expand: PositionConfig;
}

interface LineHeightConfigType {
    normal: SizeConfig;
    expand: SizeConfig;
}

interface RoadConfigType {
    normal: ScoreboardConfigItem;
    normalWithBeadRoadExpand: Partial<ScoreboardConfigItem>;
    expand: ScoreboardConfigItem;
    expandSmall: Partial<ScoreboardConfigItem>;
}

interface BeadRoadConfigType {
    normal: BeadRoadConfigItem;
    expand: BeadRoadConfigItem;
}

const STATS_GRID_1 = "stats-grid-1";
const STATS_GRID_2 = "stats-grid-2";
const STATS_GRID_EYE_BOY_ZOOM = "stats-grid-eyeboyzoom";
const STATS_GRID_BIG_ROAD = "stats-grid-bigroad";

// Exported configurations
export const midLineConfig: MidLineConfigType = {
    normal: {
        y: -130,
        width: 704,
    },
    expand: {
        y: -98,
        width: 240,
    },
};

export const lineHeightConfig: LineHeightConfigType = {
    normal: {
        height: 66,
    },
    expand: {
        height: 96,
    },
};

export const bigRoadConfig: RoadConfigType = {
    normal: {
        col: 32,
        size: 22,
        grid: {
            width: 22,
            height: 132,
            name: STATS_GRID_1,
        },
    },
    normalWithBeadRoadExpand: {
        col: 11,
        size: 22,
        grid: {
            width: 22,
            height: 132,
            name: STATS_GRID_1,
        },
    },
    expand: {
        col: 21,
        size: 33,
        grid: {
            width: 33,
            height: 198,
            name: STATS_GRID_BIG_ROAD,
        },
    },
    expandSmall: {
        col: 7,
        size: 33,
        grid: {
            width: 33,
            height: 198,
            name: STATS_GRID_BIG_ROAD,
        },
    },
};

export const bigEyeBoyConfig: RoadConfigType = {
    normal: {
        x: 0,
        y: 0,
        col: 22,
        size: 11,
        grid: {
            width: 22,
            height: 66,
            name: STATS_GRID_2,
        },
    },
    normalWithBeadRoadExpand: {
        x: 0,
        y: 116,
        col: 15,
        size: 16,
        grid: {
            width: 32,
            height: 96,
            name: STATS_GRID_EYE_BOY_ZOOM,
        },
    },
    expand: {
        x: 0,
        y: 116,
        col: 44,
        size: 16,
        grid: {
            width: 32,
            height: 96,
            name: STATS_GRID_EYE_BOY_ZOOM,
        },
    },
    expandSmall: {
        x: 0,
        y: 116,
        col: 15,
        size: 16,
        grid: {
            width: 32,
            height: 96,
            name: STATS_GRID_EYE_BOY_ZOOM,
        },
    },
};

export const smallRoadConfig: RoadConfigType = {
    normal: {
        x: 242,
        y: -33,
        col: 20,
        size: 11,
        grid: {
            width: 22,
            height: 66,
            name: STATS_GRID_2,
        },
    },
    normalWithBeadRoadExpand: {},
    expand: {
        x: 0,
        y: -30,
        col: 22,
        size: 16,
        grid: {
            width: 32,
            height: 96,
            name: STATS_GRID_EYE_BOY_ZOOM,
        },
    },
    expandSmall: {},
};

export const cockroachPigConfig: RoadConfigType = {
    normal: {
        x: 462,
        y: -33,
        col: 22,
        size: 11,
        grid: {
            width: 22,
            height: 66,
            name: STATS_GRID_2,
        },
    },
    normalWithBeadRoadExpand: {
        x: 0,
        y: -30,
        col: 15,
        size: 16,
        grid: {
            width: 32,
            height: 96,
            name: STATS_GRID_EYE_BOY_ZOOM,
        },
    },
    expand: {
        x: 352,
        y: -30,
        col: 22,
        size: 16,
        grid: {
            width: 32,
            height: 96,
            name: STATS_GRID_EYE_BOY_ZOOM,
        },
    },
    expandSmall: {
        x: 0,
        y: -30,
        col: 22,
        size: 11,
        grid: {
            width: 22,
            height: 66,
            name: STATS_GRID_2,
        },
    },
};

export const beadRoadConfig: BeadRoadConfigType = {
    normal: {
        col: 3,
    },
    expand: {
        col: 17,
    },
};