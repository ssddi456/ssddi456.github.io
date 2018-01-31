import { RoadMap, IMapCell } from './libs/road_map';

class Xo implements IMapCell {
    canWalkThrough: boolean;
    visited: boolean;
    visible: boolean;
    distance: number;
    color: string | undefined;
    canClick: boolean;
    el: XoElement;
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
            const playerScore = caculateValue(this.grid, playerColor);
            if (playerScore === 100) {
                alert('you win');
                this.resetGrid();
            }
            // 响应
            const computerColor = this.currentColor;
            const dos = predict2(this.grid, this.currentColor);
            if (dos) {
                const echo = this.grid[dos.pos[1]][dos.pos[0]];
                echo.setColor(this.toggleColor());
                xos.push(echo);
            }

            // 这里判定一下是否胜利
            const computerScore = caculateValue(this.grid, computerColor);
            if (computerScore === 100) {
                alert('com win');
                this.resetGrid();
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
                    $(this.grid[indexY][indexX].el).find('.xo-inner')
                        .html(
                        '' + caculateValue(gridClone, this.currentColor) + '\n'
                        + caculateValue(gridClone, this.currentColor === 'white' ? 'black' : 'white'));
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
            return ret;
        }));
}

function caculateValue(map: Xo[][], color: string) {
    let totalCount = 0;
    for (let indexRow = 0; indexRow < rows.length; indexRow++) {
        const rowPoints = rows[indexRow].map((pos) => map[pos[1]][pos[0]].color)
            .map((posColor) => posColor ? posColor === color ? 1 : -1 : 0) as number[];
        const rawPoints = rowPoints.reduce((pre, cur) => pre + cur, 0);

        if (rowPoints.filter((point) => point === 1).length === 3) {
            return 100;
        }
        if (rowPoints.filter((point) => point < 0).length > 0) {
            // pass
            if (rawPoints < -1) {
                return -100;
            }
        } else {
            rowPoints.forEach((point) => {
                if (point > 0) {
                    totalCount += 2;
                } else {
                    totalCount += 1;
                }
            });
        }
    }
    return totalCount;
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
    // 我在此落子之后 对方落一子，我能获得最大优势的招法

    const gridClone = cloneGrid(map);

    const steps = [] as Array<{ pos: number[], score: number, color: string }>;
    const reverseColor = color === 'white' ? 'black' : 'white';
    let max: number = -100;
    eachGrid(gridClone, (xo: Xo, indexX: number, indexY: number) => {
        if (!xo.color) {
            xo.color = color;
            const score = caculateValue(gridClone, color);
            if (score > max) {
                max = score;
                steps.length = 0;
                steps.push({ pos: [indexX, indexY], score, color });
            } else if (score === max) {
                steps.push({ pos: [indexX, indexY], score, color });
            }
            xo.color = undefined;
        }
    });

    const steps2ops = [] as Array<{ pos: number[], score: number, color: string }>;
    let min: number = -100;
    steps.forEach((step) => {
        let minScore: number = Infinity;
        gridClone[step.pos[1]][step.pos[0]].color = step.color;
        eachGrid(gridClone, (xo: Xo, indexX1: number, indexY1: number) => {
            if (!xo.color) {
                xo.color = reverseColor;
                const score = caculateValue(gridClone, color);

                if (score < minScore) {
                    minScore = score;
                }
                xo.color = undefined;
            }
        });

        if (minScore > min) {
            min = minScore;
            steps2ops.length = 0;
            steps2ops.push(step);
        } else if (minScore === min) {
            steps2ops.push(step);
        }

        gridClone[step.pos[1]][step.pos[0]].color = undefined;
    });

    if (!steps2ops.length) {
        return steps[Math.floor(Math.random() * steps.length)];
    }

    return steps2ops[Math.floor(Math.random() * steps2ops.length)];
}

function predict4() {
    // 两个回合之后我能获得最大优势的招法
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
