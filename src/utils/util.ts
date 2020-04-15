export const ColorUtil = {
  rgbToHex(r: any, g: any, b: any) {
    let hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
  },
  hexToRgb(hex) {
    let rgb: any[] = [];
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
    }
    return rgb;
  },
  /**
   * 生成渐变过渡色数组 {startColor: 开始颜色值, endColor: 结束颜色值, step: 生成色值数组长度}
   */
  gradient(startColor, endColor, step) {
    // 将hex转换为rgb
    let sColor = this.hexToRgb(startColor),
      eColor = this.hexToRgb(endColor);

    // 计算R\G\B每一步的差值
    let rStep = (eColor[0] - sColor[0]) / step,
      gStep = (eColor[1] - sColor[1]) / step,
      bStep = (eColor[2] - sColor[2]) / step;

    let gradientColorArr: any[] = [];
    for (let i = 0; i < step; i++) {
      // 计算每一步的hex值
      gradientColorArr.push(
        this.rgbToHex(
          parseInt(rStep * i + sColor[0]),
          parseInt(gStep * i + sColor[1]),
          parseInt(bStep * i + sColor[2])
        )
      );
    }
    return gradientColorArr;
  },
  /**
   * 生成随机颜色值
   */
  generateColor() {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += ((Math.random() * 16) | 0).toString(16);
    }
    return color;
  },
};