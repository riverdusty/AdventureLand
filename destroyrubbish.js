function destroy_rubbish(){
var destroy = ["hpbelt","hpamulet","coat","helmet","gloves","pants","shoes"];
var dismantle = ["fireblade","firestaff"];
    for (let i = 0; i < character.items.length; i++) {
        var item = character.items[i];
        var qt, lvl;
        if( item != null ){
            if( destroy.indexOf( item.name ) != -1 ){
                if(item.q){ qt = item.q } else { qt = 1 };
                    parent.sell(i,qt) 
            } else if( dismantle.indexOf( item.name ) != -1) {
                parent.socket.emit("dismantle",{num: i })
            }
        }
}};
