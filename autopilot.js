load_code("Startup");
load_code("AutoUpgradeFunctions");
load_code("Merchanting");
init_mlucked();
var group = ["Brutus","Maela","SpadarFaar",
			 "Wizard","Protector","Death",
			 "Lexus","Symphony","Magnus","Rhyme","Scythe","Khaizer",
			 "frisbee","boomerang","soylentbean","shuttlecock",
			 "sophia","chillll","lissandra",
			 "riverdusty","Daisy","Buttercup","LambChop","Persephone"];

setInterval(function(){
	use_hp_or_mp();
	mluck_all();
	check_mluck();
	var target = get_nearest_monster({target: "SweetPea"});
	if(target){ if( can_use("scare") ){ use("scare") } };
	var player_found = false;
	for(member in group){
		player = get_player( group[member] );
		if( player ) {
			player_found = true;
			if( parent.distance(character, player) < 350) {
				if( player.s ) {
					if( player.s.mluck ) {
						if(player.s.mluck.f != "SweetPea"){
							use_skill("mluck",player.name)
						}
					} else { use_skill("mluck",player.name) }
				} else { use_skill("mluck",player.name) }
			}
		}
	};
	if(parent != null && parent.socket != null){
		if(character.gold > 100000){
			upgrade()
			compound_items();
		}
	};
	destroy_rubbish();
	update_mlucked();
},1000);

function setNextFireworks(){
    var nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    nextHour.setMilliseconds(0);
    
    var msUntilNextHour = nextHour - new Date();
    game_log(nextHour);
    setTimeout(throwFireworks, msUntilNextHour);
}

function throwFireworks(){
    parent.socket.emit("throw",{num:34,x:character.real_x,y:character.real_y});
    setNextFireworks();
};

function mluck_all(){
	var ent = [];
	for( var key in parent.entities ){
		var entity = parent.entities[key];
		if( entity.type == "character" && 
		   !entity.npc &&
		   entity.ctype != "merchant") {
				if( parent.distance(character, entity) < 350) {
					if( entity.s ) {
						if( entity.s.mluck ) {
							if(entity.s.mluck.f != "SweetPea"){
								use_skill("mluck",entity.name);
								add_mluck(entity);
							}
						} else { 
							use_skill("mluck",entity.name);
							add_mluck(entity);
						}
					} else { 
						use_skill("mluck",entity.name);
						add_mluck(entity);
					}
				}
			}
	};
}
//setNextFireworks();
