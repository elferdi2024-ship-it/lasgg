export function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angle: number
) {
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
    }
}
