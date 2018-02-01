export function animateMoveTo(
    el: JQuery | Element,
    pos: { top?: number | string, left?: number | string } | null,
    relative: { top: number, left: number },
) {
    const $el = $(el);
    $el
        .addClass('no-transition')
        .css({
            ...pos,
            transform: `translate(${relative.left}px,${relative.top}px)`,
        })
        .attr({
            moveFrom: `(${relative.left}px,${relative.top}px)`,
        });

    setTimeout(() => {
        $el
            .removeClass('no-transition')
            .css({
                transform: '',
            });
    }, 100);
}
