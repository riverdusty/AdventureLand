var attack_mode=true
var ctype = character.ctype;
var do_party_req = true;
load_code("Startup");
load_code("GoldMeter");
var monster = {type: "xscorpion", no_target: true};
var leader = "Buttercup";
var healer = "LambChop";
var merchant = "SweetPea";
ghost_arr = [];

function on_disappear(entity,data){
	if(entity.name == leader && character.name != leader) {
		if( localStorage.holiday == "yes") return;
		var alia = parent.get_npc("transporter");
		smart_move({x: alia.real_x, y: alia.real_y}, function(){
			parent.transport_to(data.to, data.s)
		})
	}
}

setInterval(function(){
	if(character.items[41]){
		if(character.items[41].q) {
			if(character.items[41].q < 5000){
				buy("mpot1", 1000);
			}
		} else { buy("mpot0", 1000); } // We have nothing most likely
	} else { buy("mpot0", 1000); } // We have nothing definitly

	if(character.items[40]){
		if(character.items[40].q) {
			if(character.items[40].q < 5000){
				buy("hpot1", 1000);
			}
		} else { buy("hpot1", 1000); } // We have nothing most likely
	} else { buy("hpot1", 1000); } // We have nothing definitly
	var health = character.max_hp - 400; // 200 if using the small pots
	var mana = character.max_mp - 500; // 300 if using the small pots
	if (character.hp <= health && can_use('use_hp')) use('use_hp');
	if (character.mp <= mana && can_use('use_mp')) use('use_mp');
	if(!character.party && do_party ){ do_party(); do_party_req = false };
	var player = get_player(leader);
	if( character.name == healer) loot();
	if( character.rip && character.hp < character.max_hp ) { use("use_hp") };
	if(!attack_mode || character.rip || is_moving(character)) return;
	var num_of_items = character.isize - character.esize;	
	if( num_of_items >= 14){ send_cm(merchant, {
		x: parent.character.real_x,
		y: parent.character.real_y,
		map: parent.character.map,
		cmd: "Fetch"}) }
	
	if(ctype == "warrior"){
		for(var i in parent.entities){
			a = parent.entities[i];
			if( a.target ){
				if( (Object.keys(parent.party)).indexOf(a.target) > -1 && a.target != leader){
					if( can_use("taunt") ){ use("taunt", a) };
				}
			}
		}
	}
	
	if(ctype == "priest"){
		for( members in parent.party ){
			var member = get_player(members);
			if( member.hp < member.max_hp - 1000 ) heal( member );
			if( member.rip && member.hp == member.max_hp ){
				if( can_use("revive") ){
					if( !member.c.revival ) use("revive",member)
				}
			}
		}
	}
	
	var target = get_targeted_monster();
	if( character.name != leader && player.s.xmas2 && !target) {
		var movePos = pointOnAngle(player, angleToPoint(player.real_x, player.real_y), 50 );
		move(movePos.x, movePos.y);
	}
	if( !target && get_player(healer) == undefined ) return;
	if( !target && ( distance( character, get_player(healer) ) > get_player(healer).range ) ) return;

	if(!target)
	{
		switch(ctype) {
			case "warrior":
				target = get_nearest_monster(monster);
				break;
			default: 
				target = get_nearest_monster({target:leader});
		}
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	switch(ctype){
		case "warrior":
			if( can_use("warcry") && target ){ use("warcry") };
			break;
		case "priest":
			if( can_use("darkblessing") && target ){ use("darkblessing") };
			break;
	}
    if( character.name == leader ){
		var movePos = pointOnAngle(target, angleToPoint(target.real_x, target.real_y), (character.range / 2) );
		move(movePos.x, movePos.y);
	} else {
		var movePos = pointOnAngle(player, angleToPoint(player.real_x, player.real_y), (character.range / 2) );
		move(movePos.x, movePos.y);
	}
		
	if(!in_attack_range(target)) {
		if(target){
			switch(ctype){
				case "warrior": 
					if(parent.distance(character, target) <= 200){
						if( !target.target ){
							if( can_use("taunt") ){ use("taunt") };
						}
					} else {
						target = get_nearest_monster(monster);
						if(target) { change_target(target) }
						}
					break;
				case "ranger":
					if(parent.distance(character, target) <= character.range * 3){ if( can_use("supershot") ){ use("supershot", target) } };
					break;	
				default:
					target = get_nearest_monster({target:leader});
					if(target) change_target(target);
			}
		}
	}
	else if(can_attack(target)) {
		set_message("Attacking");
		switch(ctype){
			case "warrior":
				attack(target);
				break;
			case "priest":
				if(monster.type == "ghost"){
					if( ghost_arr.indexOf(target.id) == -1) {
						heal(target);
						ghost_arr.push(target.id);
					}
				}
				if( can_use("curse") ){ use("curse",target) };
				attack(target);
				break;
			case "mage":
				if(get_player(leader).mp < 50){ use_skill("energize", get_player(leader)) };
				attack(target);
				break;
			default:
				attack(target);
		}
	};
},1000/4);

function pointOnAngle(entity, angle, distance)
{
    var circX = entity.real_x + (distance * Math.cos(angle));
    var circY = entity.real_y + (distance * Math.sin(angle));
    
    return {x: circX, y: circY};
}

function angleToPoint(x, y) {
    var deltaX = character.real_x - x;
    var deltaY = character.real_y - y;

    return Math.atan2(deltaY, deltaX);
}
