function CalcLife (aboveleft, abovecenter, aboveright, left, center, right, belowleft, belowcenter, belowright) {
    var neighbors = aboveleft + abovecenter + aboveright + left + right + belowleft + belowcenter + belowright;
    if (center ==1) {
        if(neighbors > 3 || neighbors < 2) {
           return 0; 
        } 
        return 1;
    }
    if (neighbors == 3) {
        return 1;
    }
    return 0;
}

/* RunDay executes CalcLife for each cell in the grid. The border of the grid is treated as a "death zone" that is always filled with zeroes 
It returns a list of all values that have changed.
*/
function RunDay(grid) {
    var rlen = grid[0].length;
    var changes = Array();
    for(i = 1; i<grid.length-1; i++) {
        for(var j = 1; j<rlen -1; j++) {
            var tval = CalcLife(grid[i-1][j-1], grid[i-1][j],grid[i-1][j+1], grid[i][j-1], grid[i][j], grid[i][j+1], grid[i+1][j-1], grid[i+1][j], grid[i+1][j+1]);
            if(tval!=grid[i][j]) {
                changes.push([i,j]);
            }
        }
    }
    return changes;   
}

function PrintGrid(grid) {
 space = document.getElementById("gridout");
 output = '';
 for (line in grid) {
     for (element in grid[line]) {
         output = output + grid[line][element];
     }
     output = output + '<br />';
 }
  space.innerHTML = output;
}
 


function Run(runstatus) {
    var slidepos = $("#gamespeed")[0].value;
    var tdelay = 1000 - slidepos/178*900;
	window.setTimeout(function(){
		var status = $('#gamecontrol')[0].value;
		if(status == runstatus) 
		{
			Advance();
			Run(runstatus);
		}
	}, tdelay, true);
}

function StartStop() {
	var status = $('#gamecontrol')[0].value;
	var runName = "Run Simulation";
	var stopName = "Stop Simulation";
	$("#thegame table").toggleClass("running");
	if(status == runName) {
		$('#gamecontrol')[0].value = stopName;
		$('#gamecontrol').html(runName);
		$('#advance').removeAttr('disabled');
	}
	else {
		$('#gamecontrol')[0].value = runName;
		$('#gamecontrol').html(stopName);
		Run(runName);
		$('#advance').attr('disabled', 'disabled');
	}
}




function Grid(width, height) {
    
    /* MakeGrid takes a width and height and returns a wXh array initialized to 0*/
    this.MakeGrid =function(width, height) {
       if(height == 0){
           return Array();
       }
       var row = Array();
       for (var i=0; i<width; i++) {
           row.push(0)
       }
       var grid = Array(row);
       grid = grid.concat(this.MakeGrid(width, height -1));
       return grid;
    }
    
    this.ToggleVal = function(x,y) {
        if (this.rawgrid[x][y] == 0) 
    		this.rawgrid[x][y] = 1;
    	else
    		this.rawgrid[x][y]= 0;
    }
    
    /* GridToHTML takes the grid of 0s and 1s and converts it to an HTML table. */
    this.GridToHTML = function() {
        var rawhtml = '<div id="thegame"><table id="lifegrid" class="rainbowtable">';
        var state = ['dead', 'live'];
        for (line in this.rawgrid) {
            rawhtml = rawhtml + '<tr id="row' + String(line)+'">';
            for (element in this.rawgrid[line]) {
                rawhtml = rawhtml + '<td id = "r' + String(line) + 'c' + String(element) + '" class="' + state[this.rawgrid[line][element]] +' c' + String(element)+'">&nbsp;</td>';
            }
            rawhtml = rawhtml + '</tr>';
        }
        rawhtml = rawhtml + '</table></div>';
        return rawhtml;
    }    
    
    this.AddGridToDOM = function(){
        var grid = this;
        var hex = 'FF5E5E';
        var colorfloor = '5E';
        var percent = 100/(this.width);
        $("#columncolors").remove();
        var stylehtml = '<style id="columncolors">';
        for (column in this.rawgrid[0]) {
            hex = AdvanceRGBHex(hex, colorfloor, percent);
            rule = ' table.rainbowtable * .c' + String(column) + '.live {background-color:#'+hex+';}\n '; 
            stylehtml = stylehtml + rule;
        }
        stylehtml = stylehtml + '</style>';
        $(stylehtml).appendTo('head');
    	$(document.body).append(this.html);
    	$("#lifegrid td").mousedown(function(){
    		ToggleSpot(this, grid);
    		$("#lifegrid td").mouseover(function(){
    			ToggleSpot(this, grid);
    		});			
    	});
    }
    this.width = width;
    this.height = height;
    this.rawgrid = this.MakeGrid(width,height);
    this.html = this.GridToHTML();
}

/* ChangeGrid removes the old grid from the DOM and replaces it with a new grid of the appropriate width/height */
function NewGrid() {
	$('#lifegrid').remove();
	var w =parseFloat($('#gridwidth')[0].value);
	var h =parseFloat($('#gridheight')[0].value);
	g = MakeGrid(w,h);
	AddGrid(g);
}
	
function SetBoxSize() {
	var val =$('#boxsize')[0].value;
	var newsize = parseInt(val);
	$('td').css('min-width', newsize);
	$('td').css('height', newsize);
}

function ToggleSpot(spot, grid) {
	$(spot).toggleClass("live dead");
	var pos = spot.id.split('r')[1];
	var pos = pos.split('c');
	var row = pos[0];
	var column = pos[1];
    grid.ToggleVal(row,column);
}

//Advance advances by toggling cells
function Advance(grid) {
	var changes = RunDay(grid);
	for (change in changes) {
		var r = changes[change][0];
		var c = changes[change][1];
		var id = '#r'+String(r)+'c'+String(c);
		var spot = $(id)[0];
		ToggleSpot(spot, grid);
	}
}

function RemoveShape(targetcell, shape, oldvals, grid) {
    var newtargstring = '';
    var newtarg;
    var pos = targetcell.id.split('r')[1];
	var pos = pos.split('c');
    var refy = parseInt(pos[0]);
    var refx = parseInt(pos[1]);
    for(pixel in shape) {
        newtargstring = '#r'+String(refy + shape[pixel][1]) + 'c'+String(refx + shape[pixel][0]);
        newtarg = $(newtargstring);
        if(newtarg.length > 0) {
            if(!newtarg.hasClass(oldvals[pixel])) 
                ToggleSpot(newtarg[0], grid);
            }
    }
}

function DragShape(shape, grid) {
    $("body").css('cursor', 'pointer');
	$("td").mouseover(function(){
		RenderShape(this, shape, grid);
	});
	$(document).mouseup(function(){
		$("td").unbind('mouseover');
		$("body").css('cursor', 'default');
	});
}

function RenderShape(targetcell, shape, grid) {
    var oldvals = Array();
    var oldval = 0;
    var newtargstring = '';
    var newtarg;
    var pos = targetcell.id.split('r')[1];
	var pos = pos.split('c');
    var refy = parseInt(pos[0]);
    var refx = parseInt(pos[1]);
    for (pixel in shape) {
        newtargstring = '#r'+String(refy + shape[pixel][1]) + 'c'+String(refx + shape[pixel][0]);
        newtarg = $(newtargstring);
        if(newtarg.length > 0) {
            if(newtarg.hasClass('live')) 
                oldval = 'live';
            else {
                oldval = 'dead';
                ToggleSpot(newtarg[0], grid);
            }
            oldvals.push(oldval);
        }
    }
    //Need to remove the shape if the user chooses to pass through.
    $(targetcell).mouseout(function(){
	    RemoveShape(targetcell, shape, oldvals, grid);
	    $(this).unbind('mouseout');
	});
	$(targetcell).mouseup(function(){
	   $(this).unbind('mouseout'); 
	   $(this).unbind('mouseup');
	});
}


/* ParseHexDigit takes a one character string representing a hex digit and returns its decimal equivalent as an int.*/
function ParseHexDigit(hexdigit) {
    var num;
    var h = hexdigit;
    switch(h) {
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
    return ParseHexDigit(hexdouble[1]) + ParseHexDigit(hexdouble[0])*16;
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
    var d1 = DigitToHex(Math.floor(i/16));
    var d2 = DigitToHex(i%16);
    var h = d1+d2;
    return h;
}


/* AdvanceRGB takes a hex color and returns a new hex a given percent around the color wheel. */
function AdvanceRGBHex(start, cutoff, percent) {
    var redhex = start[0]+start[1];
    var greenhex = start[2]+start[3];
    var bluehex = start[4]+start[5];
    var cutoffdec = ParseHexDouble(cutoff);
    var loopsize = (255-cutoffdec)*6;
    var reddec = ParseHexDouble(redhex);
    var greendec = ParseHexDouble(greenhex);
    var bluedec = ParseHexDouble(bluehex);
    var amount = Math.floor(loopsize * percent/100);
    var newcolors = AdvanceRGBDec(reddec,bluedec,greendec,cutoffdec,amount);
    var newhex = IntToHex(newcolors[0]) + IntToHex(newcolors[1]) + IntToHex(newcolors[2]);
    return newhex;
}

function AdvanceRGBDec(red, blue, green, cutoff, amount) {
    var isatmin = [false,false,false];
    var isatmax = [false,false,false]
    
    if(red == cutoff)
        isatmin[0] = true;
    else if (red == 255)
        isatmax[0] = true;
        
    if(green == cutoff)
        isatmin[1] = true;
    else if(green == 255)
        isatmax[1] = true;
        
    if(blue == cutoff) {
        isatmin[2] = true;
    }
       
    else if(blue == 255)
        isatmax[2] = true;

    if(isatmax[0] && isatmin[2] && !isatmax[1]) { 
        if(green + amount < 255)
            green = green + amount;
        else {
            amount = amount + green - 255;
            green = 255;
            return AdvanceRGBDec(red,blue,green,cutoff,amount);
        }
    }
    else if(isatmax[2] && isatmin[1] && !isatmax[0]) { 
        if(red + amount < 255)
            red = red + amount;
        else {
            amount = amount + red - 255;
            red = 255;
            return AdvanceRGBDec(red,blue,green,cutoff,amount);
        }
    }
    else if(isatmin[0] && isatmax[1] && !isatmax[2]) { //red and green at minimum
        if(blue + amount < 255)
            blue = blue + amount;
        else {
            amount = amount + blue - 255;
            blue = 255;
            return AdvanceRGBDec(red,blue,green,cutoff,amount);
        }
    }
    else if(isatmin[2]) { //only blue at minimum
        if(red - amount > cutoff)
            red = red - amount
        else {
            amount = amount + cutoff - red;
            red = cutoff;
            return AdvanceRGBDec(red,blue,green,cutoff,amount);
        }
    }
    else if(isatmin[0]) {//only red is at minimum
        if(green - amount > cutoff)
            green = green - amount
        else {
            amount = amount + cutoff - green;
            green = cutoff;
            return AdvanceRGBDec(red,blue,green,cutoff,amount);
        }
    }
    else {
        if(blue - amount > cutoff)
            blue = blue - amount
        else {
            amount = amount + cutoff - blue;
            blue = cutoff;
            return AdvanceRGBDec(red,blue,green,cutoff,amount);
        }
    }
    return [red, green, blue];
}