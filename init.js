function initializeGame(){

var shapes = new Object();
shapes.blinker = [[0,-1],[0,0],[0,1]];
shapes.glider = [[-1,1],[0,0],[1,0],[-1,-1],[0,-1]];
shapes.toad = [[0,0],[1,0],[2,0],[-1,-1],[0,-1],[1,-1]];
shapes.beacon =[[0,0],[1,0],[0,1],[1,1],[2,2],[3,2],[2,3],[3,3]];
shapes.pulsar = [[0,0],[1,0],[2,0],[6,0],[7,0],[8,0],
	[-2,2],[3,2],[5,2],[10,2],
	[-2,3],[3,3],[5,3],[10,3],
	[-2,4],[3,4],[5,4],[10,4],
	[0,5],[1,5],[2,5],[6,5],[7,5],[8,5],
	[0,7],[1,7],[2,7],[6,7],[7,7],[8,7],
	[-2,8],[3,8],[5,8],[10,8],
	[-2,9],[3,9],[5,9],[10,9],
	[-2,10],[3,10],[5,10],[10,10],
	[0,12],[1,12],[2,12],[6,12],[7,12],[8,12]];
shapes.fpentomino = [[0,0],[1,0],[-1,1],[0,1],[0,2]];
shapes.diehard = [[6,-1],[0,0],[1,0],[1,1],[5,1],[6,1],[7,1]];
shapes.acorn = [[0,0],[2,1],[-1,2],[0,2],[3,2],[4,2],[5,2]];
shapes.lwss = [[0,0],[3,0],[4,1],[0,2],[4,2],[1,3],[2,3],[3,3],[4,3]];

w= parseInt($("#gridwidth")[0].value);
h= parseInt($("#gridheight")[0].value);
g = NewGrid(w,h);
g.setHandlers(shapes);
SetBoxSize();

isHighlightingBoxes = false;
isDraggingShape = false;
$('body').mouseup(function() {
    isHighlightingBoxes = false;
    isDraggingShape = false;
});


$("#speedcontrol").draggable({ axis: 'x' }, { containment: 'parent' });
$("#advance").click(function(){
	Advance(g);
});
$("#gamecontrol").click(function(){
	StartStop(g);
});

$("#newgrid").click(function(){
	w= parseInt($("#gridwidth")[0].value);
	h= parseInt($("#gridheight")[0].value);
	g = NewGrid(w,h);
	g.setHandlers(shapes);
});

$("#stringify").click(function(){
	var string = g.GridToString();
	$("#stringarea")[0].value = string;
});

$("#gridify").click(function(){
	var s = $("#stringarea")[0].value;
	g=NewGrid(s,0);
	g.setHandlers(shapes);
});

$(".toggle").click(function(){
	$(this).toggleClass('expanded');
	if($(this).hasClass('expanded')) {
		$(this).next('.group').show();
		$(this).css('background-image', "url('minusbox.png')");
	}
	else {
		$(this).next('.group').hide();
		$(this).css('background-image', "url('plusbox.png')");
	}
});

$("#rainbow").click(function(){
	$("#lifegrid").toggleClass('rainbowtable');
	
});

$("#speedcontrol").mousedown(function(){
    $(document).mousemove(function(){
        $("#gamespeed")[0].value = $("#speedcontrol").position().left;
        $(document).mouseup(function(){
           $(document).unbind('mousemove');
           $(document).unbind('mouseup');
        $("#gamespeed")[0].value = $("#speedcontrol").position().left;
        });
    });

});

$(".prefab").mousedown(function(){
    $(".prefab").removeClass("selected");
    $(this).addClass("selected");
    isDraggingShape = true;
    Stop("Run Simulation", "Stop Simulation");
})


}