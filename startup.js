//On Load
var group = [
	"LambChop","Daisy","Buttercup","riverdusty","Persephone"
	];
var merch = "SweetPea";
localStorage.light = false;
map_key("P",{name:"snippet",code: "pause()"});
map_key("0",{name:"snippet",code: "load_code('Transfer')"});
if( character.party == undefined ) { character.party = null };

parent.socket._callbacks.$track.forEach(function(a,i){ parent.socket.removeListener("track",a) })
parent.socket._callbacks.$track.forEach(function(a,i){ parent.socket.removeListener("track",a) })
parent.socket._callbacks.$track.forEach(function(a,i){ parent.socket.removeListener("track",a) })
parent.socket._callbacks.$track.forEach(function(a,i){ parent.socket.removeListener("track",a) })

parent.socket.on("track",function(list){ 
	for(var i = 0; i < list.length; i++){
		var snd = list[i];
		if( snd.dist < 200 && snd.invis ){
			game_log("AZIZ! LIGHT!");
			localStorage.light = true;
		}
	}
});

function do_party(){
	for(var i = 0; i < group.length; i++){
		if(!character.party && group[i] != character.name){ send_party_request(group[i]) }
	};
	if(!character.party){
		for(var i = 0; i < group.length; i++){
			if(group[i] != character.name){ send_party_invite( group[i] ) }
		}
	}
}

function on_party_invite(name){
	if( group.indexOf(name) > -1 ) { accept_party_invite(name) };
}

function on_party_request(name){
	if( group.indexOf(name) > -1 ) { accept_party_request(name) };
}

function on_cm(name,data) {
	if(name == merch){
		load_code(data);
	} else if( group.indexOf(name) > -1 && name != merch){
		do_merchant(name, data);
	}
}

function do_merchant(name, data){
	if( data.cmd == "Fetch" ){ do_merchant_fetch(name,data) };
	if( data.cmd == "mp"){ do_merchant_mp(name,data) };
	if( data.cmd == "hp"){ do_merchant_hp(name,data) };
	if( data.cmd == "mluck"){ do_mercahnt_mluck(name,data) };
}

function collect( inarr, str ){
	var newArr = [];
	var arr = Object.values(inarr);
	for( var i = 0; i < arr.length; i++ ){
		if(arr[i].name){ if(arr[i].name == str){ newArr.push( arr[i]) } }
		if(arr[i].mtype){ if(arr[i].mtype == str){ newArr.push( arr[i]) } }
		if(arr[i] == str){ newArr.push( arr[i]) }
	}
	return newArr;
}
