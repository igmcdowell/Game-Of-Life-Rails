var ColorUtils = function() {

    /* ParseHexDigit takes a one character string representing a hex digit and returns its decimal equivalent as an int.*/
    function ParseHexDigit(hexdigit) {
        var num;
        var h = hexdigit;
        switch (h) {
        case "A":
            return 10;
        case 'B':
            return 11;
        case 'C':
            return 12;
        case 'D':
            return 13;
        case 'E':
            return 14;
        case 'F':
            return 15;
        default:
            num = parseInt(hexdigit);
        }
        return num;
    }

    /*ParseHexDouble takes a 2 bit string representing a hex number and returns its decimal equivalent as an int*/
    function ParseHexDouble(hexdouble) {
        return ParseHexDigit(hexdouble[1]) + ParseHexDigit(hexdouble[0]) * 16;
    }

    function DigitToHex(digit) {
        switch (digit) {
        case 10:
            return 'A';
        case 11:
            return 'B';
        case 12:
            return 'C';
        case 13:
            return 'D';
        case 14:
            return 'E';
        case 15:
            return 'F';
        default:
            l = String(digit);
        }
        return l;
    }

    function IntToHex(i) {
        var d1 = DigitToHex(Math.floor(i / 16));
        var d2 = DigitToHex(i % 16);
        var h = d1 + d2;
        return h;
    }


    /* AdvanceRGB takes a hex color and returns a new hex a given percent around the color wheel. */
    function AdvanceRGBHex(start, cutoff, percent) {
        var redhex = start[0] + start[1];
        var greenhex = start[2] + start[3];
        var bluehex = start[4] + start[5];
        var cutoffdec = ParseHexDouble(cutoff);
        var loopsize = (255 - cutoffdec) * 6;
        var reddec = ParseHexDouble(redhex);
        var greendec = ParseHexDouble(greenhex);
        var bluedec = ParseHexDouble(bluehex);
        var amount = Math.floor(loopsize * percent / 100);
        var newcolors = AdvanceRGBDec(reddec, bluedec, greendec, cutoffdec, amount);
        var newhex = IntToHex(newcolors[0]) + IntToHex(newcolors[1]) + IntToHex(newcolors[2]);
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
        AdvanceDec: AdvanceDec
    }
}();