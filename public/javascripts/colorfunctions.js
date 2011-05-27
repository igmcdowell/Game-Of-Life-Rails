var ColorUtils = function() {
    /* AdvanceRGB takes a hex color and returns a new hex a given percent around the color wheel. */
    function AdvanceRGBHex(start, cutoff, percent) {
        var redhex = start[0] + start[1];
        var greenhex = start[2] + start[3];
        var bluehex = start[4] + start[5];
        var cutoffdec = parseInt(cutoff, 16);
        var loopsize = (255 - cutoffdec) * 6;
        var reddec = parseInt(redhex, 16);
        var greendec = parseInt(greenhex, 16);
        var bluedec = parseInt(bluehex, 16);
        var amount = Math.floor(loopsize * percent / 100);
        var newcolors = AdvanceRGBDec(reddec, bluedec, greendec, cutoffdec, amount);
        var newhex = newcolors[0].toString(16) + newcolors[1].toString(16) + newcolors[2].toString(16);
        return newhex;
    }

    function AdvanceRGBDec(red, blue, green, cutoff, amount) {
        var isatmin = [false, false, false];
        var isatmax = [false, false, false]

        if (red == cutoff)
        isatmin[0] = true;
        else if (red == 255)
        isatmax[0] = true;

        if (green == cutoff)
        isatmin[1] = true;
        else if (green == 255)
        isatmax[1] = true;

        if (blue == cutoff) {
            isatmin[2] = true;
        }

        else if (blue == 255)
        isatmax[2] = true;

        if (isatmax[0] && isatmin[2] && !isatmax[1]) {
            if (green + amount < 255)
            green = green + amount;
            else {
                amount = amount + green - 255;
                green = 255;
                return AdvanceRGBDec(red, blue, green, cutoff, amount);
            }
        }
        else if (isatmax[2] && isatmin[1] && !isatmax[0]) {
            if (red + amount < 255)
            red = red + amount;
            else {
                amount = amount + red - 255;
                red = 255;
                return AdvanceRGBDec(red, blue, green, cutoff, amount);
            }
        }
        else if (isatmin[0] && isatmax[1] && !isatmax[2]) {
            //red and green at minimum
            if (blue + amount < 255)
            blue = blue + amount;
            else {
                amount = amount + blue - 255;
                blue = 255;
                return AdvanceRGBDec(red, blue, green, cutoff, amount);
            }
        }
        else if (isatmin[2]) {
            //only blue at minimum
            if (red - amount > cutoff)
            red = red - amount
            else {
                amount = amount + cutoff - red;
                red = cutoff;
                return AdvanceRGBDec(red, blue, green, cutoff, amount);
            }
        }
        else if (isatmin[0]) {
            //only red is at minimum
            if (green - amount > cutoff)
            green = green - amount
            else {
                amount = amount + cutoff - green;
                green = cutoff;
                return AdvanceRGBDec(red, blue, green, cutoff, amount);
            }
        }
        else {
            if (blue - amount > cutoff)
            blue = blue - amount
            else {
                amount = amount + cutoff - blue;
                blue = cutoff;
                return AdvanceRGBDec(red, blue, green, cutoff, amount);
            }
        }
        return [red, green, blue];
    }
    return {
        AdvanceRGBHex: AdvanceRGBHex,
        AdvanceRGBDec: AdvanceRGBDec
    }
}();