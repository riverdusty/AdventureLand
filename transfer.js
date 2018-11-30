var nosend = ["hpot0","hpot1","mpot0","mpot1",
			  "elixirstr0","elixirdex0","elixirint0",
			  "elixirstr1","elixirdex1","elixirint1",
			   "elixirstr2","elixirdex2","elixirint2",
			  "elixirluck",
			  "essenceoflife",
			  "computer",
			  "xpbooster","goldbooster","luckbooster"];
var i = 0;
setInterval(function(){
if(i < character.items.length) {
	var item = character.items[i];
	if( item != null ){
		if( nosend.indexOf( item.name ) == -1 ){
			var qt;
			if(item.q){ qt = item.q } else { qt = 1 };
			send_item("SweetPea",i,qt)
		}
	}
	i = i + 1;
}},100);
if( character.gold > 1000000 ){ send_gold("SweetPea", (character.gold - 1000000)) };
