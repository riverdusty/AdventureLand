function destroy_rubbish(){
	var destroy = [
        "hpbelt","hpamulet","ringsj","shoes","pants","coat","helmet","gloves",
	"shoes1","pants1","coat1","helmet1","gloves1"];
    var dismantle = ["fireblade","firestaff"];
    for (let i = 0; i < character.items.length; i++) {
        var item = character.items[i];
        var qt, lvl;
        if( item != null ){
            if( destroy.indexOf( item.name ) != -1 && 
               ((item.level < 3) || !item.level) ){
                if(item.q){ qt = item.q } else { qt = 1 };
                    parent.sell(i,qt) 
            } else if( dismantle.indexOf( item.name ) != -1) {
                parent.socket.emit("dismantle",{num: i })
            }
        }	
	}
}

setInterval(function(){ 
	exchange(0);
	setTimeout(function(){},1);
	destroy_rubbish();
},350)
