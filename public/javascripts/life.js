
/* CalcLife takes a grid of nine cells and determines whether the center cell is alive or dead for the next round
according to the rules of Conway's Game of Life */
function CalcLife (aboveleft, abovecenter, aboveright, left, center, right, belowleft, belowcenter, belowright) {
    var neighbors = aboveleft + abovecenter + aboveright + left + right + belowleft + belowcenter + belowright;
    if (neighbors == 3) 
        return 1;
    if (center) {
        if(neighbors > 3 || neighbors < 2)
           return 0; 
        return 1;
    }
    return 0;
}

function CalcLife2(neighbors,center) {
    if (neighbors == 3) 
        return 1;
    if (center) {
        if(neighbors > 3 || neighbors < 2)
           return 0; 
        return 1;
    }
    return 0;
}

/* RunDay executes CalcLife for each cell in the grid.  
It returns a list of all cells that have changed.
*/
function RunDay(grid) {
    var rlen = grid[0].length;
    var changes = Array();
    for(var i = 1; i<grid.length-1; i++) {
        for(var j = 1; j<rlen -1; j++) {
            var tval = CalcLife(grid[i-1][j-1], grid[i-1][j],grid[i-1][j+1], grid[i][j-1], grid[i][j], grid[i][j+1], grid[i+1][j-1], grid[i+1][j], grid[i+1][j+1]);
            if(tval!=grid[i][j]) {
                changes.push([i,j]);
            }
        }
    }
    return changes;   
}

/*RunDay2 takes a grid and returns a list of all changes
While RunDay1 calculates the neighbors for every point, RunDay2 calculates horizontal triplets, then
sums them to get the current value. It's probably faster...
*/
function RunDay2(grid) {
    var changes = [];
    var row1 = []; //create three rows in memory to work from.
    for(var i =0; i<grid[0].length; i++) {
        row1.push(0);
    }
    var row2 = row1.slice(0);
    var row3 = [];
    var currneighbors = 0;
    var centerval = 0;
    var center = 0;
    for (i=0; i<grid.length;i++) { //loop through each row except the first and last.
        for(var j=1; j<grid[0].length-1; j++) { //each eligible cell (not the edges) gets some neighbors calculations
            center = grid[centerval][j];
            row3.push(grid[i][j-1] + grid[i][j] + grid[i][j+1]);
            currneighbors = row3[j]+row2[j]+row1[j] - center; 
            var tval = CalcLife2(currneighbors, center);
            if(tval!=center) {
                changes.push([i-1,j]);
            }
        }
        centerval = i;
        row3.push(0);
        row1 = row2.slice(0); //as we progress down, overwrite each row with the one below it.
        row2 = row3.slice(0);
        row3 = [0];
    }
    return changes;
}



function Run(grid, runstatus) {
    var slidepos = $("#gamespeed")[0].value;
    var tdelay = 1000 - slidepos/178*900;
	window.setTimeout(function(){
		var status = $('#gamecontrol')[0].value;
		if(status == runstatus) {
			Advance(grid);
			Run(grid, runstatus);
		}
	}, tdelay, true);
}

function Start(runName, stopName, grid) {
    $("#thegame table").addClass("running");
    $('#gamecontrol')[0].value = runName;
	$('#gamecontrol').html(stopName);
	Run(grid, runName);
	$('#advance').attr('disabled', 'disabled');
}

function Stop(runName, stopName) {
    $("#thegame table").removeClass("running");
    $('#gamecontrol')[0].value = stopName;
	$('#gamecontrol').html(runName);
	$('#advance').removeAttr('disabled');
}

function StartStop(grid) {
	var status = $('#gamecontrol')[0].value;
	var runName = "Run Simulation";
	var stopName = "Stop Simulation";
	
	if(status == runName) {
        Stop(runName, stopName);
	}
	else {
	    Start(runName, stopName, grid)
	}
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
	var changes = RunDay2(grid.rawgrid);
	for (change in changes) {
		var r = changes[change][0];
		var c = changes[change][1];
		var id = '#r'+String(r)+'c'+String(c);
		var spot = $(id)[0];
		ToggleSpot(spot, grid);
	}
}


function Grid(width, height, data) {
    /* MakeGrid takes a width and height and returns a wXh array initialized to 0*/
    this.MakeGrid =function(width, height) {
       if(!height){
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
        var rawhtml = '<table id="lifegrid" class="rainbowtable">';
        var state = ['dead', 'live'];
        for (line in this.rawgrid) {
            rawhtml = rawhtml + '<tr id="row' + String(line)+'">';
            for (element in this.rawgrid[line]) {
                rawhtml = rawhtml + '<td id = "r' + String(line) + 'c' + String(element) + '" class="' + state[this.rawgrid[line][element]] +' c' + String(element)+'">&nbsp;</td>';
            }
            rawhtml = rawhtml + '</tr>';
        }
        rawhtml = rawhtml + '</table>';
        return rawhtml;
    }    
    
    /* GridToString takes the grid of 0s and 1s and converts it to a compressed string. 
    String.fromCharCode(n) gives a string
    s.charCodeAt(0) gives the int value
    Could start a language at charcode 36 and go up to charcode 126. That gives a base 90 language.
    
    Each charcode represents a string of 0s, unless prefixed by a !
    
    Special delimiters: 
     # - new line
     ! - string of 1s
    */
    this.GridToString = function() { 
        function ValToString(val) {
            val = val + 35;
            if (!val) {
                return '';
            }
            if (val < 127) {
                return String.fromCharCode(val);
            }
            else {
                return '~' + ValToString(val-126);
            }
        }
        var gs = '';
        gs = gs + ValToString(this.rawgrid[0].length)+ '#' + ValToString(this.rawgrid.length) + '#';
        var contigs = 0;
        var onzero = true;
        var cval = 0;
        for (row in this.rawgrid) {
            onzero = true;
            for (cell in this.rawgrid[row]) {
                cval = this.rawgrid[row][cell];
                if(onzero) { //we're on a string of zeroes
                    if(!cval) {
                        contigs++;
                    }
                    else {
                        gs = gs + ValToString(contigs);
                        onzero = false;
                        contigs = 1;
                    }
                }
                else { //we're on a string of ones
                    if(cval) { //we're still on a string. Increment counter
                        contigs++;
                    }
                    else { //the string is done. Need to record it and move on.
                        gs = gs + '!' + ValToString(contigs);
                        contigs = 1;
                        onzero = true;
                    }
                }
            }
        }
        if(onzero) {
            gs = gs + ValToString(contigs);
        }
        else {
            gs = gs + '!' + ValToString(contigs);
        }
        return gs;
    }
    
    this.MakeGridFromString = function(s) {
        function charToVal(c) {
            return c.charCodeAt(0) - 35;
        }
        var hashes = s.split('#')
        var w = parseInt(charToVal(hashes[0]));
        var h = parseInt(charToVal(hashes[1]));
        var celldata = hashes[2];
        var rawgrid = [];
        var row = [];
        var remainder = this.width;
        var onestring = false;
        var leftoverones = false;
        var contigs = 0;
        var rowindex = 0;
        var colindex = 0;
        var cellen = celldata.length;
        for (var i = 0; i< cellen; i++) {
            if(celldata[i]=='!') {
                onestring = true;
                i++;
            }
            else {
                onestring = false;
            }
            contigs = charToVal(celldata[i]);
            while(contigs > 0) {
                if(onestring)
                    row.push(1);
                else
                    row.push(0);
                if(row.length == w) {
                    rawgrid.push(row);
                    row = [];
                }
                contigs = contigs -1;       
            }
        }
        rawgrid.push(row);
        return rawgrid;
    }
    
    this.AddGridToDOM = function(){
        Stop("Run Simulation", "Stop Simulation");
        var grid = this;
        var hex = 'FF5E5E';
        var colorfloor = '5E';
        var percent = 100/(this.width);
        $("#columncolors").remove();
        var stylehtml = '<style type="text/css" id="columncolors">';
        for (column in this.rawgrid[0]) {
            hex = ColorUtils.AdvanceRGBHex(hex, colorfloor, percent);
            rule = ' table.rainbowtable * .c' + String(column) + '.live {background-color:#'+hex+';}\n '; 
            stylehtml = stylehtml + rule;
        }
        stylehtml = stylehtml + '</style>';
        $(stylehtml).appendTo('head');
    	$("#tablearea").append(this.html);
    }
    
    this.setHandlers = function(shapes) {
        var g = this;
        $("#lifegrid td").mousedown(function(){
    		ToggleSpot(this, g);
    		isHighlightingBoxes = true;
		});
    	$("#lifegrid td").mouseover(function(){
    			if(isHighlightingBoxes)
    			    ToggleSpot(this, g);	
    			if(isDraggingShape) {
    				var selectedShape = $("#prefabs > .selected")[0].id;
    				var pattern = shapes[selectedShape];
    				RenderShape(this, pattern, g);
				}
    	});
    }

    if(arguments.length==3)
        this.rawgrid = data;
    else if(arguments.length==2) 
        this.rawgrid = this.MakeGrid(width,height);
    else {
        this.rawgrid = this.MakeGridFromString(width);
    }
    this.width = this.rawgrid[0].length;
    this.height = this.rawgrid.length;
    this.html = this.GridToHTML();
}

/* ChangeGrid removes the old grid from the DOM and replaces it with a new grid of the appropriate width/height */
function NewGrid(w,h, data) {
	$('#lifegrid').remove();
	if(arguments.length ==3)
	    g = new Grid(w,h, data);
	else
	    g = new Grid(w,h);
	g.AddGridToDOM();
	SetBoxSize();
	return g;
}
	
function SetBoxSize() {
	var val =$('#boxsize')[0].value;
	var newsize = parseInt(val);
	$("#boxstyle").remove();
	$("<style type='text/css' id='boxstyle'> td{ min-width:"+ val + "px; height:" + val+"px;} </style>").appendTo("head");
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
    Stop("Run Simulation", "Stop Simulation");
    $("body").css('cursor', 'pointer');
	$("td").mouseover(function(){
		RenderShape(this, shape, grid);
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