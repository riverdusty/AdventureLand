clear_drawings();
load_code("cgoopath");
var target = get_target();

var recordPath = false;
var followPath = true;
var finishedRecording = true;

var kitePath = cgoo_path();

var targetIndex = findNearestPathPoint(character.real_x, character.real_y);

var kiteDirection = 1;

drawPath();

setInterval(function() {
	var health = character.max_hp - 400; // 200 if using the small pots
	var mana = character.max_mp - 500; // 300 if using the small pots
	var num_of_items = character.isize - character.esize;
	if (character.hp <= health && can_use('use_hp')) use('use_hp');
	if (character.mp <= mana && can_use('use_mp')) use('use_mp');
	loot();
	target = get_target();
	if(!target) target = get_nearest_monster({type:"cgoo"});
	if(target && in_attack_range(target) && can_attack(target)) {
		if( can_use("supershot") ) use("supershot",target);
		attack(target);
	}
	getKiteDirection();
	if(!recordPath && followPath && kitePath.length > 0)
	{
		followKitePath();
	}
	else if(recordPath && !finishedRecording)
	{
		recordKitePath();
	}
}, 100);

function recordKitePath()
{
	var lastPoint;
	
	if(kitePath.length > 0)
	{
		lastPoint = kitePath[kitePath.length - 1];
	}
	
	if(lastPoint == null || distanceToPoint(character.real_x, character.real_y, lastPoint.x, lastPoint.y) > 50)
	{
		var newPoint = {x: character.real_x, y: character.real_y};
		
		if(lastPoint != null)
		{
			draw_line(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y);
		}
		
		kitePath.push(newPoint);
	}
	
	if(kitePath.length > 2 && distanceToPoint(character.real_x, character.real_y, kitePath[0].x, kitePath[0].y) < 50)
	{
		if(!finishedRecording)
		{
			show_json(kitePath);
			finishedRecording = true;
		}
	}
}

function drawPath()
{
	for(var i = 0; i < kitePath.length; i++)
	{
		var point1 = kitePath[i];
		
		var point2;
		
		if(i == kitePath.length - 1)
		{
			point2 = kitePath[0];
		}
		else
		{
			point2 = kitePath[i+1];
		}
		
		draw_line(point1.x,point1.y,point2.x,point2.y);
	}
}

function findNearestPathPoint(x, y)
{
	var closestPoint;
	var closestPointDist;
	var closestIndex;
	
	for(var i = 0; i < kitePath.length; i++)
	{
		var point = kitePath[i];
		var pointDist = distanceToPoint(x, y, point.x, point.y);
		if(closestPoint == null || pointDist < closestPointDist)
		{
			closestPoint = point;
			closestPointDist = pointDist;
			closestIndex = i;
		}
	}
	
	return closestIndex;
}

function distanceToPoint(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x1 - x2, 2) + 							Math.pow(y1 - y2, 2));
}


function followKitePath()
{
	var targetDistance;
	if(target != null)
	{
		targetDistance = distanceToPoint(character.real_x, character.real_y, target.real_x, target.real_y);
	}
			
	if ((target == null || target.target != character.name) || targetDistance < character.range)
	{
		
		
		var targetPoint = kitePath[targetIndex];
		if(distanceToPoint(character.real_x, character.real_y, targetPoint.x, targetPoint.y) < 25)
		{
			kiteDirection = getKiteDirection();
			targetIndex = targetIndex + kiteDirection;
			if(targetIndex > kitePath.length - 1)
			{
				targetIndex = 0;
			}
			
			if(targetIndex < 0)
			{
				targetIndex = kitePath.length - 1;
			}
			
			targetPoint = kitePath[targetIndex];
		}
		
		var distToEnemy;
		
		if(target != null)
		{ 
			distToEnemy = distanceToPoint(character.real_x, character.real_y, target.real_x, target.real_y);
		}
		
		if((target == null || distToEnemy < character.range) || !can_move_to(target.real_x, target.real_y))
		{
			move(
				character.real_x+(targetPoint.x-character.real_x),
				character.real_y+(targetPoint.y-character.real_y)
			);
		}
		else
		{
			
			targetIndex = findNearestPathPoint(character.real_x, character.real_y);
			move(
				character.real_x+(target.real_x-character.real_x),
				character.real_y+(target.real_y-character.real_y)
			);
		}
	}
	else
	{
		move(character.real_x,character.real_y);
	}
}

function offsetToPoint(x, y)
{
	var angle = angleToPoint(x, y) + Math.PI;
	
	return angle - characterAngle();
	
}

function characterAngle()
{
	return (character.angle * Math.PI)/180;
}

function angleToPoint(x, y)
{
	var deltaX = character.real_x - x;
	var deltaY = character.real_y - y;
	
	return Math.atan2(deltaY, deltaX);
}

function getKiteDirection()
{
	
	return kiteDirection;
}
