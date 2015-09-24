// based on https://bgrins.github.io/TinyColor/docs/tinycolor.html

import {RGB, HSV} from '../model/model';
import Image from '../image';

export default function hsv() {
    this.checkProcessable('hsv', {
        bitDepth: [8, 16]
        alpha: [0,1],
        colorModel: [RGB]

    });

    let newImage = Image.createFrom(this, {
        colorModel: HSV
    });

    let ptr = 0;
    let data = this.data;
    for (let i = 0; i < data.length; i += this.channels) {
        let red=data[i];
        let green=data[i+1];
        let blue=data[i+2];

        let min = Math.min( red, green, blue );
        let max = Math.max( red, green, blue );
        let delta = max - min;
        let hue = 0;
        let saturation = max === 0 ? 0 : delta / max;
        let value = max;

        if (max !== min ) {
            switch(max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue /= 6;
        }

        newImage.data[ptr++] = hue*this.maxValue;
        newImage.data[ptr++] = saturation*this.maxValue;
        newImage.data[ptr++] = value;
        if (this.alpha) {
            newImage.data[ptr++] = data[i+3];
        }
    }

    return newImage;
}
