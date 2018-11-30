var count = 0;
var track = 0;
function do_attack(monster,data){
	ctype = character.ctype;
	if(monster && ctype == "warrior"){
		do_monster_attack(monster)
	} else if( ctype == "warrior" ){ 
		do_warrior_attack(data)
	} else if( ctype == "mage" ){
		do_mage_attack(data);
	} else if( ctype == "priest" ){
		do_priest_attack(data);
	} else if( ctype == "ranger" ){
		do_ranger_attack(data);
	};
}

function do_warrior_attack(data){
	if( can_use("warcry") ){ use("warcry") };
	var target = get_target(data)
	if(!target){
		set_message("No Monsters");
		return;
	}
	
	if(!in_attack_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
	}
	else if(can_attack(target))
	{
		if( can_use("taunt") ){ use("taunt",target) };
		//if( can_use("stomp") ){ use("stomp") };
		set_message("Attacking");
		attack(target);
	}	
}

function do_mage_attack(data){
	if(localStorage.light == "true") {
		localStorage.light = false;
		use_skill("light");
	}
	var target = get_target(data)
	if(!target){
		set_message("No Monsters");
		return;
	}
	if( !in_attack_range(target) ){
		if(data.move){
			move( character.x+(target.x-character.x)/2, character.y+(target.y-character.y)/2);
		} else {
			target=get_nearest_monster(data);
			if(target){
				change_target(target)
			} else {
				set_message("No Monsters");
				return;
			}
		}
	} else if(can_attack(target)){
		set_message("Attacking");
		attack(target)
	}
}

function do_priest_attack(data){
	count < data.num ? count = count + 1 : count = 0;
	if(count == 0) use_skill("partyheal");
	if( can_use("darkblessing") ){ use("darkblessing") };
	var target = get_target(data)
	if(!target){
		set_message("No Monsters");
		return;
	}
	if(!in_attack_range(target)) {
		if(data.move){
			move( character.x+(target.x-character.x)/2, character.y+(target.y-character.y)/2);
		} else {
			target=get_nearest_monster(data);
			if(target){
				change_target(target)
			} else {
				set_message("No Monsters");
				return;
			}
		}
	} else if(can_attack(target)){
		set_message("Attacking");
		if( can_use("curse") && target.attack > 24) use("curse",target);
		attack(target)
	}
}

function do_ranger_attack(data){
	if(localStorage.light == "false"){
		track < data.track ? track = track + 1 : track = 0;
		if(track == 0) use_skill("track");
	}
	var arr = [];
	var shot = data.shot;
	for(var key in parent.entities){
		var monster = parent.entities[key];
		if(monster.type == "monster" &&
		   monster.mtype != "phoenix" &&
		   monster.mtype != "franky" ){
			if( in_attack_range(monster) ) {
				arr.push(monster.id)
			}
		}
	};
	
	if( can_use(shot+"shot") ){
		if( arr.length == 0) return;
		arr = arr.slice(0,shot);
		use(shot+"shot",arr)
	}
}

function get_target(data){
	var target = get_targeted_monster();
	if(!target){
		target = get_nearest_monster({type: "frog"});
		if(!target){
			target = get_nearest_monster({type: "snowman"});
			if(!target){
				target = get_nearest_monster({type: "phoenix"});
				if(!target){
					target = get_nearest_monster({type: "mvampire"});
					if(!target){
						target = get_nearest_monster(data);
					}
				}
			}
		}
	}
	if(target){
		change_target(target)
	} else {
		set_message("No Monsters");
		return;
	}
	return target;
}

function do_pvp(data){
	ctype = character.ctype;
	var target = get_nearest_hostile({
		exclude:  [// Friendly player whitelist.
        'Wizard', 'Death', 'Protector', 'Business',
        'Oragon',
        'Sinstrite', 'Curse', 'Shield', 'Script', 'Troll', 'Lootbot', 'Tycoon', 'Goldbot',
        'Xenovaria', 'neith', 'sedna', 'weisse',
        'SpadarFaar', 'Maela', 'Brutus', 'Foaly',
        'riverdusty','Daisy','Buttercup','LambChop','SweetPea','Persephone',
		'BuyMyThings','Landus','ChatTor','Copirious',
		'lissandra','chillll','sophia',
		'choko','chin',
		'Haether','Morcorino','Auctioneer','Gensei'
		],
		friendship: false
	});
	if(!target || target.rip ) { return };
	if( ctype == "warrior" ){ 
	} else if( ctype == "mage" ){
		if( can_use("burst") ) use("burst",target);
	} else if( ctype == "priest" ){
		if( can_use("curse") ) use("curse",target);
	} else if( ctype == "ranger" ){
		if( can_use("supershot") ) use("supershot",target);
	}
}
