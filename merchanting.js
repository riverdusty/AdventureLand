load_code("DestroyRubbish");
parent.mlucked = {};
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            return xmlHttp.responseText;
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
	xmlHttp.responseText;
}

function init_mlucked(){
	let $ = parent.$;
	let brc = $('#bottomrightcorner'); 
	brc.find('#mlucked').remove();

	let xpt_container = $('<div id="mlucked"></div>').css({
		fontSize: '28px',
		color: 'white',
		textAlign: 'center',
		display: 'table',
		overflow: 'hidden',
		marginBottom: '-5px',
		width: "100%"
	});
	
  //vertical centering in css is fun
	let xptimer = $('<div id="mluckedcontent"></div>')
	.css({
		display: 'table-cell',
		verticalAlign: 'middle',
		backgroundColor: 'black'
	})
	.html("")
	.appendTo(xpt_container);

	brc.children().first().after(xpt_container);
	}

	function update_mlucked(){
		let $ = parent.$;
		$("#mluckedcontent").empty()
		var data = parent.mlucked;
		var table = $("<table>",{});
		for( var key in data ){
			var time_left = (new Date().getTime()) - (data[key].getTime());
			time_left = (time_left / (1000 * 60)) % 60;
			time_left = 60 - time_left;
			time_left = time_left.toFixed(2);
			var tr = $("<tr>",{});
			tr.append( $("<td>",{text: key}) )
				.append( $( "<td>",{text: time_left}) );
			table.append(tr);
		}
		$("#mluckedcontent").append( table );
	}

function add_mluck(entity){
	parent.mlucked[entity.name] = new Date();
};

function check_mluck(){
	for( var key in parent.mlucked ){
		var date = parent.mlucked[key];
		var time = new Date().getTime() - date.getTime();
		if( ( time / 1000 / 60 / 60 ) >= 1) delete( parent.mlucked[key] )
	}
}

function do_merchant_fetch(name,data){
	if( character.moving || is_moving(character) ) return;
	game_log("Going to "+name);
	var player = get_player(name);
	if(player){ var distance = parent.distance(character, player) };
	if( distance < 300 ){ send_cm(name,"Transfer") } else {
		parent.socket.emit("merchant",{"close":1});
		var old_loc = {};
		old_loc.x = character.x;
		old_loc.y = character.y;
		old_loc.map = character.map;
		var loc = {};
		loc.x = data.x;
		loc.y = data.y;
		smart_move(data, function(){
			send_cm(name,"Transfer");
			smart_move(old_loc,function(){
				parent.socket.emit("merchant",{"num":"41"});
					destroy_rubbish();
					//do market type stuff
			});
		});
	}
}

function do_merchant_mp(name,data){
	if( character.moving || is_moving(character) ) return;
	game_log("Going to "+name);
	var player = get_player(name);
	if(player){ var distance = parent.distance(character, player) };
	buy("mpot1",9999);
	var num;
	for(var i = 0; i < character.items.length; i++){
		if(character.items[i]){
			if(character.items[i].name == "mpot1"){
				num = i
			}
		}
	}
	if( distance < 300 ){ send_item(name,num,9999); } else {
		parent.socket.emit("merchant",{"close":1});
		var old_loc = {};
		old_loc.x = character.x;
		old_loc.y = character.y;
		old_loc.map = character.map;
		var loc = {};
		loc.x = data.x;
		loc.y = data.y;
		smart_move(data.map, function(){
			smart_move(loc,function(){ 
				send_item(name,num,9999);
				smart_move({to: old_loc.map}, function(){
					smart_move(old_loc,function(){
						parent.socket.emit("merchant",{"num":"41"})
						//do market type stuff
					});
				});
			});
		})
	}
}
