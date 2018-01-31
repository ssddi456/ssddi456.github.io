import { RoadMap, IMapCell } from './libs/road_map';
import { randomItem, throttle } from './libs/utils';
import { animateMoveTo } from './libs/animate_utils';

class Gem implements IMapCell {
    color: string;
    canWalkThrough: boolean;
    visited: boolean;
    visible: boolean;
    // 到起点的距离
    distance: number;
    collapseGroupId: number;
    collapsed: boolean = false;
    collapse() {
        setTimeout(() => {
            $(this.el).toggleClass('gem-collapse', true);
        }, 100);
        this.collapsed = true;
    }
    moveDown: number = 0;

    powerVertical: number = 0;
    powerHorizontal: number = 0;

    suggestGems: Gem[] | undefined;
    showSuggest() {
        if (this.suggestGems) {
            for (let index = 0; index < this.suggestGems.length; index++) {
                const element = this.suggestGems[index];
                $(element.el).addClass('suggest');
            }
        }
    }

    el: Element;
    top() {
        return parseInt($(this.el).css('top'), 10);
    }
    left() {
        return parseInt($(this.el).css('left'), 10);
    }
}

class RedGem extends Gem {
    color = 'red';
}
class WhiteGem extends Gem {
    color = 'white';
}
class BlueGem extends Gem {
    color = 'blue';
}
class GreenGem extends Gem {
    color = 'green';
}
class YellowGem extends Gem {
    color = 'yellow';
}
class BrownGem extends Gem {
    color = 'brown';
}
class DarkmagentaGem extends Gem {
    color = 'darkmagenta';
}

interface GemData {
    x: number;
    y: number;
}
interface Vector2 {
    top: number;
    left: number;
}

class ScoreItem<T> {
    name: string;
    data: T;
    el: JQuery;
    constructor(name: string, data: T) {
        this.name = name;
        this.el = $('#' + name);
        this.data = data;
    }
    update() {
        this.el.text(this.data + '');
    }
}

class CollapseScoreItem extends ScoreItem<{ [k: number]: number }> {
    update() {
        this.el.text(`3: ${this.data[3]} | 4: ${this.data[4]} | 5: ${this.data[5]}`);
    }
}

const scores = {
    turns: new ScoreItem('turns', 0),
    time_past: new ScoreItem('time_past', 0),
    collapseCounts: new CollapseScoreItem('collapseCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    whiteGemCounts: new CollapseScoreItem('WhiteGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    redGemCounts: new CollapseScoreItem('RedGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    blueGemCounts: new CollapseScoreItem('BlueGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    greenGemCounts: new CollapseScoreItem('GreenGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    yellowGemCounts: new CollapseScoreItem('YellowGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    brownGemCounts: new CollapseScoreItem('BrownGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
    darkmagentaGemCounts: new CollapseScoreItem('DarkmagentaGemCounts', {
        3: 0,
        4: 0,
        5: 0,
    }),
} as { [k: string]: CollapseScoreItem | ScoreItem<number> };

function updateGemScore() {
    for (const k in scores) {
        scores[k].update();
    }
}

class GemMap extends RoadMap {
    grid: Gem[][];
    els: Element[];
    wrapper = $('#main');

    padding = 10;

    cellH: number;
    cellW: number;
    emptyGem = new Gem();

    constructor(w: number, h: number) {
        super(w, h);

        this.wrapper.on('mousedown', '.gem', (dragStartEvent: MouseEvent) => {
            dragStartEvent.preventDefault();
            const draggedGem = $(dragStartEvent.currentTarget);
            const startTop = dragStartEvent.clientY;
            const startLeft = dragStartEvent.clientX;

            draggedGem.hide();

            const fakeGem = $(draggedGem.get(0).outerHTML).addClass('fake-gem').addClass('no-transition');

            fakeGem.show();
            this.wrapper.append(fakeGem);

            const draggedGemData = { ...draggedGem.data() } as GemData;

            const mousemove = (e: MouseEvent) => {
                const deltaTop = e.clientY - startTop;
                const deltaLeft = e.clientX - startLeft;

                fakeGem.css('transform', `translate(${deltaLeft}px, ${deltaTop}px)`);
            };
            const clearup = (e: MouseEvent) => {
                const deltaTop = e.clientY - startTop;
                const deltaLeft = e.clientX - startLeft;

                this.wrapper.off('mousemove.gem_drag', mousemove);
                this.wrapper.off('mouseup.gem_drag', clearup);
                this.wrapper.off('mouseup.gem_drag', '.gem', mouseup);

                fakeGem.remove();
                draggedGem.show();

                if (!$(e.currentTarget).is('.gem')) {
                    animateMoveTo(draggedGem, null,
                        {
                            top: deltaTop,
                            left: deltaLeft,
                        });
                    return true;
                } else {
                    return false;
                }
            };

            const mouseup = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();

                if (clearup(e)) {
                    return;
                }

                const deltaTop = e.clientY - startTop;
                const deltaLeft = e.clientX - startLeft;

                const droppedGem = $(e.currentTarget);
                const droppedGemTop = parseInt(droppedGem.css('top'), 10);
                const droppedGemLeft = parseInt(droppedGem.css('left'), 10);
                const droppedGemData = { ...droppedGem.data() } as GemData;

                if (!this.canSwitch(draggedGemData, droppedGemData)) {
                    animateMoveTo(draggedGem, null,
                        {
                            top: deltaTop,
                            left: deltaLeft,
                        });
                    return;
                }

                scores.turns.data += 1;

                if (draggedGemData.x !== droppedGemData.x) {
                    this.moveGemInRow(draggedGemData, droppedGemData, {
                        top: deltaTop,
                        left: deltaLeft,
                    });
                } else {
                    this.moveGemInCol(draggedGemData, droppedGemData, {
                        top: deltaTop,
                        left: deltaLeft,
                    });
                }

            };

            this.wrapper.on('mousemove.gem_drag', mousemove);
            this.wrapper.on('mouseup.gem_drag', clearup);
            this.wrapper.on('mouseup.gem_drag', '.gem', mouseup);
        });
        // throttle
        this.wrapper.on('animationend', '.gem', throttle((e: AnimationEvent) => {
            this.wrapper.find('.gem.suggest').removeClass('suggest');
        }));

        this.wrapper.on('transitionend', '.gem', throttle((e) => {
            this.canCollapse();

            if (this.isFinish()) {
                this.finish();
            } else if (this.shouldFill()) {
                console.log('do fill');
                this.fill();
            } else if (this.canCollapse()) {
                console.log('do collapse');
                this.collapse();
            } else {
                console.log('do clear');
                this.clearCollapse();
                this.suggestCanMove();
            }
        }));
    }

    wrapperWidth() {
        return (this.wrapper.width() || 0) / 100;
    }

    wrapperHeight() {
        return (this.wrapper.height() || 0) / 100;
    }

    moveGemTo(startGemData: GemData, endGemData: GemData, delta: Vector2) {
        const tempGem = this.grid[startGemData.y][startGemData.x];
        const wh = this.wrapperHeight();
        const ww = this.wrapperWidth();
        animateMoveTo(tempGem.el,
            {
                top: `${this.topPercent(endGemData.y)}%`,
                left: `${this.leftPercent(endGemData.x)}%`,
            },
            {
                top: wh * this.topPercent(startGemData.y) - wh * this.topPercent(endGemData.y) + delta.top,
                left: ww * this.leftPercent(startGemData.x) - ww * this.leftPercent(endGemData.x) + delta.left,
            });
        $(tempGem.el).data(endGemData);
    }
    moveGemInRow(startGemData: GemData, endGemData: GemData, delta: Vector2) {
        this.moveGemTo(startGemData, endGemData, delta);
        let prevGem = this.grid[startGemData.y][startGemData.x];
        const deltaX = startGemData.x - endGemData.x;
        const dir = deltaX / Math.abs(deltaX);
        let i = endGemData.x;
        for (; i !== startGemData.x; i += dir) {
            const currentGem = this.grid[startGemData.y][i];
            this.moveGemTo({ x: i, y: startGemData.y }, { x: i + dir, y: startGemData.y }, {
                top: 0,
                left: 0,
            });
            this.grid[startGemData.y][i] = prevGem;
            prevGem = currentGem;
        }
        this.grid[startGemData.y][i] = prevGem;
    }
    moveGemInCol(startGemData: GemData, endGemData: GemData, delta: Vector2) {
        this.moveGemTo(startGemData, endGemData, delta);
        let prevGem = this.grid[startGemData.y][startGemData.x];
        const deltaY = startGemData.y - endGemData.y;
        const dir = deltaY / Math.abs(deltaY);
        let i = endGemData.y;
        for (; i !== startGemData.y; i += dir) {
            const currentGem = this.grid[i][startGemData.x];
            this.moveGemTo({ x: startGemData.x, y: i }, { x: startGemData.x, y: i + dir }, {
                top: 0,
                left: 0,
            });
            this.grid[i][startGemData.x] = prevGem;
            prevGem = currentGem;
        }
        this.grid[i][startGemData.x] = prevGem;
    }
    resetGrid() {
        this.grid = this.grid || [];
        for (let indexY = 0; indexY < this.height; indexY++) {
            const row: Gem[] = [];
            this.grid.push(row);
        }
        this.cellH = 100 / (this.width * 1.1 + 0.1);
        this.cellW = 100 / (this.width * 1.1 + 0.1);
        this.wrapper.html('');
    }
    leftPercent(x: number) {
        return this.cellW * 0.1 + x * this.cellW * 1.1;
    }
    topPercent(x: number) {
        return this.cellH * 0.1 + x * this.cellH * 1.1;
    }
    gemTypes: Array<new () => Gem> = [
        WhiteGem,
        RedGem,
        BlueGem,
        GreenGem,
        YellowGem,
        BrownGem,
        DarkmagentaGem,
    ];

    generateGemMap() {
        this.resetGrid();
        const contents: Element[] = [];

        for (let indexY = 0; indexY < this.height; indexY++) {
            const top = this.topPercent(indexY);
            for (let indexX = 0; indexX < this.width; indexX++) {
                const left = this.leftPercent(indexX);
                const gem = this.grid[indexY][indexX] = new (randomItem(this.gemTypes))();

                const gemEl = $(`<div class="gem gem-${gem.color}"
                                    data-x="${indexX}"
                                    data-y="${indexY}"
                                    style="top:${top}%;
                                    left:${left}%;
                                    width:${this.cellW}%;
                                    height:${this.cellH}%;
                                    "></div>`).get(0);
                gem.el = gemEl;
                contents.push(gemEl);
            }
        }
        this.els = contents;
        this.wrapper.append(contents);
    }
    canSwitch(fromCell: GemData, toCell: GemData) {
        // a和b交换之后如果可以collapse 就可以交换
        if (fromCell.x !== toCell.x && fromCell.y !== toCell.y) {
            return false;
        }
        if (fromCell.x === toCell.x && fromCell.y === toCell.y) {
            return false;
        }

        const startX = 0;
        const endX = this.width - 1;
        const startY = 0;
        const endY = this.height - 1;

        const showSubgrid = () => {
            for (let indexY = startY; indexY <= endY; indexY += 1) {
                for (let indexX = startX; indexX <= endX; indexX += 1) {
                    const gem = subGrid[indexY][indexX];
                    $(gem.el).addClass('subgrid')
                        .text(JSON.stringify({
                            x: indexX,
                            y: indexY,
                            ph: gem.powerHorizontal,
                            pv: gem.powerVertical,
                        }, null, 2).slice(2, -2));
                }
            }
        };
        const setSubgrid = (x: number, y: number, gem: Gem) => {
            if (!subGrid[y]) {
                subGrid[y] = [] as Gem[];
            }
            subGrid[y][x] = gem;
        };

        const clearSubgrid = () => {
            for (let indexY = startY; indexY <= endY; indexY += 1) {
                for (let indexX = startX; indexX <= endX; indexX += 1) {
                    const gem = subGrid[indexY][indexX];
                    gem.powerHorizontal = 0;
                    gem.powerVertical = 0;
                }
            }
        };

        // 截取目标区域
        const subGrid: Gem[][] = [];
        for (let indexY = startY; indexY <= endY; indexY += 1) {
            for (let indexX = startX; indexX <= endX; indexX += 1) {
                const gem = this.grid[indexY][indexX];
                setSubgrid(indexX, indexY, gem);
            }
        }

        const gemForCheck = this.grid[fromCell.y][fromCell.x];
        gemForCheck.suggestGems = undefined;

        // 把gem放进去
        let prevGem = gemForCheck;
        if (fromCell.x !== toCell.x) {
            const deltaX = fromCell.x - toCell.x;
            const dir = deltaX / Math.abs(deltaX);
            let i = toCell.x;
            for (; i !== fromCell.x; i += dir) {
                const currentGem = this.grid[fromCell.y][i];
                setSubgrid(i, fromCell.y, prevGem);
                prevGem = currentGem;
            }
        } else {
            const deltaY = fromCell.y - toCell.y;
            const dir = deltaY / Math.abs(deltaY);
            let i = toCell.y;
            for (; i !== fromCell.y; i += dir) {
                const currentGem = this.grid[i][fromCell.x];
                setSubgrid(fromCell.x, i, prevGem);
                prevGem = currentGem;
            }
        }

        setSubgrid(fromCell.x, fromCell.y, prevGem);

        const markSubgrid = () => {
            // 标记阶段
            for (let indexY = 0; indexY < this.height; indexY++) {
                for (let indexX = 0; indexX < this.width; indexX++) {
                    const gem = subGrid[indexY] && subGrid[indexY][indexX];
                    if (gem) {
                        const gemRowBelow = subGrid[indexY + 1];
                        if (gemRowBelow) {
                            const gemBelow = gemRowBelow[indexX];
                            if (gemBelow && gem.color === gemBelow.color) {
                                gem.powerVertical += 1;
                                gemBelow.powerVertical += 1;
                            }
                        }

                        const gemLeft = subGrid[indexY][indexX + 1];
                        if (gemLeft && gem.color === gemLeft.color) {
                            gem.powerHorizontal += 1;
                            gemLeft.powerHorizontal += 1;
                        }
                    }
                }
            }
        };

        clearSubgrid();
        markSubgrid();

        for (let indexY = startY; indexY <= endY; indexY += 1) {
            for (let indexX = startX; indexX <= endX; indexX += 1) {
                const row = subGrid[indexY];
                const gem = row && row[indexX];

                if (gem && (gem.powerHorizontal > 1 || gem.powerVertical > 1)) {
                    const suggestGems: Gem[] = [];
                    suggestGems.push(gem);

                    console.log('addGemRelative', indexY, indexX);

                    const addGemRelative = function (y: number, x: number) {

                        const rowNearBy = subGrid[y];
                        if (!rowNearBy) {
                            return false;
                        }
                        const itemNearBy = rowNearBy[x];
                        if (!itemNearBy) {
                            return false;
                        }
                        if (itemNearBy.color !== gem.color) {
                            return false;
                        }

                        suggestGems.push(itemNearBy);
                        console.log('addGemRelative', x, y);

                        return true;
                    };
                    if (gem.powerHorizontal > 1) {
                        for (let i = 1; ; i++) {
                            if (!addGemRelative(indexY, indexX + i)) {
                                break;
                            }
                        }
                        for (let i = -1; ; i--) {
                            if (!addGemRelative(indexY, indexX + i)) {
                                break;
                            }
                        }
                    } else {
                        for (let i = 1; ; i++) {
                            if (!addGemRelative(indexY + i, indexX)) {
                                break;
                            }
                        }
                        for (let i = -1; ; i--) {
                            if (!addGemRelative(indexY + i, indexX)) {
                                break;
                            }
                        }
                    }
                    this.grid[fromCell.y][fromCell.x].suggestGems = suggestGems;
                    console.log('canSwitch', fromCell, toCell);
                    return true;
                }
            }
        }
        return false;
    }
    // 这里有点不对
    // 在交换的时候计算 power 不用每次都计算
    canCollapse() {
        this.clearCollapse();
        // 标记阶段
        for (let indexY = 0; indexY < this.height; indexY++) {
            for (let indexX = 0; indexX < this.width; indexX++) {
                const gem = this.grid[indexY][indexX];
                const gemRowBelow = this.grid[indexY + 1];
                if (gemRowBelow) {
                    const gemBelow = this.grid[indexY + 1][indexX];
                    if (gemBelow && gem.color === gemBelow.color) {
                        gem.powerVertical += 1;
                        gemBelow.powerVertical += 1;
                    }
                }

                const gemLeft = this.grid[indexY][indexX + 1];
                if (gemLeft && gem.color === gemLeft.color) {
                    gem.powerHorizontal += 1;
                    gemLeft.powerHorizontal += 1;
                }
            }
        }
        for (let indexY = 0; indexY < this.height; indexY++) {
            for (let indexX = 0; indexX < this.width; indexX++) {
                const gem = this.grid[indexY][indexX];
                if (gem.powerHorizontal > 1 || gem.powerVertical > 1) {
                    return true;
                }
            }
        }
        return false;
    }
    showStatus() {
        for (let indexY = 0; indexY < this.height; indexY++) {
            for (let indexX = 0; indexX < this.width; indexX++) {
                const gem = this.grid[indexY][indexX];
                $(gem.el).text(JSON.stringify({
                    h: gem.powerHorizontal,
                    v: gem.powerVertical,
                    x: indexX,
                    y: indexY,
                }, null, 2).slice(2, -2));
            }
        }
    }
    collapse() {
        const collapseGroups: { [k: number]: Gem[] } = {};
        let collapseGroupId = 1;
        function createCollapseGroup(...gems: Gem[]) {
            gems.forEach((gem) => gem.collapse());

            const currentCollapseIds = gems.map((gem) => gem.collapseGroupId)
                .filter(Boolean)
                .sort((a, b) => a - b)
                .reduce<number[]>((prev: number[], cur: number) => {
                    if (!prev.length) {
                        prev.push(cur);
                    } else {
                        if (cur !== prev[prev.length - 1]) {
                            prev.push(cur);
                        }
                    }
                    return prev;
                }, [] as number[]);

            if (currentCollapseIds.length === 0) {
                gems.forEach((gem) => gem.collapseGroupId = collapseGroupId);
                collapseGroups[collapseGroupId] = gems;
                console.log('create collapseGroups', collapseGroupId);
                collapseGroupId++;
            } else if (currentCollapseIds.length > 0) {
                // 这里需要合并多个已经创建的collapse group
                const currentCollapseId = currentCollapseIds[0];
                gems.forEach((gem) => {
                    if (gem.collapseGroupId === undefined) {
                        gem.collapseGroupId = currentCollapseId;
                        collapseGroups[currentCollapseId].push(gem);
                    }
                });
                currentCollapseIds.forEach((id, idx) => {
                    if (idx) {
                        console.log('merge collapse group', id, 'to', currentCollapseId);

                        const groupNeedToMerge = collapseGroups[id];
                        delete collapseGroups[id];
                        groupNeedToMerge.forEach((gem) => {
                            gem.collapseGroupId = currentCollapseId;
                            collapseGroups[currentCollapseId].push(gem);
                        });
                    }
                });
            }
        }

        for (let indexY = 0; indexY < this.height; indexY++) {
            for (let indexX = 0; indexX < this.width; indexX++) {
                const gemRow = this.grid[indexY];
                const gem = gemRow[indexX];
                if (gem.powerHorizontal > 1) {
                    const gemLeft = gemRow[indexX - 1];
                    const gemRight = gemRow[indexX + 1];
                    createCollapseGroup(gem, gemLeft, gemRight);
                }
                if (gem.powerVertical > 1) {
                    const gemAbove = this.grid[indexY - 1][indexX];
                    const gemBelow = this.grid[indexY + 1][indexX];
                    createCollapseGroup(gem, gemAbove, gemBelow);
                }
            }
        }
        const finalGroupIds = Object.keys(collapseGroups);
        console.log(finalGroupIds);
        finalGroupIds.forEach(function (groupid) {
            const collapseGroup = collapseGroups[Number(groupid)];
            collapseGroup.forEach((gem) => console.log(gem.color));
            scores[collapseGroup[0].color + 'GemCounts'].data[collapseGroup.length] += 1;
            scores.collapseCounts.data[collapseGroup.length] += 1;
        });
    }
    clearCollapse() {
        for (let indexY = 0; indexY < this.height; indexY++) {
            for (let indexX = 0; indexX < this.width; indexX++) {
                const gem = this.grid[indexY][indexX];
                gem.powerHorizontal = 0;
                gem.powerVertical = 0;
                $(gem.el).data({
                    x: indexX,
                    y: indexY,
                });

                if (gem.collapsed) {
                    this.removeGem(gem);
                    console.log('remove a gem', this.els.length);
                }
            }
        }
    }
    shouldFill() {
        if (this.els.length < this.width * this.height) {
            return true;
        }
        return false;
    }

    fill() {
        // 按纵列遍历，计算新增的元素和移动的元素
        for (let indexX = 0; indexX < this.width; indexX++) {
            let needAddGems = 0;
            for (let indexY = this.height - 1; indexY >= 0; indexY--) {
                const gem = this.grid[indexY][indexX];
                if (gem.collapsed) {
                    needAddGems += 1;
                } else {
                    gem.moveDown = needAddGems;
                }
            }
            const wrapperHeight = 0 - (this.wrapper.height() || 0) / 100;
            for (let indexY = this.height - 1; indexY >= 0; indexY--) {
                const gem = this.grid[indexY][indexX];
                if (gem.moveDown) {
                    console.log('move', indexX, indexY, 'to', indexX, indexY + gem.moveDown, );
                    const moveToGem = this.grid[indexY + gem.moveDown][indexX];
                    animateMoveTo(
                        gem.el,
                        {
                            top: `${this.topPercent(indexY + gem.moveDown)}%`,
                        },
                        {
                            top: this.topPercent(gem.moveDown) * wrapperHeight,
                            left: 0,
                        });
                    this.grid[indexY + gem.moveDown][indexX] = gem;
                    gem.moveDown = 0;
                }
            }

            for (let i = 0; i < needAddGems; i++) {
                // 这里新增加gem到队列中
                console.log('add gem at', indexX, i);
                const newGem = this.addGem(indexX, i);
                console.log(this.els.length);
                animateMoveTo(
                    newGem.el,
                    null,
                    {
                        top: this.topPercent(needAddGems) * wrapperHeight,
                        left: 0,
                    });
            }
        }
    }
    addGem(x: number, y: number) {
        const top = this.topPercent(y);
        const left = this.leftPercent(x);
        const gem = this.grid[y][x] = new (randomItem(this.gemTypes))();
        const gemEl = $(`<div class="gem gem-${gem.color}"
                                    data-x="${x}"
                                    data-y="${y}"
                                    style="top:${top}%;
                                    left:${left}%;
                                    width:${this.cellW}%;
                                    height:${this.cellH}%;
                                    "></div>`).get(0);
        gem.el = gemEl;
        this.els.push(gemEl);
        this.wrapper.append(gemEl);
        return gem;
    }
    removeGem(gem: Gem) {
        this.els.splice(this.els.indexOf(gem.el), 1);
        $(gem.el).remove();
    }
    isFinish() {
        return false;
    }
    finish() {
        console.log('============finish========');
    }

    suggestCanMove() {
        for (let indexY = 0; indexY < this.height; indexY++) {
            for (let indexX = 0; indexX < this.width; indexX++) {
                const gem = this.grid[indexY][indexX];

                for (let loopX = 0; loopX < this.width; loopX++) {
                    if (loopX !== indexX) {
                        if (this.canSwitch({ x: indexX, y: indexY }, { x: loopX, y: indexY })) {
                            gem.showSuggest();
                            return;
                        }
                    }
                }
                for (let loopY = 0; loopY < this.width; loopY++) {
                    if (loopY !== indexY) {
                        if (this.canSwitch({ x: indexX, y: indexY }, { x: indexX, y: loopY })) {
                            gem.showSuggest();
                            return;
                        }
                    }
                }
            }
        }
    }
}

const gemMap = new GemMap(7, 7);

gemMap.generateGemMap();

if (gemMap.canCollapse()) {
    gemMap.collapse();
};

$('#suggestion').click(function () {
    gemMap.suggestCanMove();
});

const start = Date.now();
const updateInterval = function () {
    setTimeout(function () {
        scores.time_past.data = Math.floor((Date.now() - start) / 1000);
        updateGemScore();
        updateInterval();
    }, 300);
};
updateInterval();
