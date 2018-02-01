import { RoadMap, IMapCell } from './libs/road_map';

class Xo implements IMapCell {
    canWalkThrough: boolean;
    visited: boolean;
    visible: boolean;
    distance: number;
    color: string | undefined;
    canClick: boolean;
    el: XoElement;
    x: number;
    y: number;
    setColor(color: string) {
        $(this.el).addClass('xo-' + color).find('.xo-inner').text('');
        this.color = color;
    }
    reset() {
        $(this.el).attr('class', 'xo').find('.xo-inner').text('');
        this.color = undefined;
    }
}

type XoElement = Element & { element: Xo };
class XoMap extends RoadMap {
    width = 3;
    height = 3;

    grid: Xo[][] = [];
    els: XoElement[] = [];
    wrapper = $('#main');

    padding = 10;

    constructor() {
        super(3, 3);

        this.wrapper.on('click', '.xo', (e) => {
            const target = e.currentTarget;
            const xo = target.element as Xo;
            if (xo.color) {
                return;
            }
            const playerColor = this.currentColor;
            xo.setColor(this.toggleColor());
            const xos = [xo];

            // 这里判定一下是否胜利
            const playerScore = caculateValue(this.grid, playerColor, this.currentColor);
            console.log('playerScore', playerScore);

            if (playerScore === 100) {
                setTimeout(() => {
                    alert('you win');
                    this.resetGrid();
                }, 100);
                return;
            }
            // 响应
            const computerColor = this.currentColor;
            const dos = predict2(this.grid, computerColor);
            if (dos) {
                const echo = dos;
                console.log(echo);

                echo.setColor(this.toggleColor());
                xos.push(echo);
            }

            // 这里判定一下是否胜利
            const computerScore = caculateValue(this.grid, computerColor, this.currentColor);
            console.log('computerScore', computerScore);
            if (computerScore === 100) {
                setTimeout(() => {
                    alert('com win');
                    this.resetGrid();
                }, 100);
                return;
            }
            this.undos.push(xos);
            this.redos.length = 0;
        });
    }
    currentColor = 'black';
    toggleColor() {
        const ret = this.currentColor;
        if (ret === 'black') {
            this.currentColor = 'white';
        } else {
            this.currentColor = 'black';
        }
        return ret;
    }
    generateXoMap() {

        for (let indexY = 0; indexY < this.height; indexY++) {
            const row = [] as Xo[];
            this.grid.push(row);
            for (let indexX = 0; indexX < this.width; indexX++) {
                const element = new Xo();
                element.x = indexX;
                element.y = indexY;

                const $el = $(`<div class="xo"><div class="xo-inner"></div></div>`).appendTo(this.wrapper);
                element.el = $el.get(0);
                element.el.element = element;
                row.push(element);
                this.els.push(element.el);
            }
        }
    }
    resetGrid() {
        this.els.forEach((el) => {
            el.element.reset();
        });
        this.currentColor = 'black';
        this.undos.length = 0;
    }
    undos = [] as Xo[][];
    redos = [] as Array<{ xos: Xo[], color: string }>;
    undo() {
        const xos = this.undos.pop();
        if (xos) {
            const thisStepColor = xos[0].color as string;
            for (let i = 0; i < xos.length; i++) {
                const element = xos[i];
                element.reset();
            }
            this.currentColor = thisStepColor;
            this.redos.push({ xos, color: thisStepColor });
            this.checkGridValue();
        }
    }
    redo() {
        const redo = this.redos.pop();
        if (redo) {
            for (let i = 0; i < redo.xos.length; i++) {
                const element = redo.xos[i];
                element.setColor(redo.color);
                this.currentColor = redo.color;
            }
            this.toggleColor();
            this.undos.push(redo.xos);
            this.checkGridValue();
        }
    }

    checkGridValue() {
        const gridClone = cloneGrid(this.grid);
        for (let indexY = 0; indexY < this.height; indexY++) {
            const row = gridClone[indexY];
            for (let indexX = 0; indexX < this.width; indexX++) {
                const xo = row[indexX];
                if (!xo.color) {
                    xo.color = this.currentColor;
                    xo.color = undefined;
                }
            }
        }
    }
}

const rows = [
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],

    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],

    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
];

function cloneGrid(map: Xo[][]) {
    return map.slice(0)
        .map((row) => row.slice(0).map((xo) => {
            const ret = new Xo();
            ret.color = xo.color;
            ret.el = xo.el;
            ret.x = xo.x;
            ret.y = xo.y;

            return ret;
        }));
}

function caculateValue(map: Xo[][], color: string, nextPlayerColor: string) {

    const rowInfo = rows.map((row) => {
        const rowPoints = row.map((pos) => map[pos[1]][pos[0]].color)
            .map((posColor) => posColor ? posColor === color ? 1 : -1 : 0) as number[];

        let rawPoints = 0;
        if (!rowPoints.filter(x => x === -1).length) {
            rawPoints = rowPoints.reduce((pre, cur) => pre + cur, 0);
        }
        if (!rowPoints.filter(x => x === 1).length) {
            rawPoints = rowPoints.reduce((pre, cur) => pre + cur, 0);
        }

        return {
            rowPoints,
            rawPoints,
        };
    });

    // 
    // 所以这里应该有一个正常的估值算法
    // 参考五子棋，应该以获胜手段给不同的估分，以最高分结算
    // 同时需要考虑先后手
    // 
    if (rowInfo.filter((x) => x.rawPoints === 3).length) {
        // 胜利
        return 100;
    }
    if (rowInfo.filter((x) => x.rawPoints === -3).length) {
        // 失败
        return -200;
    }
    if (nextPlayerColor == color) {
        if (rowInfo.filter((x) => x.rawPoints === 2).length) {
            // 胜利
            return 100;
        }
    }

    if (rowInfo.filter((x) => x.rawPoints === -2).length > 1) {
        return -100;
    }
    
    if (nextPlayerColor !== color) {
        if (rowInfo.filter((x) => x.rawPoints === -2).length) {
            return -100;
        }
    }

    // 争夺中
    return rowInfo.reduce((pre, info) => pre + info.rawPoints, 0);
}

function eachGrid(grid: Xo[][], handle: (xo: Xo, indexX: number, indexY: number) => any) {
    for (let indexY = 0; indexY < 3; indexY++) {
        const row = grid[indexY];
        for (let indexX = 0; indexX < 3; indexX++) {
            const xo = row[indexX];
            handle(xo, indexX, indexY);
        }
    }
}

// 这里的思路有点问题，应该思考为落子后对某一方的局势评价
// 避免不必要的复杂度
function predict2(map: Xo[][], color: string) {
    /**
     * 我在此落子之后 对方落一子，我能获得最大优势的招法
     * 这里应该是深度优先搜索而不是广度优先搜索
     * 图新较小所以可以忽略第一步的估值
     */

    const steps = [] as Xo[];
    const reverseColor = color === 'white' ? 'black' : 'white';
    let min: number = -200;

    const emptyGrids: Xo[] = [];
    eachGrid(map, (xo: Xo) => {
        if (!xo.color) {
            console.log(xo.color, xo);

            emptyGrids.push(xo);
        }
    });

    function addToSteps(xo: Xo) {
        if (steps.indexOf(xo) == -1) {
            return steps.push(xo);
        }
    }

    const actInterator = function (depth: number = 2) {
        /**
         * 实际上是求 C emptyGrids, depth 这样一个全排列
         * 简单的办法是生成递增进位树？
         * 由于太过智障我还是先写个2
         */
        let max = -200;
        for (let i = 0; i < emptyGrids.length; i++) {
            const item = emptyGrids[i];
            const restGrids = [];
            item.color = color;
            const score1 = caculateValue(map, color, reverseColor);
            for (let k = 0; k < emptyGrids.length; k++) {
                if (k !== i) {
                    restGrids.push(emptyGrids[k]);
                }
            }
            let min = Infinity;
            for (let j = 0; j < restGrids.length; j++) {
                const item2 = restGrids[j];
                item2.color = reverseColor;
                const score2 = caculateValue(map, color, color);
                if (score2 < min) {
                    min = score2
                }
                item2.color = undefined;;
            }
            
            item.color = undefined;

            if (min > max) {
                max = min;
                steps.length = 0;
                addToSteps(item);
            } else if (min == max) {
                addToSteps(item);
            }
        }
    };

    actInterator(2);

    return steps[Math.floor(Math.random() * steps.length)];

}



const xoMap = new XoMap();

xoMap.generateXoMap();
xoMap.checkGridValue();

$('#reset').click(function () {
    xoMap.resetGrid();
});
$('#undo').click(function () {
    xoMap.undo();
});
$('#redo').click(function () {
    xoMap.redo();
});

type xoMap = [
    0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2,
    0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2,
    0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2
];
const numberToColor = {
    0: undefined,
    1: 'black',
    2: 'white'
};
function caculateGrid(map: xoMap, color: 1 | 2, nextPlayerColor: 1 | 2) {
    const grid: Xo[][] = [];
    for (let j = 0; j < 3; j++) {
        const row: Xo[] = [];
        grid.push(row);
        for (let i = 0; i < 3; i++) {
            const color = numberToColor[map[j * 3 + i]];
            const xo = new Xo();
            xo.x = i;
            xo.y = j;
            xo.color = color;
            row.push(xo);
        }
    }

    console.log(grid);

    const ret = caculateValue(grid, numberToColor[color], numberToColor[nextPlayerColor]);
    console.log(ret);
    const step = predict2(grid, numberToColor[color]);
    console.log(step);
}
