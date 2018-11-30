load_code("Startup");
load_code("Attacking");
load_code("GoldMeter");

setInterval(function(){
	var health = character.max_hp - 400; // 200 if using the small pots
	var mana = character.max_mp - 500; // 300 if using the small pots
	var num_of_items = character.isize - character.esize;
	if (character.hp <= health && can_use('use_hp')) use('use_hp');
	if (character.mp <= mana && can_use('use_mp')) use('use_mp');
	if (character.mp < 420) return;
	if(!character.party){ do_party() };
	loot();
	
	if( num_of_items >= 15){ send_cm("SweetPea", {
		x: parent.character.real_x,
		y: parent.character.real_y,
		map: parent.character.map,
		cmd: "Fetch"}) }
	
	if(character.rip && character.hp < 1000 ) { return } else { respawn };
	if(this.DebugPVP || parent.is_pvp || get_map().pvp) do_pvp(null);
	do_attack(null,{move: true, track: 4, num: 64, shot: 3, min_xp:100, type: "tortoise"});
	
},400);
