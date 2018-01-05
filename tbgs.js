/*
* Tadsters Basic Game Objects, tabageos, version 2.0.  // CopyRight 2018 (t)ad.   actiontad.com/basicGameObjects
*  MoverPoint, Rectangle, Event, EventDispatcher, CanvasObject, CanvasAnimation, CanvasObjectContainer, ScreenSkeleton
*  Mover, TravelerSkeleton, Traveler, BlittedTraveler, WDTraveler, RotatingTraveler, RotatingShooter
*  AnimatedBlittedTileMover, SceneryThrower, SceneryObject. TimeKeeper, MouseController, IntervalController
*  WayDeterminer, BlitMath, TileData, TweenMath, GeometricMath, BasicCamera, IrisScreenOrganizer, SoundSystem, ExplosionFactory, LoopingImage
*  Also ControllerPad.js and the TileSetPainter application.  
*/
this.tabageos = this.tabageos || {};(function() {function TimeKeeper() { }TimeKeeper.started = false;TimeKeeper.time = 0;TimeKeeper.timeElapsed = 1;TimeKeeper.newTime = 0;TimeKeeper.slowness = 96;TimeKeeper.keepTime = function() {if(tabageos.TimeKeeper.started == false) {tabageos.TimeKeeper.started = true; tabageos.TimeKeeper.time = TimeKeeper.now();}tabageos.TimeKeeper.newTime = TimeKeeper.now();tabageos.TimeKeeper.timeElapsed = tabageos.TimeKeeper.newTime - tabageos.TimeKeeper.time;tabageos.TimeKeeper.time = tabageos.TimeKeeper.newTime;};TimeKeeper._keepTime = function(tme) { tabageos.TimeKeeper.newTime = tme;tabageos.TimeKeeper.timeElapsed = tabageos.TimeKeeper.newTime - tabageos.TimeKeeper.time;tabageos.TimeKeeper.time = tabageos.TimeKeeper.newTime;};TimeKeeper.status = function(stat) {if(stat == false) {tabageos.TimeKeeper.timeElapsed = 1; tabageos.TimeKeeper.started = false;} else {tabageos.TimeKeeper.time = TimeKeeper.now(); tabageos.TimeKeeper.started = true;}};TimeKeeper.reset = function(ts) {tabageos.TimeKeeper.status(false);tabageos.TimeKeeper.status(true);window.requestAnimationFrame( function(tstmp) { tabageos.TimeKeeper.time = tstmp; } );};TimeKeeper._sae = .666666666667;TimeKeeper.init = function() {window.requestAnimationFrame( function(tstmp) { tabageos.TimeKeeper.time = tstmp; window.requestAnimationFrame( function(tstmp) { TimeKeeper._keepTime(tstmp);TimeKeeper.speedAdjustedElapsed(); } )} );};TimeKeeper.speedAdjustedElapsed = function() { if(TimeKeeper._sae == -99) TimeKeeper._sae = (tabageos.TimeKeeper.timeElapsed > 1 ? tabageos.TimeKeeper.timeElapsed / tabageos.TimeKeeper.slowness : tabageos.TimeKeeper.timeElapsed);return TimeKeeper._sae;};TimeKeeper.now = function() {if(!performance || !performance.now) {return Date.now();} else {return performance.now();}};tabageos.TimeKeeper = TimeKeeper;})();this.tabageos = this.tabageos||{};(function() {function Rectangle(x, y, width, height) {this.x = x || 0;this.y = y || 0;this.height = height || 0;this.width = width || 0;};Rectangle.prototype.x = 0;Rectangle.prototype.y = 0;Rectangle.prototype.width = 0;Rectangle.prototype.height = 0;tabageos.Rectangle = Rectangle;})();this.tabageos = this.tabageos||{};(function() {function BoundMethods() {};BoundMethods.boundTo = function(mover, boundObject) {var pos = mover.getPosition();var width = mover.width;var height = mover.height;if (pos.x + width >= boundObject.x + boundObject.width) {pos.x = boundObject.x + boundObject.width - width; }if (pos.x < boundObject.x) {pos.x = boundObject.x; }if (pos.y + height >= boundObject.y + boundObject.height) {pos.y = boundObject.y + boundObject.height - height; }if (pos.y < boundObject.y) {pos.y = boundObject.y; } };BoundMethods.bounceOff = function(mover, boundObject) {var pos = mover.getPosition();var width = mover.width;var height = mover.height;if (pos.x + width >= boundObject.x + boundObject.width) {pos.x = boundObject.x + boundObject.width - width;mover.velocity.x *= -1;}if (pos.x < boundObject.x) {pos.x = boundObject.x;mover.velocity.x *= -1;}if (pos.y + height >= boundObject.y + boundObject.height) {pos.y = boundObject.y + boundObject.height - height;mover.velocity.y *= -1;}if (pos.y < boundObject.y) {pos.y = boundObject.y;mover.velocity.y *= -1;}};BoundMethods.wrapAround = function(mover, boundObject) {var pos = mover.getPosition();var width = mover.width;var height = mover.height;if (pos.x > boundObject.x + boundObject.width + width) {pos.x = boundObject.x - width;}if (pos.x < boundObject.x - width) {pos.x = boundObject.x + boundObject.width + width;}if (pos.y > boundObject.y + boundObject.height + height) {pos.y = boundObject.y - height;}if (pos.y < boundObject.y - height) {pos.y = boundObject.y + boundObject.height;}};tabageos.BoundMethods = BoundMethods;})();this.tabageos = this.tabageos||{};(function() {function MoverPoint(x , y ) {this.x = x || 0;this.y = y || 0;};MoverPoint.prototype.x = null; MoverPoint.prototype.y = null; MoverPoint.prototype._length = null; MoverPoint.prototype._angle = null; MoverPoint.prototype.getSquaredLength = function() {return this.x * this.x + this.y * this.y;};MoverPoint.prototype.perp = function() {return new tabageos.MoverPoint(-this.y, this.x);};MoverPoint.prototype.getX = function() {return this.x;};MoverPoint.prototype.setX = function(toThis) {this.x = toThis;};MoverPoint.prototype.getY = function() {return this.y;};MoverPoint.prototype.setY = function(toThis) {this.y = toThis;};MoverPoint.prototype.getAngle = function() {if (this._angle == null) {this._angle = Math.atan2(this.y, this.x);} return this._angle;};MoverPoint.prototype.setAngle = function(toThis) {var l = this.getLength();this.x = Math.cos(toThis) * l;this.y = Math.sin(toThis) * l;this._angle = toThis;};MoverPoint.prototype.getLength = function() {if (this._length == null) {this._length = Math.sqrt(this.getSquaredLength());} return this._length;};MoverPoint.prototype.setLength = function(toThis) {var a = this.getAngle();this.x = Math.cos(a) * toThis;this.y = Math.sin(a) * toThis;this._length = toThis;};MoverPoint.prototype.normalize = function() {if (this.getLength() == 0) {this.x = 1;return this;} var l = this.getLength();this.x /= l; this.y /= l;return this;};MoverPoint.prototype.reverse = function() {this.x = -this.x;this.y = -this.y;return this;};MoverPoint.prototype.subtractBy = function(xAmount , yAmount , makeNew ) {if (makeNew != 0) {return new tabageos.MoverPoint(this.x - xAmount, this.y - yAmount);} else {this.x = this.x - xAmount;this.y = this.y - yAmount;return this;}};MoverPoint.prototype.truncate = function(max) {this.setLength(this.getLength() > max ? max : this.getLength());return this;};MoverPoint.prototype.subtract = function(mp, makeNew ) {if (makeNew != 0) {return new tabageos.MoverPoint(this.x - mp.x, this.y - mp.y);} else {this.x = this.x - mp.x;this.y = this.y - mp.y;return this;}};MoverPoint.prototype.add = function(mp, makeNew ) {if (makeNew != 0) {return new tabageos.MoverPoint(this.x + mp.x, this.y + mp.y);} else {this.x = (this.x + mp.x);this.y = (this.y + mp.y);return this;}};MoverPoint.prototype.sign = function(mp) {return this.perp().dotProduct(mp) < 0 ? -1 : 1;};MoverPoint.prototype.multiply = function(value, makeNew ) {if (makeNew != 0) {return new tabageos.MoverPoint(this.x * value, this.y * value);} else {this.x = this.x * value;this.y = this.y * value;return this;}};MoverPoint.prototype.dotProduct = function(mp) {return this.x * mp.x + this.y * mp.y;};MoverPoint.prototype.squaredDistance = function(mp) {var dx = mp.x - this.x;var dy = mp.y - this.y;return dx * dx + dy * dy;};MoverPoint.prototype.equals = function(mp) {return this.x == mp.x && this.y == mp.y;};MoverPoint.prototype.dist = function(mp) {return Math.sqrt(this.squaredDistance(mp));};MoverPoint.prototype.clone = function() {return new tabageos.MoverPoint(this.x, this.y);};MoverPoint.prototype.addBy = function(xAmount , yAmount , makeNew ) {if (makeNew != 0) {return new tabageos.MoverPoint(this.x + xAmount, this.y + yAmount);} else {this.x = this.x + xAmount;this.y = this.y + yAmount;return this;}};MoverPoint.prototype.reset = function() {this.x = 0;this.y = 0;this._length = Math.sqrt(this.getSquaredLength());this._angle = Math.atan2(this.y, this.x);};MoverPoint.prototype.divide = function(value, makeNew ) {if (makeNew != 0) {return new tabageos.MoverPoint(this.x / value, this.y / value);} else {this.x = this.x / value;this.y = this.y / value;return this;}};MoverPoint.angleBetweenMoverPoints = function(mp1, mp2) {if (mp1.getLength() != 1) mp1 = mp1.clone().normalize();if (mp2.getLength() != 1) mp2 = mp2.clone().normalize();return Math.acos(mp1.dotProduct(mp2));};MoverPoint.squaredDistanceBetween = function(mp1, mp2) {var dx = mp1.x - mp2.x;var dy= mp1.y - mp2.y;return dx * dx + dy * dy;};MoverPoint.distBetween = function(mp1, mp2) {return Math.sqrt(tabageos.MoverPoint.squaredDistanceBetween(mp1, mp2));};tabageos.MoverPoint = MoverPoint;})();this.tabageos = this.tabageos || {};(function() {function MoverSkeleton(x , y , width , height ) {this.width = width||0; this.height = height||0;this._middlePoint = new tabageos.MoverPoint();this._pos = new tabageos.MoverPoint(x, y);this._veloc = new tabageos.MoverPoint();this.x = x || 0; this.y = y || 0;};MoverSkeleton.prototype.maxSpeed = 20; MoverSkeleton.prototype.mass = 2; MoverSkeleton.prototype._veloc = null; MoverSkeleton.prototype._pos = null;MoverSkeleton.prototype.dX = null; MoverSkeleton.prototype.x = null; MoverSkeleton.prototype.dY = null; MoverSkeleton.prototype.y = null; MoverSkeleton.prototype.width = null; MoverSkeleton.prototype.height = null; MoverSkeleton.prototype._middlePoint = null; MoverSkeleton.prototype.getHeight = function() {return this.height;};MoverSkeleton.prototype.getVerticalDirection = function() {return this.dY;};MoverSkeleton.prototype.getHorizontalDirection = function() {return this.dX;};MoverSkeleton.prototype.getWidth =function() {return this.width;};MoverSkeleton.prototype.getPosition = function() {return this._pos;};MoverSkeleton.prototype.setPosition =  function(toThis) {this._pos = toThis;this.x = this._pos.x;this.y = this._pos.y;};MoverSkeleton.prototype.getVelocity = function() {return this._veloc;};MoverSkeleton.prototype.setVelocity = function(toThis) {this._veloc = toThis;};MoverSkeleton.prototype.getX = function() {return this.x;};MoverSkeleton.prototype.setX = function(toThis) {if (toThis > this.x) {this.dX = 1;}if (toThis < this.x) {this.dX = -1;}if (toThis == this.x) {this.dX = 0;} this.x = toThis;this._pos.x = toThis;};MoverSkeleton.prototype.getY = function() {return this.y;};MoverSkeleton.prototype.setY = function(toThis) {if (toThis > this.y) {this.dY = 1;}if (toThis < this.y) {this.dY = -1;}if (toThis == this.y) {this.dY = 0;} this.y = toThis;this._pos.y = toThis;};MoverSkeleton.prototype.getMiddle = function() {this._middlePoint.reset();this._middlePoint.x = this.x + (this.width >> 1);this._middlePoint.y = this.y + (this.height >> 1);return this._middlePoint; };tabageos.MoverSkeleton = MoverSkeleton;})();this.tabageos = this.tabageos||{};(function() {function TravelerSkeleton(x , y , width , height ) {this.forceApplier = new tabageos.MoverPoint();this.forceHolder = new tabageos.MoverPoint();this.x = x || 0; this.y = y || 0; this._w = width || 0; this._h = height || 0;this.wanderOffset = new tabageos.MoverPoint(0, 0);this.blankMO = new tabageos.MoverPoint();this._eventDispatcher = new tabageos.EventDispatcher();};TravelerSkeleton.prototype = new tabageos.MoverSkeleton();TravelerSkeleton.prototype.spreadDistance = 10; TravelerSkeleton.prototype.circleDistance = 10; TravelerSkeleton.prototype.separationDistance = 10; TravelerSkeleton.prototype.bypassAvoidDistance = null; TravelerSkeleton.prototype.maxForce = 12; TravelerSkeleton.prototype.forceApplier = null; TravelerSkeleton.prototype.followDistance = null; TravelerSkeleton.prototype.easeProximity = 2; TravelerSkeleton.prototype.wanderProximity = 10; TravelerSkeleton.prototype.wanderAngle = 10; TravelerSkeleton.prototype.wanderRadius = 20; TravelerSkeleton.prototype.wanderRange = 20; TravelerSkeleton.prototype.wanderOffset = null; TravelerSkeleton.prototype.avoidSpace = 20; TravelerSkeleton.prototype.avoidee = null; TravelerSkeleton.prototype.avoidDistance = 20; TravelerSkeleton.prototype.visionDistance = 20; TravelerSkeleton.prototype.personalSpace = 20; TravelerSkeleton.prototype.mass = 2; TravelerSkeleton.prototype.maxSpeed = 5; TravelerSkeleton.prototype.forceHolder = null; TravelerSkeleton.prototype.blankMO = null; TravelerSkeleton.prototype.flockCount = null; TravelerSkeleton.prototype.bird = null; TravelerSkeleton.prototype._eventDispatcher = null; TravelerSkeleton.prototype._pathIndex = 0; TravelerSkeleton.prototype.listenerStrings = null; TravelerSkeleton.prototype.listenerMethods = null; TravelerSkeleton.prototype.getMaxForceSquared =  function() {return this.maxForce * this.maxForce;};TravelerSkeleton.prototype.getPathIndex = function() {return this._pathIndex;};TravelerSkeleton.prototype.setPathIndex = function(toThis) {this._pathIndex = toThis;};TravelerSkeleton.prototype.separate = function(withThese, separatePriority) {var force = this.getSeparationForce(withThese);if (separatePriority > 1) force.multiply(separatePriority, 0);this.forceApplier = this.forceApplier.add(force);};TravelerSkeleton.prototype.separateFromThis = function(mover) {var force = forceHolder; var difference;var distance;forceHolder.reset();distance = MoverPoint.distBetween(this._pos, mover.getPosition());if ( distance > 0 && distance < this.separationDistance) {difference = this._pos.subtract(mover.getPosition());force.add(difference.multiply(distance), 0);}this.forceApplier = this.forceApplier.add(force);};TravelerSkeleton.prototype.getSteerForce = function(target, ease , easeDistance ) {var steeringForce = target.clone();steeringForce.subtract(this._pos, 0);var distance = this._pos.dist(steeringForce.normalize());if ( distance > 0 ) {if ( distance < easeDistance && ease ) {steeringForce.multiply(this.maxSpeed * ( distance / easeDistance ), 0);} else {steeringForce.multiply(this.maxSpeed, 0);}steeringForce.subtract(this._veloc, 0);if ( steeringForce.getSquaredLength() > this.getMaxForceSquared() ) {steeringForce.truncate(this.maxForce);}} return steeringForce;};TravelerSkeleton.prototype.flee = function(mp) {var targetVeloc = mp.subtract(this._pos);targetVeloc.normalize();targetVeloc.multiply(this.maxSpeed, 0);var force = targetVeloc.subtract(this._veloc);this.forceApplier = this.forceApplier.subtract(force);};TravelerSkeleton.prototype.easeTo = function(mp) {var targetVeloc = mp.subtract(this._pos);targetVeloc.normalize();var distance = this._pos.dist(mp);if (distance > this.easeProximity) {targetVeloc.multiply(this.maxSpeed, 0);} else {var easing = this.maxSpeed * distance/this.easeProximity;targetVeloc.multiply(easing, 0);}var force = targetVeloc.subtract(this._veloc);this.forceApplier = this.forceApplier.add(force);};TravelerSkeleton.prototype.getSeparationForce = function(fromThese) {var force = this.forceHolder; this.forceHolder.reset();var difference;var distance;var count = 0;var mover;var i = 0;for (i = 0; i < fromThese.length; i++) {mover = fromThese[i];distance = tabageos.MoverPoint.distBetween(this._pos, mover.getPosition());if ( distance > 0 && distance < this.separationDistance) {difference = this._pos.subtract(mover.getPosition());force.add(difference.multiply(distance), 0);count++;}}if ( count > 0 ) {force.multiply(1 / count, 0);} return force;};TravelerSkeleton.prototype.canSeeThis = function(mp) {var result;if (this._pos.dist(mp) > this.visionDistance) return result;var sight = this._veloc.clone().normalize();var distanceDifference = mp.subtract(this._pos);var dotProduct = distanceDifference.dotProduct(sight);if (dotProduct < 0) { result = false; } else { result = true; }return result;};TravelerSkeleton.prototype.getAlignmentForce = function(withThese) {var force = this.forceHolder; this.forceHolder.reset();var distance;var count = 0;var mover;var i = 0;for (i = 0; i < withThese.length; i++) {mover = withThese[i];distance = tabageos.MoverPoint.distBetween(this._pos, mover.getPosition());if ( distance > 0 && distance < this.separationDistance ) {force.add(mover.getVelocity(), 0);count++;}}if ( count > 0 ) {force.multiply(1 / count, 0);if ( force.getSquaredLength() > this.getMaxForceSquared() ) {force.truncate(this.maxForce);}} return force;};TravelerSkeleton.prototype.almostCloseTo = function(mp) {return this._pos.dist(mp) < this.personalSpace;};TravelerSkeleton.prototype.getCohesionForce = function(withThese) {var force = this.forceHolder; this.forceHolder.reset();var distance;var count = 0;var mover;var i = 0;for (i = 0; i < withThese.length; i++) {mover = withThese[i];distance = tabageos.MoverPoint.distBetween(this._pos, mover.getPosition());if ( distance > 0 && distance < this.personalSpace ) {force.add(mover.getPosition(), 0);count++;}}if ( count > 0 ) {force.multiply(1 / count, 0);force = this.getSteerForce(force, true, this.personalSpace);return force;} return force;};TravelerSkeleton.prototype.easeAwayFrom = function(mp) {if(this._pos.dist(mp) < this.avoidDistance || this.bypassAvoidDistance > 0) {var targetVeloc = mp.subtract(this._pos);targetVeloc.normalize();var distance = this._pos.dist(mp);if (distance < this.easeProximity) {targetVeloc.multiply(this.maxSpeed, 0);} else {var easing = this.maxSpeed * distance/this.easeProximity;targetVeloc.multiply(easing, 0);}var force = targetVeloc.subtract(this._veloc);this.forceApplier = this.forceApplier.subtract(force);}};TravelerSkeleton.prototype.chase = function(target) {var chaseTime = this._pos.dist(target._pos) / this.maxSpeed;var heading = target._pos.add(target._veloc.multiply(chaseTime));this.easeTo(heading);};TravelerSkeleton.prototype.getHideSpot = function(currentPosition, radius, from) {var dist = (personalSpace * 2) + radius;var ideal = currentPosition.subtract(from.position).normalize();return ideal.multiply(dist).add(currentPosition);};TravelerSkeleton.prototype.hide = function(behindThese, from) {var closetObstacleDistance = Number.MAX_VALUE;var i = -1;var m; var check; var spot;var dist;while (i != behindThese.length - 1) { i++;m = behindThese[i];if (m) {check = getHideSpot(m.position, m.width, from);dist = check.dist(this._pos);if (dist < closetObstacleDistance) {closetObstacleDistance = dist;spot = check;}}}if (closetObstacleDistance != Number.MAX_VALUE) {this.easeTo(spot);}};TravelerSkeleton.prototype.wander = function() {var middle = this._veloc.clone().normalize().multiply(this.wanderProximity);this.wanderOffset.setLength( this.wanderRadius );this.wanderOffset.setAngle( this.wanderAngle );this.wanderAngle += Math.random() * this.wanderRange - this.wanderRange * .5;var force = middle.add(this.wanderOffset);this.forceApplier = this.forceApplier.add(force);};TravelerSkeleton.prototype.evade = function(target) {var chaseTime = this._pos.dist(target.position) / this.maxSpeed;var heading = target.position.subtract(target.velocity.multiply(chaseTime));this.easeAwayFrom(heading);};TravelerSkeleton.prototype.avoid = function(these) {var away = true; var i = 0;for (i = 0; i < these.length; i++) {this.avoidee = these[i];var myDirection = this._veloc.clone().normalize();var distanceDifference = this.avoidee.getMiddle().subtract(this._pos);var dotProduct = distanceDifference.dotProduct(myDirection);if (dotProduct > 0) {var lineOfSight = myDirection.multiply(this.avoidDistance);var future = myDirection.multiply(dotProduct);var howFar = future.subtract(distanceDifference).getLength();if (howFar < (this.avoidee.width * 2) + this.avoidSpace && future.getLength() < lineOfSight.getLength()) {var force = myDirection.multiply(this.maxSpeed);force.setAngle(force.getAngle() + ( distanceDifference.sign(this._veloc) * Math.PI / 2 ));force = force.multiply(1 - future.getLength() / lineOfSight.getLength());this.forceApplier = this.forceApplier.add(force,1);this._veloc = this._veloc.multiply(future.getLength() / lineOfSight.getLength(),1);away = false;} else {away = true;}}} return away;};TravelerSkeleton.prototype.seek = function(mp) {var targetVeloc = mp.subtract(this._pos);targetVeloc.normalize();targetVeloc.multiply(this.maxSpeed, 0);var force = targetVeloc.subtract(this._veloc);this.forceApplier = this.forceApplier.add(force);};TravelerSkeleton.prototype.followPath = function(path, loopPath) {var nextMO = path[this._pathIndex];if (!nextMO) return;if (this._pos.dist(nextMO) < this.followDistance) {if (this._pathIndex >= path.length - 1) {this.dispatchEvent(new Event("pathComplete"));if (loopPath) this._pathIndex = 0;} else {this._pathIndex += 1;} return;}this.easeTo(nextMO);};TravelerSkeleton.prototype.simpleFlock = function(withThese) {var avVeloc = this._veloc.clone();var avPos = blankMO; avPos.x = avPos.y = 0;this.flockCount = 0; var bp; var i = -1;while (i < withThese.length - 1) { i++;this.bird = withThese[i];bp = this.bird.position;if (this.bird != this && this.canSeeThis(bp)) {avVeloc.add(this.bird.velocity, 0);avPos.add(bp, 0);if (this.almostCloseTo(bp)) {this.flee(bp);} this.flockCount++;} }if (this.flockCount > 0) {avVeloc.divide(this.flockCount, 0);avPos.divide(this.flockCount, 0);this.seek(avPos);this.forceApplier = this.forceApplier.add(avVeloc.subtract(this._veloc));}};TravelerSkeleton.prototype.circle = function(mp) {var norm = this._pos.subtract(mp,1).normalize();var dest = mp.add( norm.multiply(this.circleDistance), 1 );dest.subtract(this._pos, 0);this.forceApplier = this.forceApplier.add( dest.add(this._veloc), 1 );};TravelerSkeleton.prototype.addEventListener = function(type, listenerString, object ) {this._eventDispatcher.addEventListener(type, listenerString, object);};TravelerSkeleton.prototype.removeEventListener = function(type, listenerString, object ) {return this._eventDispatcher.removeEventListener(type, listenerString, object);};TravelerSkeleton.prototype.dispatchEvent = function(event) {return this._eventDispatcher.dispatchEvent(event);};TravelerSkeleton.prototype.spreadOut = function(fromThese) {for (var i = 0; i < fromThese.length; i++) {var m = fromThese[i];var forward = this._veloc.clone().normalize(); var diff = m._pos.add(m._veloc.clone().normalize().multiply(this.spreadDistance), 1).subtract(this._pos);var dotProd = diff.dotProduct(forward);if(dotProd > 0) {var ray = forward.multiply(this.spreadDistance);var projection = forward.multiply(dotProd);var dist = projection.subtract(diff).getLength(); if(dist < m.width + this.width + this.spreadDistance && projection.getLength() < ray.getLength()) {var force = forward.multiply(this.maxSpeed);force.setAngle( force.getAngle() + ( diff.sign(this._veloc) * Math.PI / 4 ) );force.multiply(1 - projection.getLength() / ray.getLength(), 0);this.forceApplier = this.forceApplier.add(force,1);this._veloc = this._veloc.multiply(projection.getLength() / ray.getLength(),1);}}}};TravelerSkeleton.prototype.flock = function(withThese, separatePriority , alignPriority , cohesionPriority ) {this.separate(withThese, separatePriority || 1);this.align(withThese, alignPriority || 1);this.cohesion(withThese, cohesionPriority || 1);};TravelerSkeleton.prototype.align = function(withThese, priority) {var force = this.getAlignmentForce(withThese);if (priority > 1) force.multiply(priority, 0);this.forceApplier = this.forceApplier.add(force);};TravelerSkeleton.prototype.cohesion = function(withThese, cohesionPriority) {var force = this.getCohesionForce(withThese);if (cohesionPriority > 1) force.multiply(cohesionPriority, 0);this.forceApplier = this.forceApplier.add(force);};tabageos.TravelerSkeleton = TravelerSkeleton;})();this.tabageos = this.tabageos || {};(function() {function RPEase() {};RPEase.easeOptions = {"Linear":true, "InLinear":true, "OutLinear":1, "InOutLinear":1, "InElastic":1,"OutElastic":1, "InOutElastic":1, "InQuad":1, "OutQuad":1, "InOutQuad":1,"InBounce":1, "InOutBounce":1, "OutBounce":1, "InCirc":1, "InBack":1, "OutBack":1, "InOutBack":1,"InQuint":1, "OutQuint":1, "InOutQuint":1, "OutCirc":1, "InOutCirc":1,"In":1, "Out":1, "InOut":1, "InSine":1, "OutSine":1, "InOutSine":1 };RPEase.InBack = function(t, b, c, d, s){return c*(t/=d)*t*((s+1)*t - s) + b;};RPEase.OutBack = function(t, b, c, d, s) {return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;};RPEase.InOutBack = function(t, b, c, d, s) {if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;};RPEase.OutBounce = function(t, b, c, d) {if ((t/=d) < (1/2.75)) {return c*(7.5625*t*t) + b;} else if (t < (2/2.75)) {return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;} else if (t < (2.5/2.75)) {return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;} else {return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;}};RPEase.InBounce = function(t, b, c, d) {return c - RPEase.OutBounce(d-t, 0, c, d) + b;};RPEase.InOutBounce = function(t, b, c, d) {if (t < d/2) return RPEase.InBounce(t*2, 0, c, d) * .5 + b;else return RPEase.OutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;};RPEase.InCirc = function(t, b, c, d) {return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;};RPEase.OutCirc = function(t, b, c, d) {return c * Math.sqrt(1 - (t=t/d-1)*t) + b;};RPEase.InOutCirc = function(t, b, c, d) {if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;};RPEase.In = function(t, b, c, d) {return c*(t/=d)*t*t + b;};RPEase.Out = function(t, b, c, d) {return c*((t=t/d-1)*t*t + 1) + b;};RPEase.InOut = function(t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;};RPEase.InElastic = function(t, b, c, d, a, p) {if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (!a || a < Math.abs(c)) { a=c; var s =p/4; }else s = p/(2*Math.PI) * Math.asin (c/a);return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;};RPEase.OutElastic = function(t, b, c, d, a, p) {if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (!a || a < Math.abs(c)) { a=c; var s = p/4; }else s = p/(2*Math.PI) * Math.asin (c/a);return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);};RPEase.InOutElastic = function(t, b, c, d, a, p) {if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);if (!a || a < Math.abs(c)) { a=c; var s = p/4; }else s = p/(2*Math.PI) * Math.asin (c/a);if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;};RPEase.InExpo = function(t, b, c, d) {return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;};RPEase.OutExpo = function(t, b, c, d) {return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;};RPEase.InOutExpo = function(t, b, c, d) {if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;};RPEase.Linear = function(t, b, c, d) {return c*t/d + b;};RPEase.InLinear = function(t, b, c, d) {return c*t/d + b;};RPEase.OutLinear = function(t, b, c, d) {return c*t/d + b;};RPEase.InOutLinear = function(t, b, c, d) {return c*t/d + b;};RPEase.InQuad = function(t, b, c, d) {return c*(t/=d)*t + b;};RPEase.OutQuad = function(t, b, c, d) {return -c *(t/=d)*(t-2) + b;};RPEase.InOutQuad = function(t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t + b;return -c/2 * ((--t)*(t-2) - 1) + b;};RPEase.InQuart = function(t, b, c, d) {return c*(t/=d)*t*t*t + b;};RPEase.OutQuart = function(t, b, c, d) {return -c * ((t=t/d-1)*t*t*t - 1) + b;};RPEase.InOutQuart = function(t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t + b;return -c/2 * ((t-=2)*t*t*t - 2) + b;};RPEase.InQuint = function(t, b, c, d) {return c*(t/=d)*t*t*t*t + b;};RPEase.OutQuint = function(t, b, c, d) {return c*((t=t/d-1)*t*t*t*t + 1) + b;};RPEase.InOutQuint = function(t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;return c/2*((t-=2)*t*t*t*t + 2) + b;};RPEase.InSine = function(t, b, c, d) {return -c * Math.cos(t/d * (Math.PI/2)) + c + b;};RPEase.OutSine = function(t, b, c, d) {return c * Math.sin(t/d * (Math.PI/2)) + b;};RPEase.InOutSine = function(t, b, c, d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;};tabageos.RPEase = RPEase;})();this.tabageos = this.tabageos || {};(function() {function TweenMath() {};TweenMath.LINEAR = "Linear";TweenMath.IN = "In";TweenMath.OUT = "Out";TweenMath.IN_OUT = "In" + "Out";TweenMath.IN_BOUNCE = "In" + "Bounce";TweenMath.OUT_BOUNCE = "Out" + "Bounce";TweenMath.IN_BACK = "In" + "Back";TweenMath.OUT_BACK = "Out" + "Back";TweenMath.IN_CIRC = "In" + "Circ";TweenMath.OUT_CIRC = "Out" + "Circ";TweenMath.IN_ELASTIC = "In" + "Elastic";TweenMath.OUT_ELASTIC = "Out" + "Elastic";TweenMath.IN_LINEAR = "In" + "Linear";TweenMath.OUT_LINEAR = "Out" + "Linear";TweenMath.IN_SINE = "In" + "Sine";TweenMath.OUT_SINE = "Out" + "Sine";TweenMath.IN_QUAD = "In" + "Quad";TweenMath.OUT_QUAD = "Out" + "Quad";TweenMath.easeOptions = {"Linear":true, "InLinear":true, "OutLinear":1, "InOutLinear":1, "InElastic":1,"OutElastic":1, "InOutElastic":1, "InQuad":1, "OutQuad":1, "InOutQuad":1,"InBounce":1, "InOutBounce":1, "OutBounce":1, "InCirc":1, "InBack":1, "OutBack":1, "InOutBack":1,"InQuint":1, "OutQuint":1, "InOutQuint":1, "OutCirc":1, "InOutCirc":1,"In":1, "Out":1, "InOut":1, "InSine":1, "OutSine":1, "InOutSine":1 };TweenMath._argsers = [0,0];TweenMath.tweenArray = function(start, end, interval, how, loopOptions,theArray) {var v = theArray || []; var si = 0; var realHow = "Linear";if (TweenMath.easeOptions[how]) { realHow = how; } var ending = end - start; si = 0;tabageos.TweenMath._argsers[0] = ((realHow.indexOf("Back") != -1)?1.70158:0);var millisecondRate = ( loopOptions ? loopOptions.millisecondRate || 1000 : 1000 );var frameRate = ( loopOptions ? loopOptions.frameRate || 30 : 30 );var useSeconds = ( loopOptions ? loopOptions.useSeconds || 0 : 0 );var secondIterations = Math.floor( interval );var milliRate = Math.floor(millisecondRate / frameRate);var millisecondIterations = (interval / milliRate) >= 1?Math.floor(interval / milliRate):1;var iterations = (useSeconds > 0?secondIterations:millisecondIterations);for (si = 0; si <= iterations; si++) {v[si] = tabageos.RPEase[realHow](si, start, ending, iterations, tabageos.TweenMath._argsers[0], tabageos.TweenMath._argsers[1]);} return v;};tabageos.TweenMath = TweenMath;})();this.tabageos = this.tabageos || {};(function() {function Event(type, potato) {this.type = type || "event";this.potato = potato || {};};Event.prototype.type = "";Event.prototype.potato = null;Event.prototype.target = null;tabageos.Event = Event;})();this.tabageos = this.tabageos || {};(function() {function EventDispatcher() {this._listeners = {};};EventDispatcher.prototype._listeners = {};EventDispatcher.prototype.addEventListener = function(type, listenerMethod, listenerObject) {if(this._listeners[type]) {this._listeners[type].push({m:listenerMethod, o:listenerObject});} else {this._listeners[type] = [{m:listenerMethod, o:listenerObject}];}};EventDispatcher.prototype.removeEventListener = function(type, listenerMethod, listenerObject) {var i; var a; var result; var listen;if(this._listeners[type]) {i = 0;a = this._listeners[type]; result = false; listen = {m:listenerMethod, o:listenerObject};for(i=0; i < a.length; i++) {if(a[i].m == listen.m && a[i].o == listen.o) {a.splice(i,1); result = true;}}} return result;};EventDispatcher.prototype.dispatchEvent = function(event) {var a;var l;var caller; if(this._listeners[event.type]) { event.target = this;a = this._listeners[event.type];l = a.length;while ( l-- ) { caller = a[l];if(caller.o && typeof caller.o[caller.m] == "function") {caller.o[caller.m](event);} else {throw caller.m + " is not a function on " + caller.o + "";}}}};tabageos.EventDispatcher = EventDispatcher;})();this.tabageos = this.tabageos || {};(function() {function CanvasObject(canvas, width, height) {if(canvas || width >= 0 || height >= 0) {this.init(canvas, width, height);}};CanvasObject.prototype = new tabageos.EventDispatcher();CanvasObject.prototype.init = function(canvas, width, height) {this.width = width || 1;this.height = height || 1;this.canvas = ( canvas == null ? document.createElement("canvas") : canvas );this.canvas.setAttribute("width", this.width);this.canvas.setAttribute("height", this.height);this.context = this.canvas.getContext("2d");if(canvas == null) {this._pixelData = this.context.createImageData(this.width, this.height);} else {this._pixelData = this.context.getImageData(0,0,this.width, this.height);} this.pixelDataArray = this._pixelData.data;};CanvasObject.prototype.width = 0;CanvasObject.prototype.height = 0;CanvasObject.prototype.canvas = null;CanvasObject.prototype.context = null;CanvasObject.prototype._pixelData = null;CanvasObject.prototype.pixelDataArray = null;CanvasObject.prototype._alpha = 1;CanvasObject.prototype.setAlpha = function(value) {this.context.globalAlpha = value;this._alpha = value*100;};CanvasObject.prototype.setStrokeStyle = function(colorString) {this.context.strokeStyle = colorString;};CanvasObject.prototype.setFillStyle = function(colorString) {this.context.fillStyle = colorString;};CanvasObject.prototype.copyPixels = function(source, fromRect, toMoverPoint, tileWidth, tileHeight, commit) {var tw = tileWidth || 32;var th = tileHeight || 32;this.context.drawImage(source, fromRect.x, fromRect.y, fromRect.width, fromRect.height, Math.floor(toMoverPoint.x), Math.floor(toMoverPoint.y),tw,th);if(commit) {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;}};CanvasObject.prototype.drawImage = function(img, toX, toY, commit) {this.context.drawImage(img, toX, toY);if(commit) {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;}};CanvasObject.prototype.drawTriangle = function(trianglePointX, trianglePointY, width, height, color, horizontal, commit) {commit = commit || false;horizontal = horizontal || false;this.context.beginPath();this.context.moveTo(trianglePointX, trianglePointY);if(horizontal == false) {this.context.lineTo(trianglePointX + (width/2), trianglePointY + height);this.context.lineTo(trianglePointX - width, trianglePointY + height);} else {this.context.lineTo(trianglePointX - height, trianglePointY - (width/2));this.context.lineTo(trianglePointX - height, trianglePointY + width);}this.context.closePath();this.context.stroke();if(color) {this.context.fillStyle = color;this.context.fill();}if(commit == true) {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;}};CanvasObject.mathPI = Math.PI;CanvasObject.prototype.drawCircle = function(x, y, radius, color, commit) {this.context.beginPath();this.context.arc(x, y, radius, 0, CanvasObject.mathPI * 2);this.context.closePath();this.context.stroke();if(color) {this.context.fillStyle = color;this.context.fill();}if(commit == true) {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;}};CanvasObject.prototype.writeText = function(text, toX, toY, font, fontSize, color, commit) {this.context.font = font && fontSize ? ""+fontSize+"px"+" "+font+"" : "24px Arial";if(!fontSize && font) {this.context.font = "24px "+font+"";}if(!font && fontSize) {this.context.font = ""+fontSize+"px Arial";}if(color) {this.context.fillStyle = color;this.context.fillText(text || "undefined", toX || 0, toY || 0);} else {this.context.strokeText(text || "undefined", toX || 0, toY || 0);}if(commit == true) {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;}};CanvasObject.prototype.clear = function() {this.context.clearRect(0,0,this.canvas.width, this.canvas.height);this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;};CanvasObject.prototype.drawRect = function(rect, colorString, commit) {if(colorString) {this.context.fillStyle = colorString;this.context.fillRect(rect.x, rect.y, rect.width, rect.height);} else {this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);}if(commit == true) {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;}};CanvasObject.prototype.setPixel = function(x,y, color, pixelCommit, endCommit) {var p = ((Math.round(y) * this._pixelData.width) + Math.round(x)) * 4;var d = this._pixelData.data;d[p+0] = (color & 0xff0000) >> 16;d[p+1] = (color & 0x00ff00) >> 8;d[p+2] = (color & 0x0000ff);if(pixelCommit == true) { this.context.putImageData(this._pixelData, 0, 0, x,y,1,1); }if(endCommit == true) { this.context.putImageData(this._pixelData, 0, 0); };};CanvasObject.prototype.getPixel = function(x,y) {var p =  ((Math.round(y) * this._pixelData.width) + Math.round(x)) * 4;var d = this._pixelData.data;return d[p+0]<<16 | d[p+1]<<8 | d[p+2];};CanvasObject.prototype.update = function() {this._pixelData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);this.pixelDataArray = this._pixelData.data;this.context.putImageData(this._pixelData, 0, 0);};tabageos.CanvasObject = CanvasObject;})();this.tabageos = this.tabageos || {};(function() {function CanvasObjectContainer(divID, width, height, rootCanvasObjectContainer, floorColorString) {if(divID || width || height || rootCanvasObjectContainer) {this.init(divID, width, height, rootCanvasObjectContainer, floorColorString);}};CanvasObjectContainer.prototype = new tabageos.EventDispatcher();CanvasObjectContainer.prototype.init = function(divID, width, height, rootCanvasObjectContainer, floorColorString) {this._w = width || 300;this._h = height || 400;if(divID) { this.div = document.getElementById(divID); }else {this.div = document.createElement("div");this.div.setAttribute("style", "position:absolute");this.div.setAttribute("width", this._w);this.div.setAttribute("height", this._h);if(rootCanvasObjectContainer) rootCanvasObjectContainer.addChild(this);}this.floor = new tabageos.CanvasObject(null, this._w, this._h);if(floorColorString) {this.floor.context.fillStyle = floorColorString;this.floor.context.fillRect(0,0, this._w, this._h);}this.div.appendChild(this.floor.canvas);this.floor.canvas.setAttribute("style", "position:absolute;z-index:-1");};CanvasObjectContainer.prototype._w = null;CanvasObjectContainer.prototype._h = null;CanvasObjectContainer.prototype.div = null;CanvasObjectContainer.prototype.floor = null;CanvasObjectContainer.prototype._floorContext = null;CanvasObjectContainer.prototype._children = [];CanvasObjectContainer.prototype.getWidth = function() {return this._w;};CanvasObjectContainer.prototype.getHeight = function() {return this._h;};CanvasObjectContainer.prototype.getNumChildren = function() {return this._children.length;};CanvasObjectContainer.prototype.addChild = function(child, x, y) {if(this._children.indexOf(child) == -1) {this._children.unshift(child);this.div.appendChild(child.canvas || child.div);this._setUpChild(child, this._children.length-1, x || 0, y || 0);} return child;};CanvasObjectContainer.prototype.addChildAt = function(child, index, x, y) {if(this._children.indexOf(child) == -1) {this._children.splice(index, 0, child);this.div.appendChild(child.canvas || child.div);this._setUpChild(child, index + 1, x || 0, y || 0);} return child;};CanvasObjectContainer.prototype.getChildIndex = function(child) {return this._children.indexOf(child);};CanvasObjectContainer.prototype.setChildIndex = function(child, index, x, y) {if(this.contains(child)) {this.removeChild(child);} this.addChildAt(child, index, x, y);};CanvasObjectContainer.prototype.removeChild = function(child) {if(this._children.indexOf(child) != -1) {this.div.removeChild(child.canvas || child.div);this._children.splice(this._children.indexOf(child), 1);} return child;};CanvasObjectContainer.prototype.getChildAt = function(index) {return this._children[index] || null;};CanvasObjectContainer.prototype.contains = function(child) {return this._children.indexOf(child) != -1;};CanvasObjectContainer.prototype._setUpChild = function(child, indx, x, y) {var ele = child.canvas || child.div;ele.setAttribute("style", "position:"+(child.canvas ? "absolute" : "relative")+";z-index:"+indx+";left:"+x+";top:"+y+"");};tabageos.CanvasObjectContainer = CanvasObjectContainer;})();this.tabageos = this.tabageos || {};(function() {function ScreenOrganizer(game, screenClasses, screenConfigs ) {if(game && screenClasses) { this.init(game, screenClasses, screenConfigs);}};ScreenOrganizer.prototype = new tabageos.EventDispatcher();ScreenOrganizer.prototype.init = function(game, screenClasses, screenConfigs) {var i = 0;this.theGame = game;if (!this.theGame.div && !this.theGame.floor) { throw "game must be a CanvasObjectContainer"; }this.myEvents = new tabageos.EventDispatcher();this.coverTimer = new tabageos.IntervalController(16.6, 0);this.coverShape = new tabageos.CanvasObject(null,this.theGame.getWidth(),this.theGame.getHeight());this.screenChanging = new tabageos.ScreenChangeEvent(0,tabageos.ScreenChangeEvent.SCREEN_CHANGE);this.covered = new tabageos.ScreenChangeEvent(0,tabageos.ScreenChangeEvent.COVER);this.uncovered = new tabageos.ScreenChangeEvent(0,tabageos.ScreenChangeEvent.UNCOVER);this.rectRef = new tabageos.Rectangle(0,0,0,0);this._screens = [];if (screenClasses) {this.gameTitleScreen = ( typeof screenClasses[0] == "function" ? new screenClasses[0]() : screenClasses[0] ); this._screens[0] = this.gameTitleScreen;if (this._screens[0] == null) throw ("The first screen should be the title screen and must be a CanvasObjectContainer.");for (i = 0; i < screenClasses.length; i++) {if (typeof screenClasses[i] == "function") {if (i != 0) this._screens[i] = new screenClasses[i]();} else {if (i != 0) this._screens[i] = screenClasses[i];}if (screenConfigs && screenConfigs.length != 0 && screenConfigs[i] && typeof screenConfigs[i] == "function") {screenConfigs[i]();}}}};ScreenOrganizer.prototype.gameTitleScreen = null; ScreenOrganizer.prototype.currentScreen = null; ScreenOrganizer.prototype.bypassBasicGameObjectKill = null; ScreenOrganizer.prototype.myEvents = null; ScreenOrganizer.prototype._screens = null; ScreenOrganizer.prototype._waitForUnderCoverChanges = null; ScreenOrganizer.prototype.theGame = null; ScreenOrganizer.prototype.screenChanging = null; ScreenOrganizer.prototype.covered = null; ScreenOrganizer.prototype.uncovered = null; ScreenOrganizer.prototype.coverShape = null; ScreenOrganizer.prototype.coverTimer = null; ScreenOrganizer.prototype.transitioning = 0; ScreenOrganizer.prototype.getTransitionStatus = function() {return this.transitioning > 0;};ScreenOrganizer.prototype.getScreens = function() {return this._screens;};ScreenOrganizer.prototype.getGameReference = function() {return this.theGame;};ScreenOrganizer.prototype.getCoverAnimationRate = function() {return this.coverTimer?this.coverTimer.delay:0;};ScreenOrganizer.prototype.setCoverAnimationRate = function(toThis) {if (this.coverTimer) { this.coverTimer.delay = toThis; } };ScreenOrganizer.prototype._cColor = "#000000";ScreenOrganizer.prototype.getCoverColor = function() {return this._cColor; };ScreenOrganizer.prototype.setCoverColor = function(toThis) {this._cColor = toThis;this.coverShape.fillRect(new tabageos.Rectangle(0,0,this.theGame.width, this.theGame.height), toThis);};ScreenOrganizer.prototype.getWaitForUnderCoverChanges = function() {return this._waitForUnderCoverChanges;};ScreenOrganizer.prototype.setWaitForUnderCoverChanges = function(toThis) {this._waitForUnderCoverChanges = toThis;};ScreenOrganizer.prototype.showCoverNoKill = function(e ) {var forward = this.transitionForward();if (forward) {this.coverTimer.stop();this.coverTimer.removeEventListener(tabageos.IntervalEvent.INTERVAL, "showCoverNoKill", this);this.myEvents.dispatchEvent(this.screenChanging); }};ScreenOrganizer.prototype.initializeTransition = function() {this.coverShape.setAlpha(1);this.rectRef.width = 0;this.rectRef.height = 0;};ScreenOrganizer.prototype.addScreenUnderCover = function(e) {this.coverTimer.stop(); this.myEvents.removeEventListener(tabageos.ScreenChangeEvent.SCREEN_CHANGE, "addScreenUnderCover", this);if ( this._waitForUnderCoverChanges == true ) {this.addEventListener(tabageos.ScreenChangeEvent.UNDER_COVER_CHANGES_COMPLETE, "initRemoveCover", this);}if (this._screens[e.screenChangeNumber] && this._screens[e.screenChangeNumber] != this.theGame && this.theGame.contains(this.coverShape)) {this.theGame.removeChild(this.coverShape); this.theGame.addChild(this._screens[e.screenChangeNumber]); this.theGame.addChild(this.coverShape);}this.currentScreen = e.screenChangeNumber; this.covered.screenChangeNumber = e.screenChangeNumber;if ( this._waitForUnderCoverChanges == true ) {this.dispatchEvent(this.covered);} else {this.dispatchEvent(this.covered);this.initRemoveCover();}};ScreenOrganizer.prototype.rectRef = null;ScreenOrganizer.prototype.transitionBackward = function() {this.rectRef.width = this.coverShape.width;this.rectRef.height += 16;this.coverShape.context.clearRect(this.rectRef.x, this.rectRef.y, this.rectRef.width, this.rectRef.height);var b = this.rectRef.height >= this.coverShape.height;if(b) { this.rectRef.width = 0; this.rectRef.height = 0; }return b;};ScreenOrganizer.prototype.transitionForward = function() {this.rectRef.width += this.coverShape.width;this.rectRef.height += 16;this.coverShape.drawRect(this.rectRef, "#000000");var b = this.rectRef.height >= this.coverShape.height;if(b) {  this.rectRef.width = 0; this.rectRef.height = 0; } return b;};ScreenOrganizer.prototype.changeScreen = function(toThis) {if(this.transitioning == 0) {this.coverTimer.stop();this.myEvents.addEventListener(tabageos.ScreenChangeEvent.SCREEN_CHANGE, "addScreenUnderCover", this);if (this.theGame.getNumChildren() == 0 || !this.theGame.contains(this.coverShape)) {if (this.theGame.contains(this.coverShape)) { this.theGame.removeChild(this.coverShape); }this.theGame.addChild(this.coverShape);}this.transitioning = 1;this.initializeTransition();this.coverTimer.addEventListener(tabageos.IntervalEvent.INTERVAL, "showCoverNoKill", this);this.screenChanging.screenChangeNumber = toThis;this.coverTimer.start();}};ScreenOrganizer.prototype.switchScreen = function(toThis) {if (this.transitioning == 0) {this.coverTimer.stop();this.myEvents.addEventListener(tabageos.ScreenChangeEvent.SCREEN_CHANGE, "addScreenUnderCover", this);if (this.theGame.getNumChildren() == 0 || !this.theGame.contains(this.coverShape)) {if (this.theGame.contains(this.coverShape)) { this.theGame.removeChild(this.coverShape); }this.theGame.addChild(this.coverShape);}this.transitioning = 1;this.initializeTransition();this.coverTimer.addEventListener(tabageos.IntervalEvent.INTERVAL, "showCoverAndKill", this);this.screenChanging.screenChangeNumber = toThis;this.coverTimer.start();}};ScreenOrganizer.prototype.initRemoveCover = function(e ) {this.removeEventListener(tabageos.ScreenChangeEvent.UNDER_COVER_CHANGES_COMPLETE, "initRemoveCover", this);this.coverTimer.addEventListener(tabageos.IntervalEvent.INTERVAL, "removeCoverByFadeOut", this);this.myEvents.addEventListener(tabageos.ScreenChangeEvent.SCREEN_CHANGE, "uncoverDone", this);this.coverTimer.start();};ScreenOrganizer.prototype.removeCoverByFadeOut = function(e ) {var back = this.transitionBackward();if (back) {this.coverTimer.stop();if (this.theGame.contains(this.coverShape)) this.theGame.removeChild(this.coverShape);this.coverTimer.removeEventListener(tabageos.IntervalEvent.INTERVAL, "removeCoverByFadeOut", this);this.myEvents.dispatchEvent(this.screenChanging);}};ScreenOrganizer.prototype.showCoverAndKill = function(e ) {var forward = this.transitionForward();if (forward) {this.coverTimer.stop();this.coverTimer.removeEventListener(tabageos.IntervalEvent.INTERVAL, "showCoverAndKill", this);while (this.theGame.getNumChildren() > 0) {this.theGame.removeChild(this.theGame.getChildAt(this.theGame.getNumChildren() - 1));} this.theGame.addChildAt(this.coverShape, 0);this.myEvents.dispatchEvent(this.screenChanging);}};ScreenOrganizer.prototype.uncoverDone = function(e) {this.myEvents.removeEventListener(tabageos.ScreenChangeEvent.SCREEN_CHANGE, "uncoverDone", this);this.uncovered.screenChangeNumber = e.screenChangeNumber;this.transitioning = 0;this.dispatchEvent(this.uncovered);this.dispatchEvent(new tabageos.ScreenChangeEvent(e.screenChangeNumber, tabageos.ScreenChangeEvent.SCREEN_CHANGE));};tabageos.ScreenOrganizer = ScreenOrganizer;})();this.tabageos = this.tabageos || {};(function() {function IrisScreenOrganizer(game, screenClasses, screenConfigs) {this.fullRect = new tabageos.Rectangle();this.init(game,screenClasses, screenConfigs);};IrisScreenOrganizer.prototype = new tabageos.ScreenOrganizer();IrisScreenOrganizer.prototype.fullRect = null;IrisScreenOrganizer.prototype.initializeTransition = function() {this.coverShape.setAlpha(1);this.rectRef.width = this.coverShape.width;this.rectRef.height = this.coverShape.height;this.fullRect.x = 0;this.fullRect.y = 0;this.fullRect.width = this.coverShape.width;this.fullRect.height = this.coverShape.height;this.coverShape.clear();tabageos.TimeKeeper.reset();};IrisScreenOrganizer.prototype.transitionBackward = function() {this.rectRef.height += 16*tabageos.TimeKeeper._sae; var w = this.coverShape.width; var h = this.coverShape.height;this.coverShape.context.fillStyle = "#000000";this.coverShape.context.fillRect(0,0,w,h);this.coverShape.context.save();this.coverShape.context.beginPath();this.coverShape.context.arc(w/2, h/2,this.rectRef.height >= 0 ? this.rectRef.height : 0,0,Math.PI*2);this.coverShape.context.clip();this.coverShape.context.clearRect(0,0,w,h);this.coverShape.context.restore();var b = this.rectRef.height >= this.coverShape.height;if(b) { this.rectRef.width = 0; this.rectRef.height = this.coverShape.height;  }return b;};IrisScreenOrganizer.prototype.transitionForward = function() {this.rectRef.height -= 16*tabageos.TimeKeeper._sae; var w = this.coverShape.width; var h = this.coverShape.height;this.coverShape.context.fillStyle = "#000000";this.coverShape.context.fillRect(0,0,w,h);this.coverShape.context.save();this.coverShape.context.beginPath();this.coverShape.context.arc(w/2, h/2,this.rectRef.height >= 0 ? this.rectRef.height : 0,0,Math.PI*2);this.coverShape.context.clip();this.coverShape.context.clearRect(0,0,w,h);this.coverShape.context.restore();var b = this.rectRef.height <= 0;if(b) {  this.rectRef.width = 0; this.rectRef.height = 0; } return b;};tabageos.IrisScreenOrganizer = IrisScreenOrganizer;})();this.tabageos = this.tabageos || {};(function() {function IntervalController(millisecondDelay, numberOfTimesToRepeat) {this.delay = millisecondDelay;this._repeat = numberOfTimesToRepeat > 0 ? numberOfTimesToRepeat : 0;this.intervalLoopEvent = new tabageos.IntervalEvent();this._st = 0;this._id = null;this.repeatCount = 0;this.started = 0;tabageos.EventDispatcher.call(this);};IntervalController.prototype = new tabageos.EventDispatcher();IntervalController.prototype.delay = 33.3;IntervalController.prototype.repeatCount = 0;IntervalController.prototype._repeat = 0;IntervalController.prototype._id = null;IntervalController.prototype.intervalLoopEvent = null;IntervalController._inst = null;IntervalController.prototype._st = 0;IntervalController.prototype.started = 0;IntervalController.prototype.start = function() {var tref = this; this.started = 1;this._id = window.requestAnimationFrame( function(ts) { tref._intervalLoop(ts, tref); } );};IntervalController.prototype.stop = function() {this.started = 0;this._st = 0;window.cancelAnimationFrame(this._id);};IntervalController.prototype._intervalLoop = function(ts,rf) {if(rf._st == 0) rf._st = ts;var pr = ts - rf._st;if(pr >= rf.delay) {rf.dispatchEvent(rf.intervalLoopEvent);rf._st = 0;}if(rf._repeat > 0) { rf.repeatCount += 1; if(rf.repeatCount >= rf._repeat) {rf.stop(); rf.repeatCount = 0; return;} }if(rf.started == 1) { window.requestAnimationFrame( function(ts) { rf._intervalLoop(ts,rf); } ); }};tabageos.IntervalController = IntervalController;})();this.tabageos = this.tabageos || {};(function() {function ScreenSkeleton(screenOrg, divID, width, height, rootCanvasObjectContainer, floorColorString) {this._screenOrg = screenOrg || null;this.init(divID, width, height, rootCanvasObjectContainer, floorColorString);};ScreenSkeleton.prototype = new tabageos.CanvasObjectContainer();ScreenSkeleton.prototype._buttons = {};ScreenSkeleton.prototype._screenOrg = null;ScreenSkeleton.prototype._index = null;ScreenSkeleton.prototype._currentArea = "";ScreenSkeleton.prototype.establishClickArea = function(name, clickObject, clickHandlerString, left, right, top, bottom, overHandler, outHandler) {this._buttons[name] = [clickObject, clickHandlerString, left, right, top, bottom, overHandler, outHandler];tabageos.MouseController.removeEventListener("mouseUp", "handleClicks", this);tabageos.MouseController.removeEventListener("mouseMove", "mousePositionHandler", this);tabageos.MouseController.addEventListener("mouseUp", "handleClicks", this);tabageos.MouseController.addEventListener("mouseMove", "mousePositionHandler", this);this._index = this._screenOrg._screens.indexOf(this);};ScreenSkeleton.prototype.remove = function(e) {this._screenOrg.removeEventListener(tabageos.ScreenChangeEvent.COVER, "remove", this);if (!e || e.screenChangeNumber != this._index) {this._screenOrg.theGame.removeChild(this); } tabageos.MouseController.removeEventListener("mouseUp", "handleClicks", this);tabageos.MouseController.removeEventListener("mouseMove", "mousePositionHandler", this);};ScreenSkeleton.prototype.handleClicks = function(e) {var a; var s;var cs = this._screenOrg.currentScreen;for (s in this._buttons) {  a = this._buttons[s];if (e.x > a[2] && e.x < a[3] && e.y > a[4] && e.y < a[5] && cs == this._index) {if(a[0] != null && a[0][a[1]]) a[0][a[1]]();}}};ScreenSkeleton.prototype.mousePositionHandler = function(e) {var show;var a; var s;for (s in this._buttons) { a = this._buttons[s];if (e.x > a[2] && e.x < a[3] && e.y > a[4] && e.y < a[5]) {show = true; this._currentArea = s;if (a[6] != null) a[6]();} else {if (a[7] != null && this._currentArea == s) { a[7](); this._currentArea = ""; }if (this._currentArea == s) { this._currentArea = ""; }}} if(show) {this.floor.canvas.setAttribute("style", "position:absolute;z-index:-1;cursor:pointer");} else {this.floor.canvas.setAttribute("style", "position:absolute;z-index:-1;cursor:auto");}};tabageos.ScreenSkeleton = ScreenSkeleton;})();this.tabageos = this.tabageos || {};(function() {function MouseEvent(type, potato) {this.type = type || "mouseEvent";this.potato = potato;};MouseEvent.prototype = new tabageos.Event();MouseEvent.prototype.x = 0;MouseEvent.prototype.y = 0;MouseEvent.MOUSE_UP = "mouseUp";MouseEvent.MOUSE_DOWN = "mouseDown";MouseEvent.MOUSE_EVENT = "mouseEvent";MouseEvent.MOUSE_MOVE = "mouseMove";tabageos.MouseEvent = MouseEvent;})();this.tabageos = this.tabageos || {};(function() {function MouseController() {throw "This is a static class, construction is not needed.";};MouseController.ready = false;MouseController._mX = 0;MouseController._mY = 0;MouseController._oX = 1;MouseController._oY = 1;MouseController._mmp = new tabageos.MoverPoint();MouseController._ed = new tabageos.EventDispatcher();MouseController._muE = new tabageos.MouseEvent(tabageos.MouseEvent.MOUSE_UP);MouseController._mdE = new tabageos.MouseEvent(tabageos.MouseEvent.MOUSE_DOWN);MouseController._mmE = new tabageos.MouseEvent(tabageos.MouseEvent.MOUSE_MOVE);MouseController.mouseX = function() {if(tabageos.MouseController.ready == false || document.onmousemove != tabageos.MouseController.updateMousePosition) {document.onmousemove = tabageos.MouseController.updateMousePosition;tabageos.MouseController.ready = true;tabageos.MouseController._mmp = new tabageos.MoverPoint();} return tabageos.MouseController._mX;};MouseController.mouseY = function() {if(tabageos.MouseController.ready == false || document.onmousemove != tabageos.MouseController.updateMousePosition) {document.onmousemove = tabageos.MouseController.updateMousePosition;tabageos.MouseController.ready = true;tabageos.MouseController._mmp = new tabageos.MoverPoint();} return tabageos.MouseController._mY;};MouseController.mouseMoverPoint = function() {if(tabageos.MouseController.ready == false || document.onmousemove != tabageos.MouseController.updateMousePosition) {document.onmousemove = tabageos.MouseController.updateMousePosition;tabageos.MouseController.ready = true;tabageos.MouseController._mmp = new tabageos.MoverPoint();} return tabageos.MouseController._mmp;};MouseController.updateMousePosition = function(e) {e = tabageos.MouseController._defineMouseEvent(e);tabageos.MouseController._origPX = e.pageX; tabageos.MouseController._origPY = e.pageY;tabageos.MouseController._mX = e.pageX * MouseController._oX;tabageos.MouseController._mY = e.pageY * MouseController._oY;tabageos.MouseController._mmp.y = e.pageY * MouseController._oY;tabageos.MouseController._mmp.x = e.pageX * MouseController._oX;tabageos.MouseController._mmE.x = e.pageX * MouseController._oX;tabageos.MouseController._mmE.y = e.pageY * MouseController._oY;tabageos.MouseController.dispatchEvent(tabageos.MouseController._mmE);};MouseController.mouseUpHandler = function(e) {e = tabageos.MouseController._defineMouseEvent(e);tabageos.MouseController._muE.x = e.pageX * MouseController._oX;tabageos.MouseController._muE.y = e.pageY * MouseController._oY;tabageos.MouseController.dispatchEvent(tabageos.MouseController._muE);};MouseController.mouseDownHandler = function(e) {e = tabageos.MouseController._defineMouseEvent(e);tabageos.MouseController._mdE.x = e.pageX * MouseController._oX;tabageos.MouseController._mdE.y = e.pageY * MouseController._oY;tabageos.MouseController.dispatchEvent(tabageos.MouseController._mdE);};MouseController.addEventListener = function(type, listenerString, listenerObject) {tabageos.MouseController._ed.addEventListener(type, listenerString, listenerObject);if(type == "mouseUp" || type == "MouseUp" || type == "up" || type == "onmouseup" || type == "UP" || type == "Up") {document.onmouseup = tabageos.MouseController.mouseUpHandler;}if(type == "mouseDown" || type == "MouseDown" || type == "down" || type == "onmousedown" || type == "DOWN" || type == "Down") {document.onmousedown = tabageos.MouseController.mouseDownHandler;}if(type == "mouseMove" || type == "MouseMove" || type == "move" || type == "onmousemove" || type == "MOVE" || type == "Move") {document.onmousemove = tabageos.MouseController.updateMousePosition;}};MouseController.removeEventListener = function(type, listenerString, listenerObject) {return tabageos.MouseController._ed.removeEventListener(type, listenerString, listenerObject);};MouseController.dispatchEvent = function(event) {tabageos.MouseController._ed.dispatchEvent(event);};MouseController.defineMousePositionOffset = function(origWidth, origHeight, scaledWidth, scaledHeight) {MouseController._oX = origWidth / scaledWidth;MouseController._oY = origHeight / scaledHeight;};MouseController._defineMouseEvent = function(e) {if (typeof e == 'undefined') e = window.event;return e;};tabageos.MouseController = MouseController;})();var _a = "edcbagfhilkmnopqrstuvwxyz";this.tabageos = this.tabageos||{};(function() {function Traveler(x , y , width , height ) {if(x || y || width > 0 || height > 0) {this.init(x, y, width, height);}};Traveler.prototype = new tabageos.TravelerSkeleton();Traveler.prototype.init = function(x , y , width , height) {this.forceApplier = new tabageos.MoverPoint();this.x = x || 0; this.y = y || 0; this.height = height || 0; this.width = width || 0;this.travelType = this.easeTo;this._pos = new tabageos.MoverPoint(x, y);this._veloc = new tabageos.MoverPoint();this._destination = new tabageos.MoverPoint();this.wanderOffset = new tabageos.MoverPoint(0, 0);this.blankMO = new tabageos.MoverPoint();this.boundingMethod = tabageos.BoundMethods.boundTo;this.mass = 10;this.avoidSpace = 35;this.maxSpeed = 14;this.maxForce = 25;};Traveler.prototype.travelType = null; Traveler.prototype.boundingMethod = null; Traveler.prototype.spreadDistance = 10; Traveler.prototype.circleDistance = 50; Traveler.prototype.separationDistance = 10; Traveler.prototype.bypassAvoidDistance = null; Traveler.prototype.maxForce = 2; Traveler.prototype.forceApplier = null; Traveler.prototype.followDistance = 10; Traveler.prototype.easeProximity = 2; Traveler.prototype.wanderProximity = 10; Traveler.prototype.wanderAngle = 5; Traveler.prototype.wanderRadius = 20; Traveler.prototype.wanderRange = 20; Traveler.prototype.wanderOffset = null; Traveler.prototype.avoidSpace = 20; Traveler.prototype.avoidDistance = 20; Traveler.prototype.visionDistance = 10; Traveler.prototype.personalSpace = 20; Traveler.prototype.mass = 5; Traveler.prototype.maxSpeed = 10; Traveler.prototype._destination = null; Traveler.prototype._wallObject = null; Traveler.prototype.setWallObject = function(toThis) {this._wallObject = toThis;};Traveler.prototype.getDestination = function() {return _destination;};Traveler.prototype.setDestination = function(toThis) {this._destination = toThis;};Traveler.prototype.move = function() {this.forceApplier.truncate(this.maxForce);this.forceApplier.divide(this.mass, 0);this._veloc = this._veloc.add(this.forceApplier.multiply(tabageos.TimeKeeper._sae));this.forceApplier.reset();this._veloc.truncate(this.maxSpeed);this._pos.add(this._veloc.multiply(tabageos.TimeKeeper._sae), 0);if (this._wallObject) this.boundingMethod(this, this._wallObject);this.x = this._pos.x;this.y = this._pos.y;};Traveler.prototype.travel = function() {if (this.travelType != null) this.travelType(this._destination);this.move();};tabageos.Traveler = Traveler;})();this.tabageos = this.tabageos || {};(function() {function ScreenChangeEvent(scn, type, potato) {this.screenChangeNumber = scn || 0;this.type = type || "screenChange";this.potato = potato || {};};ScreenChangeEvent.prototype = new tabageos.Event();ScreenChangeEvent.prototype.screenChangeNumber = 0;ScreenChangeEvent.SCREEN_CHANGE = "screenChange";ScreenChangeEvent.COVER = "cover";ScreenChangeEvent.UNCOVER = "unCover";ScreenChangeEvent.UNDER_COVER_CHANGES_COMPLETE = "underCoverChangesComplete";tabageos.ScreenChangeEvent = ScreenChangeEvent;})();this.tabageos = this.tabageos || {};(function() {function IntervalEvent(type, potato) {this.type = type || "interval";this.potato = potato || {};};IntervalEvent.prototype = new tabageos.Event();IntervalEvent.INTERVAL = "interval";tabageos.IntervalEvent = IntervalEvent;})();this.tabageos = this.tabageos || {};(function() {function WayDeterminer(transparencyColor , canvasObject , arrayOfCanvasObjects ) {WayDeterminer.transColor = transparencyColor;this._bmdRef = canvasObject;this.multipleBitmapDatas = arrayOfCanvasObjects;};WayDeterminer.transColor = 0;WayDeterminer.bitmapData = null;WayDeterminer.prototype._lastBitmapHit = null; WayDeterminer.prototype._bmdRef = null; WayDeterminer.prototype.multipleBitmapDatas = null; WayDeterminer.prototype.wayIsClear = function(x , y ) {var bmd = this._bmdRef ? this._bmdRef : WayDeterminer.bitmapData;if (!bmd) return false;var color = bmd.getPixel(x, y);if(color == WayDeterminer.transColor || color == 0) {return true; } else {return false;}};WayDeterminer.prototype.multipleWaysClear = function(x , y , bitmapDatas ) {var result = false;var bmd;var color;var trans;var a = bitmapDatas || this.multipleBitmapDatas;var i = 0;for (i = 0; i < a.length; i++) {bmd = a[i];color = bmd.getPixel(x, y);result = (color == WayDeterminer.transColor || color == 0);if (!result) break;} return result;};WayDeterminer.prototype.multipleWaysClearAndRegister = function(x , y , bitmapDatas ) {var result = false;var bmd;var color;var trans;var a = bitmapDatas || this.multipleBitmapDatas;for (i = 0; i < a.length; i++) {bmd = a[i];color = bmd.getPixel(x, y);result = color == WayDeterminer.transColor;if (!result) { this._lastBitmapHit = bmd;  break; }} return result;};tabageos.WayDeterminer = WayDeterminer;})();this.tabageos = this.tabageos || {};(function() {function BlittedTraveler(source, canvasObject, fromRect, x , y , width , height ) {if(source || canvasObject) {this.init(source, canvasObject, fromRect, x, y, width, height);} this.health = 100; };BlittedTraveler.prototype = new tabageos.Traveler();BlittedTraveler.prototype.init = function(source, canvasObject, fromRect, x , y , width , height) {this._source = source;this._canvas = canvasObject;this.toPoint = new tabageos.MoverPoint();this.fromRect = fromRect || new tabageos.Rectangle(0,0,32,32);this.forceApplier = new tabageos.MoverPoint();this.x = x || 0; this.y = y || 0; this.height = height || 0; this.width = width || 0;this.travelType = this.easeTo;this._pos = new tabageos.MoverPoint(x, y);this._veloc = new tabageos.MoverPoint();this._destination = new tabageos.MoverPoint();this.wanderOffset = new tabageos.MoverPoint(0, 0);this.blankMO = new tabageos.MoverPoint();this.boundingMethod = tabageos.BoundMethods.boundTo;this.mass = 10;this.avoidSpace = 35;this.maxSpeed = 14;this.maxForce = 25;};BlittedTraveler.prototype.fromRect = null; BlittedTraveler.prototype.fromWidthOffset = 0; BlittedTraveler.prototype.fromHeightOffset = 0;BlittedTraveler.prototype.alphaPoint = null; BlittedTraveler.prototype.fillColor = null; BlittedTraveler.prototype.mergeAlpha = null; BlittedTraveler.prototype.toPoint = null; BlittedTraveler.prototype.blankRect = null; BlittedTraveler.prototype.alphaBitmapData = null; BlittedTraveler.prototype.travelType = null; BlittedTraveler.prototype.boundingMethod = null; BlittedTraveler.prototype.personalSpace = 20; BlittedTraveler.prototype.visionDistance = 20; BlittedTraveler.prototype.circleDistance = 20; BlittedTraveler.prototype.spreadDistance = 20; BlittedTraveler.prototype.separationDistance = 20; BlittedTraveler.prototype.bypassAvoidDistance = null; BlittedTraveler.prototype.maxForce = 20; BlittedTraveler.prototype.forceApplier = null; BlittedTraveler.prototype.followDistance = 20; BlittedTraveler.prototype.easeProximity = 20; BlittedTraveler.prototype.wanderProximity = 20; BlittedTraveler.prototype.wanderAngle = 30; BlittedTraveler.prototype.wanderRadius = 20; BlittedTraveler.prototype.wanderRange = 20; BlittedTraveler.prototype.wanderOffset = null; BlittedTraveler.prototype.avoidDistance = 20; BlittedTraveler.prototype.health = 100; BlittedTraveler.prototype.avoidSpace = 20; BlittedTraveler.prototype.mass = 5; BlittedTraveler.prototype.maxSpeed = 20; BlittedTraveler.prototype._source = null; BlittedTraveler.prototype._canvas = null; BlittedTraveler.prototype._blitType = null; BlittedTraveler.prototype._destination = null; BlittedTraveler.prototype._wallObject = null; BlittedTraveler.prototype.getDestination =  function() {return _destination;};BlittedTraveler.prototype.setDestination = function(toThis) {this._destination = toThis;};BlittedTraveler.prototype.getSource =  function() {return this._source;};BlittedTraveler.prototype.setSource = function(toThis) {this._source = toThis;};BlittedTraveler.prototype.getBlitType =  function() {var s = tabageos.BlittedTraveler.JUST_COPY;if (this._blitType == 1) s = tabageos.BlittedTraveler.FILL_RECT_THEN_COPY;if (this._blitType == 2) s = tabageos.BlittedTraveler.COPY_THEN_COPY;return s;};BlittedTraveler.JUST_COPY = "justCopy";BlittedTraveler.FILL_RECT_THEN_COPY = "fillRectTheCopy";BlittedTraveler.COPY_THEN_COPY = "copyThenCopy";BlittedTraveler.prototype.setBlitType = function(toThis) {if (toThis == tabageos.BlittedTraveler.JUST_COPY) this._blitType = 0;if (toThis == tabageos.BlittedTraveler.FILL_RECT_THEN_COPY) this._blitType = 1;if (toThis == tabageos.BlittedTraveler.COPY_THEN_COPY) {if (!this.blankRect.width || !this.blankRect.height) {throw new Error("blankRect has no width or height, please set blankRect for copy_then_copy style blitting");} this._blitType = 2;}};BlittedTraveler.prototype.getCanvas =  function() {return this._canvas || null;};BlittedTraveler.prototype.setCanvas = function(toThis) {this._canvas = toThis;};BlittedTraveler.prototype.getWallObject =  function() {return this._wallObject;};BlittedTraveler.prototype.setWallObject = function(toThis) {this._wallObject = toThis;};BlittedTraveler.prototype.move = function() {this.forceApplier.truncate(this.maxForce);this.forceApplier.divide(this.mass, 0);this.forceApplier.multiply(tabageos.TimeKeeper._sae, 0);this._veloc = this._veloc.add(this.forceApplier);this.forceApplier.reset();this._veloc.truncate(this.maxSpeed);this._pos.add(this._veloc.multiply(tabageos.TimeKeeper._sae), 0);if (this._wallObject) this.boundingMethod(this, this._wallObject);this.x = this._pos.x;this.y = this._pos.y;};BlittedTraveler.prototype.travel = function() {if (this.travelType != null) this.travelType(this._destination);this.move();this.blitt();};BlittedTraveler.prototype.checkFutureWayIsClear = function(wd) {var futurePosition = this._pos.add(this._veloc.clone().truncate(this.maxSpeed));return wd.wayIsClear(futurePosition.x, futurePosition.y);};BlittedTraveler.prototype.checkCurrentWayIsClear = function(wd) {return wd.wayIsClear(this.x, this.y);};BlittedTraveler.prototype.checkPastWayIsClear = function(wd) {var pastPosition = this._pos.subtract(this._veloc.clone().truncate(this.maxSpeed));return wd.wayIsClear(pastPosition.x, pastPosition.y);};BlittedTraveler.prototype.blitt = function(r , p ) {if (r) this.fromRect = r; if (p) { this.toPoint = p; } else { this.toPoint.x = this.x; this.toPoint.y = this.y; }if (this._blitType == 1) this._canvas.fillRect(this.fromRect, this.fillColor);if (this._blitType == 2) this._canvas.copyPixels(this._source, this.blankRect, this.toPoint);this._canvas.copyPixels(this._source, this.fromRect, this.toPoint, this.width + this.fromWidthOffset, this.height + this.fromHeightOffset);};BlittedTraveler.prototype.basicDepthSort = function(bt, topCanvas, bottomCanvas, sortRadius , offset ) {var sorted = false;if (tabageos.GeometricMath.testForPointInCircle(this.position, sortRadius, bt.position)) {if (this.y > bt.y + offset) {this._canvas = topCanvas;bt._canvas = bottomCanvas;} else {this._canvas = bottomCanvas;bt._canvas = topCanvas;} sorted = true;} return sorted;};tabageos.BlittedTraveler = BlittedTraveler;})();this.tabageos = this.tabageos || {};(function() {function WDTraveler(wayDeterminer , source ,canvasObject ,fromRect, x , y , width , height ) {this.health = 100; this._wayDeterminer = wayDeterminer;this.init(source, canvasObject, fromRect, x , y , width , height);}WDTraveler.prototype = new tabageos.BlittedTraveler();WDTraveler.prototype.vCheckOffset = 0; WDTraveler.prototype.currentAnimation = ""; WDTraveler.prototype.animationSpecs = {}; WDTraveler.prototype.animationIndexOrder = []; WDTraveler.prototype.ani = 0;WDTraveler.prototype.lastAnim = "";WDTraveler.prototype.fromHeightOffset = 0;WDTraveler.prototype.fromWidthOffset = 0;WDTraveler.prototype.fromXOffset = 0;WDTraveler.prototype.fromYOffset = 0;WDTraveler.prototype.hCheckOffsetRight = 0; WDTraveler.prototype.hCheckOffset = 0; WDTraveler.prototype.blitIndex = 0;WDTraveler.prototype.sae = null; WDTraveler.prototype._wic = null; WDTraveler.prototype._wayDeterminer = null; WDTraveler.prototype._moveY = null; WDTraveler.prototype.vCheckOffsetUp = 0; WDTraveler.prototype._moveX = null; WDTraveler.prototype.animate = function() {var anim = (this.currentAnimation != "" && this.animationSpecs[this.currentAnimation] ? this.currentAnimation : "idle");this.blitIndex = this.animationSpecs[anim][0];this.animationIndexOrder = this.animationSpecs[anim][1];if (this.ani == this.animationIndexOrder.length - 1) { this.ani = 0;} else { this.ani += 1; }if (anim != this.lastAnim) { this.ani = 0; this.currentAnimation = anim;} this.lastAnim = anim;this.fromRect.x = this.animationIndexOrder[this.ani] * (this.width+this.fromXOffset);this.fromRect.y = this.blitIndex * (this.height+this.fromYOffset);this.fromRect.width = this.width + this.fromWidthOffset; this.fromRect.height = this.height + this.fromHeightOffset;};WDTraveler.prototype.basicChangeDirectionAnimation = function() {if (this.dY == -1 && (this._veloc.y >= 1 || this._veloc.y <= -1)) this.currentAnimation = "up";if (this.dX == -1 && (this._veloc.x >= 1 || this._veloc.x <= -1)) this.currentAnimation = "left";if (this.dX == 1 && (this._veloc.x >= 1 || this._veloc.x <= -1)) this.currentAnimation = "right";if (this.dY == 1 && (this._veloc.y >= 1 || this._veloc.y <= -1)) this.currentAnimation = "down";};WDTraveler.prototype.getBottomY =  function() {return this.y + this.height;};WDTraveler.prototype.getMiddleY =  function() {return this.y + (this.height / 2);};WDTraveler.prototype.getTopY =  function() {return this.y;};WDTraveler.prototype.getRightX =  function() {return this.x + this.width;};WDTraveler.prototype.getMiddleX =  function() {return this.x + (this.width / 2);};WDTraveler.prototype.getLeftX =  function() {return this.x;};WDTraveler.prototype.move = function() {this.forceApplier.truncate(this.maxForce);this.forceApplier.divide(this.mass, 0);this.forceApplier.multiply(tabageos.TimeKeeper._sae, 0);this._veloc = this._veloc.add(this.forceApplier);this.forceApplier.reset();this._veloc.truncate(this.maxSpeed);var newVeloc = this._veloc.multiply(tabageos.TimeKeeper._sae);var xDirec = this._pos.x + newVeloc.x < this._pos.x ? -1 : 1;var yDirec = this._pos.y + newVeloc.y < this._pos.y ? -1 : 1;var pNewX = this._pos.x + newVeloc.x;var pNewY = this._pos.y + newVeloc.y;this._moveX =  this.landCheckHorizontal(xDirec, pNewX);this._moveY =  this.landCheckVertical(yDirec, pNewY);if (this._moveX) { this._pos.x = pNewX; }if (this._moveY) { this._pos.y = pNewY; } if (this._wallObject) this.boundingMethod(this, this._wallObject);if (this._moveX) this.x = this._pos.x;if (this._moveY) this.y = this._pos.y;};WDTraveler.prototype.landCheckHorizontal = function(leftRight, pNewX) {var result = 0;var toCheck = leftRight == -1 ? this.x - this.hCheckOffset : this.x + this.width + this.hCheckOffsetRight;if (  this._wayDeterminer.wayIsClear(toCheck, this.getMiddleY())  ) {result = 1;} return result;};WDTraveler.prototype.landCheckVertical = function(topBottom, pNewY) {var result = 0;var toCheck = topBottom == -1 ? this.getTopY() - this.vCheckOffsetUp : this.getBottomY() + this.vCheckOffset;if ( this._wayDeterminer.wayIsClear(this.getMiddleX(), toCheck) ) {result = 1;} return result;};tabageos.WDTraveler = WDTraveler;})();this.tabageos = this.tabageos || { };(function() {function PatternActionEvent(tileValue, tileXIndex, tileYIndex, patternIndex, autoCompute, type, x, y) {this.type = type || "patternActionEvent";this.potato = this.potato || {};this.typeToBe = type;this.tileValue = tileValue;this.tileXIndex = tileXIndex;this.tileYIndex = tileYIndex;this.autoCompute = autoCompute;this.patternIndex = patternIndex;this.x = x; this.y = y;if (autoCompute) {this.x = this.tileXIndex * tabageos.BlitMath._specs.blitWidth;this.y = this.tileYIndex * tabageos.BlitMath._specs.blitHeight;}};PatternActionEvent.prototype = new tabageos.Event();PatternActionEvent.PATTERN_ACTION_EVENT = "patternActionEvent";PatternActionEvent.FUNCTION_ASSIGNMENT = "functionAssignment";PatternActionEvent.prototype.tileValue = null;PatternActionEvent.prototype.tileXIndex = 0;PatternActionEvent.prototype.tileYIndex = 0;PatternActionEvent.prototype.patternIndex = 0;PatternActionEvent.prototype.typeToBe = null;PatternActionEvent.prototype.autoCompute = false;PatternActionEvent.prototype.x = 0;PatternActionEvent.prototype.y = 0;PatternActionEvent.prototype.clone = function() {var pae = new PatternActionEvent(this.tileValue, this.tileXIndex, this.tileYIndex, this.patternIndex, this.autoCompute, this.typeToBe, this.x, this.y);pae.hitEvent = this.hitEvent || null; return pae;};tabageos.PatternActionEvent = PatternActionEvent;})();this.tabageos = this.tabageos || {};(function() {function BlitSpecs(blitWidth, blitHeight) {this.blitWidth = blitWidth || 32;this.blitHeight = blitHeight || 32;};BlitSpecs.prototype.blitWidth = 32;BlitSpecs.prototype.blitHeight = 32;BlitSpecs.prototype.blitIndex = 0;tabageos.BlitSpecs = BlitSpecs;})();this.tabageos = this.tabageos || {};(function() {function BlitMath() {}BlitMath.globalImageSource = null; BlitMath.ignoredY = 0; BlitMath.pPointPool = [];BlitMath.ignored = 0; BlitMath.ignoredArrays = []; BlitMath.basicPattern = null; BlitMath.levelPieceFunction = null; BlitMath.ignorSet = []; BlitMath.aLevelPiece = null;BlitMath._specs = new tabageos.BlitSpecs();BlitMath.levelPieceFactory = function() { return BlitMath.aLevelPiece;};BlitMath.getPositionPoint =  function() {if (BlitMath.pPointPool.length <= 0) {while (BlitMath.pPointPool.length < 50) {BlitMath.pPointPool[BlitMath.pPointPool.length] = new tabageos.MoverPoint();}} return BlitMath.pPointPool.pop();};BlitMath.getSpecs =  function() {if (!BlitMath._specs) {BlitMath._specs = new tabageos.BlitSpecs(45, 25);} return BlitMath._specs;};BlitMath.setSpecs = function(toThis) {BlitMath._specs = toThis;};BlitMath.patternBlit = function(subject, source, pattern ) {var ri = 0; var rl = pattern.length;var ci = 0; var cl = pattern[0].length;var bitRect = new tabageos.Rectangle();var blitPoint = new tabageos.MoverPoint();for (ri=0;ri<rl;ri++) {for (ci = 0; ci < cl; ci++) {var rowPatt = pattern[ri]; var tileNum = rowPatt[ci]; var indexY = BlitMath._specs.blitIndex;if (BlitMath.ignorSet.indexOf(tileNum) != -1) { tileNum = BlitMath.ignored; indexY = 0; }var destY = ri * BlitMath._specs.blitHeight; var cx = ci;var destX = cx * BlitMath._specs.blitWidth;var sourceX = tileNum*BlitMath._specs.blitWidth;var sourceY = indexY * BlitMath._specs.blitHeight;bitRect.width = BlithMath._specs.blitWidth; bitRect.height = BlithMath._specs.blitHeight;bitRect.x = sourceX; bitRect.y = sourceY; blitPoint.x = destX; blitPoint.y = destY;subject.copyPixels(source, bitRect, blitPoint);}}};BlitMath.xySwitch = function(subject, xFitst , yFirst ) {var a;var b;var hold0;var hold1;var i = 0;var bi = 0;for (i = 0; i < subject.length; i++) {a = subject[i];bi = 0;for (bi = 0; bi < a.length; bi++) {b = a[bi];hold0 = b.shift();hold1 = b.shift();b[0] = hold1;b[1] = hold0;}}};BlitMath.specificPatternBlit = function(subject, source, pattern, tw, th ) {var ri = 0; var rl = pattern.length;var ci = 0; var cl = pattern[0].length;var bitRect = new tabageos.Rectangle();var blitPoint = new tabageos.MoverPoint();for (ri=0;ri<rl;ri++) {for (ci = 0; ci < cl; ci++) {var rowPatt = pattern[ri]; var tileNum = rowPatt[ci][1]; var yIndex = rowPatt[ci][0];var ia = 0;var a;for (ia = 0; ia < BlitMath.ignoredArrays.length; ia++) {a = BlitMath.ignoredArrays[ia];if (rowPatt[ci][0] == a[0] && rowPatt[ci][1] == a[1]) { tileNum = BlitMath.ignored;  yIndex = BlitMath.ignoredY;  break;}}var destY = ri * BlitMath._specs.blitHeight; var cx = ci;var destX = cx * BlitMath._specs.blitWidth;var sourceX = tileNum*BlitMath._specs.blitWidth;var sourceY = yIndex * BlitMath._specs.blitHeight;bitRect.width = BlitMath._specs.blitWidth; bitRect.height = BlitMath._specs.blitHeight;bitRect.x = sourceX; bitRect.y = sourceY; blitPoint.x = destX; blitPoint.y = destY;subject.copyPixels(source, bitRect, blitPoint, tw || 32, th || 32);}}};BlitMath.patternActionEvent = new tabageos.PatternActionEvent();BlitMath.functionAssignments = [];BlitMath.dispatchFunctionAssignments = function(eventDispatcher, handlerFunctionString, handlerObject, pattern, tileWidth, tileHeight) {if (handlerFunctionString != null) {eventDispatcher.addEventListener(tabageos.PatternActionEvent.FUNCTION_ASSIGNMENT, handlerFunctionString, handlerObject);if (BlitMath.patternActionEvent.type == tabageos.PatternActionEvent.PATTERN_ACTION_EVENT) {BlitMath.patternActionEvent = new tabageos.PatternActionEvent(0, 0, 0, 0, false, tabageos.PatternActionEvent.FUNCTION_ASSIGNMENT, 0, 0);}}var a;var i = 0; var len; var row = 0;var ob;var fa;var fi;var oa;a = pattern;if (!a) return;row = -1; var alen = a.length; var ai = 0;for (ai = 0; ai < alen; ai++) {row++; oa = a[ai];len = oa.length; i = 0;for (i = 0; i < len; i++) {ob = oa[i];fi = 0;for (fi = 0; fi < BlitMath.functionAssignments.length; fi++) {fa = BlitMath.functionAssignments[fi];if (fa[0] == ob[0] && fa[1] == ob[1]) {BlitMath.patternActionEvent.tileValue = ob;BlitMath.patternActionEvent.tileXIndex = i;BlitMath.patternActionEvent.tileYIndex = row;BlitMath.patternActionEvent.x = (i * tileWidth);BlitMath.patternActionEvent.y = (row * tileHeight);BlitMath.patternActionEvent.patternIndex = 0;BlitMath.patternActionEvent.typeToBe = tabageos.PatternActionEvent.FUNCTION_ASSIGNMENT;eventDispatcher.dispatchEvent(BlitMath.patternActionEvent);break;}}}} if(handlerFunctionString != null) { eventDispatcher.removeEventListener(tabageos.PatternActionEvent.FUNCTION_ASSIGNMENT, handlerFunctionString, handlerObject); }};BlitMath.isATileAt = function(x, y, patt, tileWidth, tileHeight) {var i = 0;var j = 0;var tx;var ty;var result = false;var l = patt.length;var jl = patt[0].length;var a;for (i = 0; i < l; i++) { for ( j = 0; j < jl; j++) {tx = j * tileWidth; ty = i * tileHeight;if ( (x >= tx && x < tx + tileWidth) && (y >= ty && y < ty + tileHeight) ) {a = patt[i][j];if(a[0] != 0 || a[1] != 0) {result = true; break;}};}} return result;};BlitMath.tileDataHolder = [];
BlitMath.convertInternalValues = function(arr, tileWidth, tileHeight, yIndex) {
	var a = []; var i = 0;
	for (i; i < arr.length; i++) {
		var mp = new tabageos.MoverPoint(i * tileWidth, yIndex * tileHeight);
		var td = new tabageos.TileData(mp, arr[i]);
		a.push(td);
	} return a;
};
//the value of the tile must not include a 0 ( not [0,1] or [1,0] it must be [1,1] ) for isANonZeroTileAt to return true. BlitMath.isATileAt will return true for any non zero number in the tiles value ( [1,0] [0,1])
BlitMath.isANonZeroTileAt = function(x, y, patt, tileWidth, tileHeight) {var i = 0;var j = 0;var tx;var ty;var result = false;var l = patt.length;var jl = patt[0].length;var a;for (i = 0; i < l; i++) { for ( j = 0; j < jl; j++) {tx = j * tileWidth; ty = i * tileHeight;if ( (x >= tx && x < tx + tileWidth) && (y >= ty && y < ty + tileHeight) ) {a = patt[i][j];if(a[0] != 0 && a[1] != 0) {result = true; break;}};}} return result;};
BlitMath.cloneMultiArray = function(mda) {//true "new"
	var i = 0; var l = mda.length; var ina; var j = 0; var jl; var clone = [];
	for(i; i <l;i++) {
		ina = mda[i]; j= 0;jl = mda[i].length; clone[i] = [];
		for(j;j <jl;j++ ) {  
			clone[i].push( [ ina[j][0] + 1 -1, ina[j][1] + 1 -1 ] );
		}
	} return clone;
};
BlitMath.resetTileDataHolder = function() {
	BlitMath.tileDataHolder = []; 
};
BlitMath.convertToTileDataHolder = function(patt, tileWidth, tileHeight) {
	BlitMath.tileDataHolder = []; var i = 0;
	for (i; i < patt.length; i++) {
		BlitMath.tileDataHolder.push(BlitMath.convertInternalValues(patt[i], tileWidth, tileHeight, patt.indexOf(patt[i])));
	}
};
BlitMath.getTileDataAt = function(x, y, patt, tileWidth, tileHeight) {
	var result;
	if (!BlitMath.tileDataHolder || BlitMath.tileDataHolder.length <= 0) { BlitMath.convertToTileDataHolder(patt, tileWidth, tileHeight);  }
	var i = 0;var j = 0; var tx; var ty;
	var l = patt.length; var jl = patt[0].length;
	for (i = 0; i < l; i++) { 
		for ( j = 0; j < jl; j++) {
			tx = j * tileWidth; ty = i * tileHeight;
			if ( (x >= tx && x < tx + tileWidth) && (y >= ty && y < ty + tileHeight) ) {
				result = BlitMath.tileDataHolder[i][j]; break;
			}
		}
	} return result || null;
};
BlitMath.removeTileData = function(td,map,canvasObject,img,tw,th,clearWidth,clearHeight) { 
	map[td.position.y / tw][td.position.x / th] = [0, 0];
	canvasObject.context.clearRect(0,0,clearWidth,clearHeight);
			
	tabageos.BlitMath._specs.blitWidth = tw; tabageos.BlitMath._specs.blitHeight = th;
	tabageos.BlitMath.specificPatternBlit(canvasObject, img, map,tw,th);
	tabageos.BlitMath.convertToTileDataHolder(map, tw, th);
};
BlitMath.addValueToTileDataPosition = function(td,value, map,canvasObject,img,tw,th,clearWidth,clearHeight,tdh) { 
	map[td.position.y / tw][td.position.x / th] = value;
	canvasObject.context.clearRect(0,0,clearWidth,clearHeight);
			
	tabageos.BlitMath._specs.blitWidth = tw; tabageos.BlitMath._specs.blitHeight = th;
	tabageos.BlitMath.specificPatternBlit(canvasObject, img, map,tw,th);
	if(!tdh) tabageos.BlitMath.convertToTileDataHolder(map, tw, th);
};
BlitMath.addValueToPosition = function(x, y, value, map,canvasObject,img,tw,th,clearWidth,clearHeight,tdh) { 
	map[y / tw][x / th] = value;
	canvasObject.context.clearRect(0,0,clearWidth,clearHeight);
			
	tabageos.BlitMath._specs.blitWidth = tw; tabageos.BlitMath._specs.blitHeight = th;
	tabageos.BlitMath.specificPatternBlit(canvasObject, img, map,tw,th);
	if(!tdh) tabageos.BlitMath.convertToTileDataHolder(map, tw, th);
};
BlitMath.getBasicPatternOf = function(thisTile, patt, tileWidth, tileHeight) {
	var i = 0;var j = 0; var txre; var tyre;
	var l = patt.length; var jl = patt[0].length;
	var result = []; var nmp;
	for (i = 0; i < l; i++) { 
		for ( j = 0; j < jl; j++) {
			txre = j * tileWidth; tyre = i * tileHeight;
			if ( patt[i][j][0] == thisTile[0] && patt[i][j][1] == thisTile[1] ) {
				nmp = new tabageos.MoverPoint(txre, tyre);
				result.push(nmp);
				
			}
		}
	} return result;
};
tabageos.BlitMath = BlitMath;
})();
this.tabageos = this.tabageos||{};
/*
* TravelerWithGravity is gone, use AnimatedBlittedTileMover (tiles and tweens .tweenedMove() set up to smoothly auto collide/interact based on a given tile grid) 
* or BlittedTraveler or WDTraveler (velocity and points{vectors} useful methods such as .easeTo .circle .chase etc...)
* Class order: (of the classes that are minified)
* WDTraveler (which also implements CanvasAnimation uses the WayDeterminer Class for optional collisions) > BlittedTraveler (implements CanvasAnimation) >  Traveler > TravelerSkeleton (is where you can see the vector methods .easeTo and so forth, see the tabageos distribution package)
*/
(function () {
	function CanvasAnimation(source, canvasObject, fromRect, x , y , width , height) {
		if(source || canvasObject) {
			this.init(source, canvasObject, fromRect, x, y, width, height);
		}
	};
	CanvasAnimation.prototype = new Object();
	CanvasAnimation.prototype.init = function(source, canvasObject, fromRect, x , y , width , height) {
		this._source = source;
		this._canvas = canvasObject;
		this.currentAnimation = "";this.ani = 0;
		this.x = x; this.y = y; this.width = width;this.height = height;
		this.toPoint = new tabageos.MoverPoint();
		this.fromRect = fromRect || new tabageos.Rectangle(0,0,32,32);
	};
	CanvasAnimation.prototype._source;//html img
	CanvasAnimation.prototype._canvas;//tabageos.CanvasObject;
	CanvasAnimation.prototype.currentAnimation = "";
	CanvasAnimation.prototype.animationSpecs = {left:[4,[1,2,3,4,5,6,7]]};//arrays of [y,[x,x,x,x,x]]  numbers will be multiplied by height(y) and width(x) during .animate().
	CanvasAnimation.prototype.animationIndexOrder;
	CanvasAnimation.prototype.ani = 0;
	CanvasAnimation.prototype.blitIndex;
	CanvasAnimation.prototype.width = 0;
	CanvasAnimation.prototype.height = 0;
	CanvasAnimation.prototype.x = 0;
	CanvasAnimation.prototype.y = 0;
	CanvasAnimation.prototype.fromRect;
	CanvasAnimation.prototype.fromXOffset = 0;
	CanvasAnimation.prototype.fromYOffset = 0;
	CanvasAnimation.prototype.fromWidthOffset = 0;
	CanvasAnimation.prototype.fromHeightOffset = 0;
	CanvasAnimation.prototype.lastAnim = "";
	CanvasAnimation.prototype.toPoint;
	CanvasAnimation.prototype._cpos;
	CanvasAnimation.prototype._addedPos;
	CanvasAnimation.prototype.getPosition = function(addedX, addedY) {
		if(!this._cpos || !this._addedPos) {
			this._cpos = new tabageos.MoverPoint();
			this._addedPos = new tabageos.MoverPoint();
		} this._cpos.x = this.x; this._cpos.y = this.y;
		if(addedX || addedY) {  this._addedPos.x = this.x + (addedX||0); this._addedPos.y = this.y + (addedY||0) } 
		return ( (addedX || addedY) ? this._addedPos : this._cpos );
	};
	/*
	*  @param left Boolean for if moving left
	*  @param right Boolean for if moving right
	*  @param up Boolean for if moving up
	*  @param down Boolean for if moving down
	*
	*  @param keepAniIndex if true the animation index will not reset; to use this all animations should be the same legnth.
	*
	*   This method will change between; left, right, up ,down, upleft, upright, downleft, downright, leftidle and rightidle
	*    based on the params passed.
	*    
	*   This method is to be used alongside the .animate method.
	*  
	*   See the platformer tutorial stage 3.
	*/
	CanvasAnimation.prototype.changeDirectionAnimation = function(left,right,up,down,keepAniIndex) {
		//a well folded if-else tower, javascript needs all the brackets
		//you don't have to use this method, you can always calculate however you want and just update .currentAnimation before calling .animate
		this.currentAnimation = (up ? "up" : (down ? "down" : "")) + 
			( left ? "left" : (right ? "right" : (((up || down) && this.lastAnim.match("left")) ? "left" : (((up || down) && this.lastAnim.match("right")) ? "right" : ""))) );
		if(this.currentAnimation.length <= 0) this.currentAnimation = this.lastAnim.replace("idle","").replace("down","").replace("up","") + "idle";
		if(keepAniIndex) { this.lastAnim = this.currentAnimation; }
		
	};
	CanvasAnimation.prototype.animate = function(thrott) {
		this.blitIndex = this.animationSpecs[this.currentAnimation][0];
		this.animationIndexOrder = this.animationSpecs[this.currentAnimation][1];
		if (this.ani >= this.animationIndexOrder.length - 1) { this.ani = 0;} else { this.ani += (thrott || 1); }
		if (this.currentAnimation != this.lastAnim) { this.ani = 0; } 
		this.lastAnim = this.currentAnimation;
		this.fromRect.x = this.animationIndexOrder[Math.floor(this.ani)] * (this.width+this.fromXOffset);
		this.fromRect.y = this.blitIndex * (this.height+this.fromYOffset);this.fromRect.width = this.width + this.fromWidthOffset; 
		this.fromRect.height = this.height + this.fromHeightOffset;
	};
	CanvasAnimation.prototype.blitt = function(r, p) {
		if (r) this.fromRect = r; 
		if (p) { this.toPoint = p; } else { this.toPoint.x = this.x; this.toPoint.y = this.y; }
		this._canvas.copyPixels(this._source, this.fromRect, this.toPoint, this.fromRect.width + this.fromWidthOffset, this.fromRect.height + this.fromHeightOffset);
	};
	tabageos.CanvasAnimation = CanvasAnimation;
})();
this.tabageos = this.tabageos||{};
(function () {
	 //see actiontad.com/tabageosHTML5/PlatformerTutorial/stage4.html
	 /**
	 * As is, this is "mario" for any basic tile based platformer game.
	 *
	 */
	function AnimatedBlittedTileMover(source ,canvasObject ,fromRect, x , y , width , height , grid, horizontalTileAmount, verticalTileAmount, jumpLimit, jumpMax, tWidth, tHeight ) {
		this.init(source, canvasObject, fromRect, x , y , width , height);
		this._grid = grid;this.jumpLimit = jumpLimit; this.jumpMax = jumpMax;
		this._hta = horizontalTileAmount;this._pos = new tabageos.MoverPoint();this._xOffset = 0;this._yOffset = 0;
		this._vta = verticalTileAmount;this._tH = tHeight || 16; this._tW = tWidth || 16;this.useGridGround = 1;
		this._cd = 1; this._cu = 1; this._cl = 1; this._cr = 1;this._hTweens = []; this._vTweens = [];
		this._vD = 0;this.currentAnimation = "";this.ani = 0;this._curI = this.y/this._tH; this._curJ = this.x/this._tW;
		this._pos = new tabageos.MoverPoint(); this._PastPos = new tabageos.MoverPoint();
		this.extraPoint = new tabageos.MoverPoint();
	};
		AnimatedBlittedTileMover.prototype = new tabageos.CanvasAnimation();
		AnimatedBlittedTileMover.prototype._grid = null;
		AnimatedBlittedTileMover.prototype._hta = 0;
		AnimatedBlittedTileMover.prototype._vta = 0;
		AnimatedBlittedTileMover.prototype._cd = 1;
		AnimatedBlittedTileMover.prototype._cu = 1;
		AnimatedBlittedTileMover.prototype._cl = 1;
		AnimatedBlittedTileMover.prototype._cr = 1;
		AnimatedBlittedTileMover.prototype._vD = 0;
		AnimatedBlittedTileMover.prototype._curI = 0;
		AnimatedBlittedTileMover.prototype._curJ = 0;
		AnimatedBlittedTileMover.prototype._tW = 16;
		AnimatedBlittedTileMover.prototype._tH = 16;
		AnimatedBlittedTileMover.prototype._yOffset = 0;
		AnimatedBlittedTileMover.prototype._xOffset = 0;
		AnimatedBlittedTileMover.prototype._hTweens = [];
		AnimatedBlittedTileMover.prototype._vTweens = [];
		AnimatedBlittedTileMover.prototype._pos;
		AnimatedBlittedTileMover.prototype._PastPos;
		AnimatedBlittedTileMover.prototype.jumpLimit = 5;
		AnimatedBlittedTileMover.prototype.jumpMax = 5;
		AnimatedBlittedTileMover.prototype._currentPositionMP;
		AnimatedBlittedTileMover.prototype._igSet;
		AnimatedBlittedTileMover.prototype._transSet;
		AnimatedBlittedTileMover.prototype.extraPoint;
		AnimatedBlittedTileMover.prototype.setX = function(toThis) {
			this.x = toThis; this._pos.x = toThis;
		};
		AnimatedBlittedTileMover.prototype.setY = function(toThis) {
			this.y = toThis; this._pos.y = toThis;
		};
		AnimatedBlittedTileMover.prototype.getCurrentPositionMP = function(offsetX,offsetY) {
			if(!this._currentPositionMP) {
				this._currentPositionMP = new tabageos.MoverPoint(this.x,this.y);
			} this._currentPositionMP.x = this.x - (offsetX || 0); this._currentPositionMP.y = this.y  - (offsetY || 0);
			return this._currentPositionMP;
		};
		/**
		*
		* Makes ._grid for you based on tWidth and tHeight (set during construction)
		* Then you need to call .placeObstacles with at least a basic array that has 0 for no tile and 1 for tiles.
		* See .placeObstacles
		*
		*/
		AnimatedBlittedTileMover.prototype.makeGrid = function() {
			var r = [];var i,j; i = 0; j = 0;
			for(i; i < this._vta; i++) { r[i] = [];j = 0;
				for(j;j < this._hta;j++) {
					r[i].push({x:j*this._tW, y:i*this._tH, ix:j, iy:i, ob:0});
				}
			} this._grid = r;
		};
		/**
		* obArray is the map of your level, you can just use the TileSetPainter application to both draw out your levels and get map arrays.
		* ignoredNumbersArray is an array of any values that you want to be ignored and treated as if they were 0, 
		* the ignoredNumbersArray needs to contain the same type of inner values that obArray contains, if you are using the TileSetPainter those inner values will be [y,x] Arrays; [0,0]
		* The method is also set up to receive 2D obArrays that have not been made with the TileSetPainter, you can also pass in a simple 2D array of numbers, and then ignoredNumbersArray would also just contain numbers.
		*
		* For transparent values, when using a TileSetPainter generated obArray, the value in the players grid.ob will be the first number in the inner value (for example if [2,1] then 2) 
		* You can define which number represents a collidable obstacle during move and tweenedMove calls.
		*/
		AnimatedBlittedTileMover.prototype.placeObstacles = function(obArray,ignoredNumbersArray, transparentNumbersArray) {
			var i,j,obp,obr,hr,oi,ig,trans; i = 0; j = 0;
			for(i;i< this._vta; i++) {j = 0;
				for(j;j<this._hta;j++) { 
					obp = obArray[i][j];ig = 0; trans = 0;
					if( ignoredNumbersArray ) {
						if(typeof obp == "object" && typeof obp[0] == "number" ) { oi = 0;
							for(oi;oi<ignoredNumbersArray.length;oi++) {
								if(ignoredNumbersArray[oi][0] == obp[0] && ignoredNumbersArray[oi][1] == obp[1]) {
									obr = 0; ig = 1;break;
								}
							}
						} else {
							if(ignoredNumbersArray.indexOf(obp) >= 0) { obr = 0;ig = 1; }
						}
					}  
					if( transparentNumbersArray && !ig ) {
						if(typeof obp == "object" && typeof obp[0] == "number") { oi = 0;
							for(oi;oi<transparentNumbersArray.length;oi++) {
								if(transparentNumbersArray[oi][0] == obp[0] && transparentNumbersArray[oi][1] == obp[1]) {
									obr = transparentNumbersArray[oi][0] || transparentNumbersArray[oi][1]; trans = 1;
								}
							}
						} else {
							if(transparentNumbersArray.indexOf(obp) >= 0) { obr = obp; trans = 1; }
						}
					} 
					if( ig == 0 && trans == 0 ) { hr = obp[0] || obp[1] || obp.ob || obp;  obr = hr > 0 ? 1 : 0; }  
					this._grid[i][j].ob = obr;
				}
			} this._igSet = ignoredNumbersArray;
			this._transSet = transparentNumbersArray;
		};
		AnimatedBlittedTileMover.prototype.releaseRestraints = function() {
			this._cd = 1;this._cu = 1;this._cl = 1;this._cr = 1;
		};
		AnimatedBlittedTileMover.prototype.useGridGround = 1;
		AnimatedBlittedTileMover.prototype.useGridTop = 1;
		/*
		*
		* Uses a 2D grid of objects representing each tile. 
		* The grid can be defined during construction, or you can call .makeGrid() and then .placeObstacles() 
		* each value in the grid should be an Object that has .x,.y,.ix,.iy and .ob properties. {x:0,y:0,ix:0,iy:0,ob:0}
		* .ob must be a whole number, 0 or more, it represents any object tile, 0 being no object. hitables is the .ob number that represents an object, any whole number other than 0.
		* .makeGrid and then .placeObstacles make the needed grid for you, you can just use the one array that you get with the TileSetPainter
		* for everything; see .makeGrid() .placeObstacles() and the 5th stage in the Platformer tutorial.
		*
		* You can use just this method, but most likely you will use .tweenedMove instead.
		* .tweenedMove controls the calls of move via tween, to slow down and smooth the tile based movement.
		*
		*/
		AnimatedBlittedTileMover.prototype.move = function(left,right,up,down,hitables,dontMove,trans) {
			this._vD = 0;//vertical direction tracker
			this.releaseRestraints();
			var hit = hitables || 1;var plr = trans || 1;
			if (left) { this._curJ -= 1; } else if (right) { this._curJ += 1; }//calculate potential future values:
			if (up) { if(this.jumpLimit == 0) {this._curI += 1; this._vD = 1;} else {this.jumpLimit -= 1;this._curI -= 1; }  } else if (down) { this._curI += 1; }
			if (this.jumpLimit < this.jumpMax && this.jumpLimit > 0 && !up) {this.jumpLimit -= 1;}
			if (this.jumpLimit == 0 && !up) {this._curI += 1; this._vD = 1;}
			//judge those future values, and adjust as needed based on collisions they would cause:
			//collision of bounds around whole area
			if ( this._curJ > (this._hta) - 2 ) { this._curJ = (this._hta) - 2;this._cr = 0; }//right most grid bounds
			if ( this._curI > (this._vta) - 2 && this.useGridGround) { this._curI = (this._vta) - 2; this._cd = 0; }//grid ground
			if ( this._curJ < 1 ) { this._curJ = 1; this._cl = 0; }//left most grid bounds
			if ( this._curI < 1 && this.useGridTop) { this._curI = 1; this._cu = 0; }//top most grid bounds
			var gridCheck = this._grid[this._curI] ? this._grid[this._curI][this._curJ] : 0;
			if(!gridCheck) { return; }
			//collision of obstacles
			if ( gridCheck.ob ==hit && right ) {
				this._curJ = (gridCheck.ix) - 1;this._cr = 0;//obstacle to the right
			}
			if ( gridCheck.ob ==hit && left ) {
				this._curJ = (gridCheck.ix) + 1;this._cl = 0;//obstacle to the left
			}
			if ( gridCheck.ob ==hit && up && this._vD == 0 ) {
				this._curI = gridCheck.iy + 1;this._cu = 0;//obstacle above
			}
			if ( (gridCheck.ob ==hit || gridCheck.ob ==plr) && (down || this._vD == 1) ) {
				this._curI = gridCheck.iy - 1;this._cd = 0;//obstacle beneath
			}
			if( gridCheck.ob ==hit && this.jumpLimit != this.jumpMax && this._vD == 1 ) {
				this._curI = gridCheck.iy -1;this._cd = 0;this._vD = 0;//landed on an obstacle 
			}
			if (this._cd == 0) {this.jumpLimit = this.jumpMax;} //this is also handling the case above; landing on the ground.
			//check the next future y position:
			gridCheck = this._grid[this._curI+1] ? this._grid[this._curI+1][this._curJ] : 0;
			if(gridCheck && gridCheck.ob == 0 && gridCheck.iy <= this._vta - 1 && !up) {
				this._curI += 1;this._vD = 1;//no obstacle beneath and yet not going up; apply "gravity".
			}
			gridCheck = this._grid[this._curI][this._curJ];
			
			this._pos.x = gridCheck.x - this._xOffset;//._xOffset and ._yOffset are optional values for when adjustments may be needed for specific graphical desires.
			this._pos.y = gridCheck.y - this._yOffset;//default is 0.
			if(!dontMove) {//if dontMove, just update the ._pos values; see .tweenedMove
				this.x = this._pos.x;
				this.y = this._pos.y;
			}
		};
		AnimatedBlittedTileMover.prototype.moveBy = function(amountOfTiles,left,right,up,down,hitables,dontMove,trans) {
			
			var i = 0;
			for (i;i<amountOfTiles;i++) {
				this.move(left,right,up,down,hitables,dontMove,trans);
			}
		};
		/*
		* Uses the move function, the grid is still used but movement is also tweened so that it appears slower.
		* Use together with the tabageos.BasicCamera.tweenedBittLayerRender method to create nice smooth movement.
		* 
		*
		*/
		AnimatedBlittedTileMover.prototype.tweenedMove = function(left,right,up,down,hitables,slownes,slownesY,tweenType,trans) {
			if(this._hTweens.length <= 0 || this._vTweens.length <= 0) {
				this._PastPos.x = this.x; this._PastPos.y = this.y;
				
				this.move(left,right,up,down,hitables,1,trans);//move but only update ._pos
				
				tabageos.TweenMath.tweenArray(this.x + (left?-1:(right?1:0)), this._pos.x, slownes, tweenType || "Linear", null, this._hTweens);
				
				tabageos.TweenMath.tweenArray(this.y + (up?-1:(this._vD?1:0)), this._pos.y, slownesY || slownes, tweenType || "Linear", null, this._vTweens);
				
			} else {
				this.x = this._hTweens.shift() || this.x;
				this.y = this._vTweens.shift() || this.y;
			}
		};
		AnimatedBlittedTileMover.prototype.changeTweenedPosition = function(xOffset,yOffset,slownes,slownesY,tweenType) {
			this._pos.x -= xOffset;
			this._pos.y -= yOffset;
			this._hTweens = tabageos.TweenMath.tweenArray(this.x, this._pos.x, slownes, tweenType || "Linear");
			this._hTweens.shift();
			this._vTweens = tabageos.TweenMath.tweenArray(this.y, this._pos.y, slownesY || slownes, tweenType || "Linear");
			this._vTweens.shift();
		};
		AnimatedBlittedTileMover.prototype.resetTweens = function() {
			this._hTweens = [];
			this._vTweens = [];
		};
	tabageos.AnimatedBlittedTileMover = AnimatedBlittedTileMover;
	
})();
this.tabageos = this.tabageos || {};

(function() {
	
	function TileSceneChanger(spriteSheetSource, canvasObject, mainABTM, sceneWidth, sceneHeight) {
		
		this.mainChar = mainABTM;
		this._source = spriteSheetSource;
		this.sW = sceneWidth;
		this.sH = sceneHeight;
		this._display = canvasObject;
		this._cameraPoint = new tabageos.MoverPoint();
	};
	
	TileSceneChanger.prototype = new tabageos.EventDispatcher();
	TileSceneChanger.prototype.sW;
	TileSceneChanger.prototype.sH;
	TileSceneChanger.prototype.mainChar;
	TileSceneChanger.prototype._source;
	TileSceneChanger.prototype._display;
	TileSceneChanger.prototype._cameraPoint;
	TileSceneChanger.prototype.currentMap;
	TileSceneChanger.prototype._mapNumber = 1;
	TileSceneChanger.prototype.currentScene = 1;
	TileSceneChanger.prototype._map1;
	TileSceneChanger.prototype._map2;
	TileSceneChanger.prototype._totalScenes = [0];
	TileSceneChanger.prototype._direcs = {"left":0,"right":1,"down":2,"up":3};
	
	/*
	* These methods use BlitMath.cloneMultiArray to clone the array you pass to them.
	* The array passed remains a separate array,
	* the method does not create a reference to the array passed in.
	*  Thereby ._map1 and ._map2 are unique until defineMap1/2 is called again
	* ._map1 and ._map2 should never be set directly.
	*/
	TileSceneChanger.prototype.defineMap1 = function(map2DArray) {
		this._map1 = tabageos.BlitMath.cloneMultiArray(map2DArray);
	};
	TileSceneChanger.prototype.defineMap2 = function(map2DArray) {
		this._map2 = tabageos.BlitMath.cloneMultiArray(map2DArray);
	};
	/*
	* These methods populate the ._totalScenes array with clones of the arrays you pass in.
	* the ._totalScenes array should not be handled directly.
	* Use referenceScene() if you need to reference scenes you add, 
	*  the reference index will be in the order you place them starting from 1.
	*/
	TileSceneChanger.prototype.addScene = function(map2DArray) {
		this._totalScenes.push( tabageos.BlitMath.cloneMultiArray(map2DArray) );
	};
	TileSceneChanger.prototype.add5Scenes = function(map2DArray,map2DArray2,map2DArray3,map2DArray4,map2DArray5) {
		this._totalScenes.push( tabageos.BlitMath.cloneMultiArray(map2DArray) );
		this._totalScenes.push( tabageos.BlitMath.cloneMultiArray(map2DArray2) );
		this._totalScenes.push( tabageos.BlitMath.cloneMultiArray(map2DArray3) );
		this._totalScenes.push( tabageos.BlitMath.cloneMultiArray(map2DArray4) );
		this._totalScenes.push( tabageos.BlitMath.cloneMultiArray(map2DArray5) );
	};
	TileSceneChanger.prototype.referenceScene = function(referenceIndex) {
		return this._totalScenes[referenceIndex] || null;
	};
	TileSceneChanger.prototype.changeCurrentMap = function(mapInteger) {
		if(mapInteger == 1 && this._map1) { 
			this.currentMap = this._map1; this._mapNumber = 1;
		} else { this.currentMap = this._map2 || this._totalScenes[mapInteger]; this._mapNumber = mapInteger; }
	};
	/*
	*
	* This method changes which map is being used and then blits it onto the canvasObject passsed during construction of the Class.
	* It also relocates the mainABTM and calls its .placeObstacles method with the changed map.
	* And it will reset the camera as needed.
	*
	* @param mapInteger the map to change to 1 or 2
	* @param direction the direction the player is going; "left" "right" "down" "up" or 0 1 2 3
	* @param playerIgnored the players ._igSet if a ignoredNumbersArray was passed during player.placeObstacles
	*                        this method will also invoke the players .placeObstacles call.
	* @param playerTrans the players ._transSet if transparentNumbersArray was passed during player.placeObstacles
	*     you can also pass Arrays themselves for the above two params, see AnimatedBlittedTileMover.placeObstacles
	*      but normally .placeObstacles would have been already called and therefore player._igSet and player._transSet already set.
	* @param camera a reference to the BasicCamera that is being used
	* @param faMethod a String of the method name to call during BlitMath.dispatchFunctionAssignments.
	* @param faMethodObject the Object that contains the faMethod, normally the .game static Object for example from stage nine of the platformer tutorial.
	*
	*/
	TileSceneChanger.prototype.changeScene = function(mapInteger, direction, playerIgnored, playerTrans, camera, faMethod, faMethodObject) {
		
		var direc = (typeof direction == "number" ? direction : (this._direcs[direction] || 1));
			
		if(mapInteger == 0) { //change by horizontal scenes
			if(direc == 0) { //left
				this.currentScene -= 1;
				if(this._totalScenes[this.currentScene]) {
					this.currentMap = this._totalScenes[this.currentScene];
				} else {
					this.currentScene = this._totalScenes.length-1;
					this.currentMap = this._totalScenes[this.currentScene] || this._map2;
				}
			}
			if(direc == 1) { //right
				this.currentScene += 1;
				if(this._totalScenes[this.currentScene]) {
					this.currentMap = this._totalScenes[this.currentScene];
				} else {
					this.currentScene = 1;
					this.currentMap = this._totalScenes[this.currentScene] || this._map1;
				}
			}
		}
		
		if(mapInteger == 1 || mapInteger == 2) { //change between just the two ._maps 
			this.changeCurrentMap(mapInteger);
		}
			
		this.mainChar.placeObstacles(this.currentMap, playerIgnored, playerTrans);
		
		//adjust position and tile indexes of char and reset the camera based on which side of the screen the char is on; direction
		//also reset the chars tweens
		if(direc < 2) { this.mainChar.setX(direc >= 1 ? (this.mainChar.width*2) : this.sW - (this.mainChar.width*2)); } this.mainChar.setY(direc == 2 ? this.mainChar.height : (direc == 3 ? this.sH - this.mainChar.height : this.mainChar.y));
		if(direc < 2) { this.mainChar._curJ = (direc >= 1 ? 3 : (this.sW/this.mainChar.width)-2);  } else { this.mainChar._curI = direc == 3 ? (this.sH/this.mainChar.height) - 2 : 2; } this.mainChar.resetTweens();
		if(direc >= 1 && direc < 2 && camera) { camera.reset(0,0); } else { if(direc < 2 && camera) camera.reset(this.sW - camera.v.width - this.mainChar.width,0); }
			
		this._display.context.clearRect(0,0,this.sW,this.sH);//clear the whole scene
		
		if(faMethod) { //if there is a faMethod call dispatchFunctionAssignments with it, .functionAssignments should already be set
			tabageos.BlitMath.dispatchFunctionAssignments(this, faMethod, faMethodObject, this.currentMap, this.mainChar.width,this.mainChar.height);
		}
		//redraw the whole scene
		tabageos.BlitMath.specificPatternBlit( this._display, this._source, this.currentMap, this.mainChar.width, this.mainChar.height );
		this._cameraPoint.x = direc >= 1 ? 0 : this.sW - camera.v.width - this.mainChar.width;
		this._cameraPoint.y = this.mainChar.y;
		//finalize the reset of the camera around the mainChar;
		if(camera) camera.tweenedBlitLayerRender(this._cameraPoint, 0,0, 1);
		
	};
	
	tabageos.TileSceneChanger = TileSceneChanger;
	
})();
this.tabageos = this.tabageos||{};

(function() {

	function RotatingTraveler(source, canvas, wd, fromRect, x, y, width, height, rotationImage, rotationFromRect) {
		
		this.init(source, canvas, fromRect, x, y, width, height);
		this._cWD = wd; this._wayDeterminer = wd;
		this.rImageHolder = rotationImage;
		this.rFromRect = rotationFromRect;
		this.roExA = 0;//rotation extended area 
		if(rotationImage) {
			this.rToPoint = new tabageos.MoverPoint(-((this.rImageHolder.width-this.roExA)/2),-((this.rImageHolder.height-this.roExA)/2));
			this._brFromRct = new tabageos.Rectangle(0,0,this.rFromRect.width, this.rFromRect.height);
		}
	};
	RotatingTraveler.prototype = new tabageos.WDTraveler();
	RotatingTraveler.prototype.nr;//rotation
	RotatingTraveler.prototype.getRotation = function() {
		return this.nr;
	};
	RotatingTraveler.prototype.setRotation = function(toThis) {
		this.nr = toThis;
		var rhw = (this.rImageHolder.width-this.roExA)/2;
		var rhh = (this.rImageHolder.height-this.roExA)/2;
		this.rImageHolder.context.clearRect(0,0,this.rImageHolder.width,this.rImageHolder.height);
		this.rImageHolder.context.save();
		this.rImageHolder.context.translate(rhw, rhh);
		this.rImageHolder.context.rotate(  ( (Math.PI) * 2 *(this.nr / 360))  );
		this.rImageHolder.copyPixels(this._source, this.rFromRect, this.rToPoint, this.rFromRect.width, this.rFromRect.height);
		this.rImageHolder.context.restore();
	};
	RotatingTraveler.prototype.roExA = 0;
	/**
	* The CanvasObject that holds the image to rotate.
	* @type tabageos.CanvasObject
	*/
	RotatingTraveler.prototype.rImageHolder;//CanvasObject
	RotatingTraveler.prototype.rFromRect;
	RotatingTraveler.prototype._brFromRct;
	RotatingTraveler.prototype.rToPoint;
	RotatingTraveler.prototype._aro = 0;
	RotatingTraveler.prototype._defaultAro = 0;
	RotatingTraveler.prototype.alwaysDisplayRotationOnly = function() {
		this._defaultAro = (this._defaultAro == 0 ? 1 : 0);
		this._aro = 1;
	};
	RotatingTraveler.prototype.rotateWithMoverPoint = function(mp, addedY, addedX, offsetPoint) {
		this.nr = Math.atan2((mp.y + (addedY||0)) - this.y, (mp.x + (addedX||0)) - this.x) * 180 / Math.PI;
		var rhw = (this.rImageHolder.width-this.roExA)/2;
		var rhh = (this.rImageHolder.height-this.roExA)/2;
		this.rImageHolder.context.clearRect(0,0,this.rImageHolder.width,this.rImageHolder.height);
		this.rImageHolder.context.save();
		this.rImageHolder.context.translate(rhw, rhh);
		this.rImageHolder.context.rotate(  ( (Math.PI) * 2 *(this.nr / 360))  );
		this.rImageHolder.copyPixels(this._source, this.rFromRect, this.rToPoint, this.rFromRect.width, this.rFromRect.height);
		this.rImageHolder.context.restore();
	};
	RotatingTraveler.prototype.animateRotationOnly = function() {
		
		this.animate();
		this.rFromRect.width = this.fromRect.width;// + this.fromWidthOffset;
		this.rFromRect.height = this.fromRect.height;// + this.fromHeightOffset;
		this.rFromRect.x = this.fromRect.x; this.rFromRect.y = this.fromRect.y;
		this._aro = 1;
		
	};
	RotatingTraveler.prototype.blitt = function(r, p) {
		if (r) this.fromRect = r; 
		if (p) { this.toPoint = p; } else { this.toPoint.x = this.x; this.toPoint.y = this.y; }
		if(this._aro == 0) {
			this._canvas.copyPixels(this._source, this.fromRect, this.toPoint, this.fromRect.width + this.fromWidthOffset, this.fromRect.height + this.fromHeightOffset);
		} else { this._aro = this._defaultAro; }
		this._canvas.copyPixels(this.rImageHolder.canvas, this._brFromRct, this.toPoint, this.rFromRect.width, this.rFromRect.height);
	};
	
tabageos.RotatingTraveler = RotatingTraveler;
})();
this.tabageos = this.tabageos||{};
(function() {

	//can be complecated to set-up, please see the SubsistZombie Ultra Ammo tutorial.
	//Note this is javascript, as of 2016/17 only the best phones will be able to handle more than 12 or so RotatingWhatevers. 
	//if at all possible use only 10, note, SubsistZombie Ultra Ammo cleverly only uses 10.
	//Note also that if you use the RotationPad (RotationPad.js) optionalPadImage, the circle becomes a RotatingTraveler with your image.
	//Because the RotationPad normally needs to be large, especially when using an image with it, it will tax the phone heavily when rotating,
	//therefore racing games that would use an actual steering wheel for the pad do not work well on lower end phones. ( i tried it xD )
	//all that to say, use these with caution, on a desktop/laptop browser you will not notice any performance issues.
	function RotatingShooter(source, canvas, bulletCanvas, wd, fromRect, x, y, width, height, rotationImage, rotationFromRect, bulletFromRect) {
		
		this.init(source, canvas, fromRect, x, y, width, height);
		this._cWD = wd; this._wayDeterminer = wd;
		this.rImageHolder = rotationImage;
		this.rFromRect = rotationFromRect;
		this.roExA = 0;
		this.rToPoint = new tabageos.MoverPoint(-((this.rImageHolder.width-this.roExA)/2),-((this.rImageHolder.height-this.roExA)/2));
		this._brFromRct = new tabageos.Rectangle(0,0,this.rFromRect.width, this.rFromRect.height);
		this.bulletHolder = [];
		this._bulletCanvas = bulletCanvas;
		this.bulletFromRect = bulletFromRect;
		this.bulletSpeed = 14;
	};
	RotatingShooter.prototype = new tabageos.RotatingTraveler();
	RotatingShooter.prototype.bulletHolder = [];
	RotatingShooter.prototype.bulletFromRect;
	RotatingShooter.prototype._bulletCanvas;
	RotatingShooter.prototype.bulletSpeed = 14;
	RotatingShooter.prototype.reload = function(amount) {
		while(this.bulletHolder.length < amount) {
			var b = new tabageos.BlittedTraveler(this._source, this._bulletCanvas, this.bulletFromRect, 0,0,this.bulletFromRect.width, this.bulletFromRect.height);
			this.bulletHolder.push(b);
		}
	};
	RotatingShooter.prototype.shoot = function() {
		if(this.bulletHolder.length <= 0) { this.reload(100); }
		var b = this.bulletHolder.pop();
		b.setX(this.x+this.width/2); b.setY(this.y+this.height/2);
		b._veloc.x = Math.cos(Math.PI * (this.nr / 180)) * this.bulletSpeed;
		b._veloc.y = Math.sin(Math.PI * (this.nr / 180)) * this.bulletSpeed;
		return b;
	};
	
tabageos.RotatingShooter = RotatingShooter;
})();
this.tabageos = this.tabageos||{};
(function() {
	/*
	*
	*
	*/
	function SceneryObject(source ,canvasObject ,fromRect, x , y , width , height , grid, horizontalTileAmount, verticalTileAmount, jumpLimit, jumpMax, tWidth, tHeight) {
		this.init(source, canvasObject, fromRect, x, y, width, height);
			this._grid = grid;this.jumpLimit = jumpLimit; this.jumpMax = jumpMax;
			this._hta = horizontalTileAmount;this._pos = new tabageos.MoverPoint();this._xOffset = 0;this._yOffset = 0;
			this._vta = verticalTileAmount;this._tH = tHeight || 16; this._tW = tWidth || 16;
			this._cd = 1; this._cu = 1; this._cl = 1; this._cr = 1;this._hTweens = []; this._vTweens = [];
			this._vD = 0;this.currentAnimation = "";this.ani = 0;this._curI = this.y/this._tH; this._curJ = this.x/this._tW;
		this.playerHoldingThis = null;this.tileValue = null;
		this.weight = (fromRect.x/24) + 1;
		this.xDirection = 1;
	};
	SceneryObject.prototype = new tabageos.AnimatedBlittedTileMover();
	SceneryObject.prototype.playerHoldingThis;//SceneryThrower
	SceneryObject.prototype.weight = 1;
	SceneryObject.prototype.xDirection = 1;
	SceneryObject.prototype.tileValue = null;

tabageos.SceneryObject = SceneryObject;
})();

this.tabageos = this.tabageos||{};
//no more BasicEnemy
this.tabageos = this.tabageos||{};
(function() {
	/*
	* main char in SubsistGiants is a SceneryThrower.
	*
	*/
	function SceneryThrower(source ,canvasObject ,fromRect, x , y , width , height , grid, horizontalTileAmount, verticalTileAmount, jumpLimit, jumpMax, tWidth, tHeight) {
		
		this.init(source, canvasObject, fromRect, x, y, width, height);
			this._grid = grid;this.jumpLimit = jumpLimit; this.jumpMax = jumpMax;
			this._hta = horizontalTileAmount;this._pos = new tabageos.MoverPoint();this._xOffset = 0;this._yOffset = 0;
			this._vta = verticalTileAmount;this._tH = tHeight || 16; this._tW = tWidth || 16;
			this._cd = 1; this._cu = 1; this._cl = 1; this._cr = 1;this._hTweens = []; this._vTweens = [];
			this._vD = 0;this.currentAnimation = "";this.ani = 0;this._curI = this.y/this._tH; this._curJ = this.x/this._tW;
			this.maxSpeed = 15;this._outAltered = new tabageos.MoverPoint();
			this.travelType = null;this.holdingRect = new tabageos.Rectangle(0,0,width,height);
			this.holdingOffsetX = 1; this.holdingOffsetY = 3;
	};
			
		SceneryThrower.prototype = new tabageos.AnimatedBlittedTileMover();
		SceneryThrower.prototype.throwStrength = 10;
		SceneryThrower.prototype.health = 100;
		SceneryThrower.prototype.holding;
		SceneryThrower.prototype.holdingRect;
		SceneryThrower.prototype._outAltered;
		SceneryThrower.prototype.holdingOffsetX = 1;
		SceneryThrower.prototype.holdingOffsetY = 3;
		SceneryThrower.prototype.nameOfThrower = "strawHat";
		
		/*
		*
		*   options for this kind of thing are .getPosition(from CanvasAnimation) 
		*    .getCurrentPositionMP(from ABTM)  and this method from this Class(SceneryThrower)
		*   each is using its own separate stored MoverPoint and not changing any actual position,
		*   this method is using ._outAltered of this Class.
		*   this method is subtracting when you pass altered amounts. 
		*/
		SceneryThrower.prototype.alteredPosition = function(xAlterAmount, yAlterAmount) {
			xAlterAmount = xAlterAmount || 0;
			yAlterAmount = yAlterAmount || 0;
			this._outAltered.x = this.x - xAlterAmount;
			this._outAltered.y = this.y - yAlterAmount;
			return this._outAltered;
		};
		SceneryThrower.prototype.holdingImageRect = function() {
			return this.holdingRect;
		};
		SceneryThrower.prototype.pickUp = function(td, imageWidthAdjust, imageHeightAdjust) {
			if (!this.holding) {
				this.holding = td;
				this.holdingRect.x = this.holding.value[1] * (this.width);
				this.holdingRect.y = this.holding.value[0] * (this.height);
				this.holdingRect.width = this.width; this.holdingRect.height = this.height;
				if( imageWidthAdjust ) {
					this.holdingRect.width += imageWidthAdjust;
				}
				if( imageHeightAdjust ) {
					this.holdingRect.height += imageHeightAdjust;
				}
				return true;
			} return false;
		};
		SceneryThrower.prototype._throwHolding = function() {
			var result = this.holding.clone();
			this.holding = null;
			return result;
		};
		SceneryThrower.prototype.throwSceneryObject = function() {
			var nr,scenery;
			if(this.holding) { 
				nr = new tabageos.Rectangle(this.holdingRect.x, this.holdingRect.y, this.holdingRect.width,this.holdingRect.height);
				scenery = new tabageos.SceneryObject(this._source, this._canvas, nr, this._curJ*this._tW , this._curI*this._tH, this.width,this.height, this._grid, this._hta, this._vta,-1,5,this._tW, this._tH);
				scenery.playerHoldingThis = this;scenery.tileValue = this.holding.value;
				
				this._throwHolding();
				return scenery;
			} return null;
		};
		SceneryThrower.prototype.blitt = function(r, p) {
			if (r) this.fromRect = r; 
			if (p) { this.toPoint = p; } else { this.toPoint.x = this.x; this.toPoint.y = this.y; }
		
			this._canvas.copyPixels(this._source, this.fromRect, this.toPoint, this.fromRect.width + this.fromWidthOffset, this.fromRect.height + this.fromHeightOffset);
			if (this.holding) {//use holdingOffsetX and Y to adjust the holding position when the player is holding something.
				this._canvas.copyPixels(this._source, this.holdingRect, this.getCurrentPositionMP().subtractBy( this.holdingOffsetX, this.holdingOffsetY, 1), this.holdingRect.width, this.holdingRect.height);
			}
		};
		
tabageos.SceneryThrower = SceneryThrower;
})();
this.tabageos = this.tabageos||{};
(function() {
	
		function TileData(p, value) {
			this.position = p || new tabageos.MoverPoint();
			this.value = value;
		};
		
		TileData.prototype = new Object();
		TileData.prototype.position;
		TileData.prototype.value;
		TileData._pool = [];
		TileData.make = function(x,y,value) {
			if(tabageos.TileData._pool.length <= 0) { var i = 0; 
				for(i;i<50;i++) { tabageos.TileData._pool.push(new tabageos.TileData(new tabageos.MoverPoint(),null)); }
			}
			var td = tabageos.TileData._pool.pop();
			td.position.x = x;td.position.y = y; td.value = value;
			return td;
		};
		TileData.prototype.clone = function() {
			return new tabageos.TileData(this.position, this.value);
		};
	
tabageos.TileData = TileData;
})();
this.tabageos = this.tabageos||{};
(function() {
	function BasicCamera(renderLayer, blitLayer1, blitLayer2, blitLayer3, blitLayer4, blitLayer5) {
			this.layerToRender = renderLayer;
			this.b1 = blitLayer1;
			this.b2 = blitLayer2;
			this.b3 = blitLayer3;
			this.b4 = blitLayer4;
			this.b5 = blitLayer5;
			this.tweens1 = [];
			this.tweens2 = [];
			this.p = new tabageos.MoverPoint();
			this.v = new tabageos.Rectangle(0,0);
			if(this.layerToRender) { this.v = new tabageos.Rectangle(0, 0, this.layerToRender.width, this.layerToRender.height); }
	};
		BasicCamera.prototype.layerToRender;
		BasicCamera.prototype.b1;
		BasicCamera.prototype.b2;
		BasicCamera.prototype.b3;
		BasicCamera.prototype.b4;
		BasicCamera.prototype.b5;
		BasicCamera.prototype.lastVXr = 0;
		BasicCamera.prototype.p;
		BasicCamera.prototype.trsh = 0;
		BasicCamera.prototype.v;
		BasicCamera.prototype.tweens1 = [];
		BasicCamera.prototype.tweens2 = [];
		BasicCamera.prototype.lastvx = 0;
		BasicCamera.prototype.lastvy = 0;
		BasicCamera.prototype.p1Tweens1 = [];
		BasicCamera.prototype.p1Tweens2 = [];
		BasicCamera.prototype.p2Tweens1 = [];
		BasicCamera.prototype.p2Tweens2 = [];
		BasicCamera.prototype._pLayer1;
		BasicCamera.prototype._pLayer2;
		BasicCamera.prototype._pV1;
		BasicCamera.prototype._pV2;
		BasicCamera.prototype.pTweenType1 = "Linear";
		BasicCamera.prototype.pTweenTime1 = 0;
		BasicCamera.prototype.pTweenType2 = "Linear";
		BasicCamera.prototype.pTweenTime2 = 0;
		BasicCamera.prototype.pLastVs = {p1x:0,p1y:0,p2x:0,p2y:0};
		/*
		* Can be used with the .tweenedBlitLayerRender method to produce parallax effects.
		*
		* Only two layers can be added.
		* Layers will parallax based on .pTweenTime1 (or .pTweenTime2 for if you use 2 layers) or, a default of whatever you pass for tweentime in .tweenedBittLayerRender  multiplied by 2.
		*
		*  By default you just add a layer and it will move slower than the layers on top of it
		*  If you want to do more complex stuff, you would alter the .pTweenType1 and .pTweenTime1 
		*/
		BasicCamera.prototype.addParallaxLayer = function(canvasObject) {
			if(!this._pLayer1) {
				this._pLayer1 = canvasObject;
				this._pV1 = new tabageos.Rectangle(0,0,this._pLayer1.width,this._pLayer1.height);
			} else if(!this._pLayer2) {
				this._pLayer2 = canvasObject;
				this._pV2 = new tabageos.Rectangle(0,0,this._pLayer2.width,this._pLayer2.height);
			}
		};
		BasicCamera.prototype.blitLayerRenderView = function() {
			return this.v;
		};
		BasicCamera.prototype.renderP1 = function() {
			if(this._pLayer1) { this.layerToRender.copyPixels(this._pLayer1.canvas, this._pV1, this.p, this._pV1.width, this._pV1.height); }
		};
		BasicCamera.prototype.renderP2 = function() {
			if(this._pLayer2) { this.layerToRender.copyPixels(this._pLayer2.canvas, this._pV2, this.p, this._pV2.width, this._pV2.height); }
		};
		BasicCamera.prototype.renderB1 = function() {
			if(this.b1) { this.layerToRender.copyPixels(this.b1.canvas, this.v, this.p, this.v.width, this.v.height); }
		};
		BasicCamera.prototype.renderB2 = function() {
			if(this.b2) this.layerToRender.copyPixels(this.b2.canvas, this.v, this.p, this.v.width, this.v.height);
		};
		BasicCamera.prototype.renderB3 = function() {
			if(this.b3) this.layerToRender.copyPixels(this.b3.canvas, this.v, this.p, this.v.width, this.v.height);
		};
		BasicCamera.prototype.renderB4 = function() {
			if(this.b4) this.layerToRender.copyPixels(this.b4.canvas, this.v, this.p, this.v.width, this.v.height);
		};
		BasicCamera.prototype.renderB5 = function() {
			if(this.b5) this.layerToRender.copyPixels(this.b5.canvas, this.v, this.p, this.v.width, this.v.height);
		};
		BasicCamera.prototype.blitLayerRender = function(cameraOffsetPosition, limitX, limitY) {
			var rawx = (cameraOffsetPosition.x - this.v.width);
			var rawy = (cameraOffsetPosition.y - this.v.height);
			this.v.x = (rawx > 0 && rawx <= (limitX || this.v.width)) ? rawx : this.v.x;
			this.v.y = (rawy > 0 && rawy <= (limitY || this.v.height)) ? rawy : this.v.y;
			this.renderB1();
			this.renderB2();
			this.renderB3();
			this.renderB4();
			this.renderB5();
		};
		BasicCamera.prototype.reset = function(vx,vy) {
			this.tweens1 = [];
			this.tweens2 = [];
			this.p1Tweens1 = [];
			this.p1Tweens2 = [];
			this.p2Tweens1 = [];
			this.p2Tweens2 = [];
			this.v.x = vx || 0; this.lastvx = vx || 0;
			this.v.y = vy || 0; this.lastvy = vy || 0;
			if(this._pV1) {
				this._pV1.x = vx || 0; this.pLastVs.p1x = vx || 0;
				this._pV1.y = vy || 0; this.pLastVs.p1y = vy || 0;
			}
			if(this._pV2) {
				this._pV2.x = vx || 0; this.pLastVs.p2x = vx || 0;
				this._pV2.y = vy || 0; this.pLastVs.p2y = vy || 0;
			}
		};
		BasicCamera.prototype.resetTween = function() {
			this.tweens1 = [];
			this.tweens2 = [];
			this.p1Tweens1 = [];
			this.p1Tweens2 = [];
			this.p2Tweens1 = [];
			this.p2Tweens2 = [];
		};//offsets should be the negative of what you would use as cameraOffsetPosition during blitLayerRender
		BasicCamera.prototype.focus = function(mpToFocusOn, offsetX, offsetY) {
			
			this.resetTween();
			this.v.x = mpToFocusOn.x -offsetX;
			if(this.v.x < 0) this.v.x = 0;
			if(this.v.x > this.v.width) this.v.x = this.v.width;
			this.v.y = mpToFocusOn.y -offsetY;
			if(this.v.y < 0) this.v.y = 0;
			if(this.v.y > this.v.height) this.v.y = this.v.height;
			this.justRender();
			this.blitLayerRender(mpToFocusOn.subtractBy(-offsetX, -offsetY, 1), 0,0);
		};
		BasicCamera.prototype.tweenedBlitLayerRender = function(cameraOffsetPosition, limitX, limitY, tweenTime, easeType, startingX, startingY) {
			
			var rawx = (cameraOffsetPosition.x - this.v.width);
			var rawy = (cameraOffsetPosition.y - this.v.height);
			var sX = startingX != 0 ? startingX : 0;
			var sY = startingY != 0 ? startingY : 0;
			
			this.v.x = (rawx > sX && rawx <= (limitX || this.v.width)) ? rawx : this.v.x;
			this.v.y = (rawy > sY && rawy <= (limitY || this.v.height)) ? rawy : this.v.y;
			if(this._pV1) { //potential parallax 1
				this._pV1.x = this.v.x + 1 -1;
				this._pV1.y = this.v.y + 1 -1;
			}
			if(this._pV2) { //parallax 2
				this._pV2.x = this.v.x + 1 -1;
				this._pV2.y = this.v.y + 1 -1;
			}
			
			if (this.tweens1.length && this.tweens2.length) {
				this.v.x = this.tweens1.shift(); this.v.y = this.tweens2.shift();
				this.lastvx = this.v.x; this.lastvy = this.v.y;
			} else {
				tabageos.TweenMath.tweenArray(this.lastvx, this.v.x, tweenTime, easeType || "Linear", null,this.tweens1);
				this.trsh = this.tweens1.shift();
				tabageos.TweenMath.tweenArray(this.lastvy, this.v.y, tweenTime, easeType || "Linear",null,this.tweens2);
				this.trsh = this.tweens2.shift();
				this.v.x = this.tweens1.shift(); this.v.y = this.tweens2.shift();
				this.lastvx = this.v.x; this.lastvy = this.v.y;
			}
			
			if(this.p1Tweens1.length && this.p1Tweens2.length) { //p 1
				this._pV1.x = this.p1Tweens1.shift(); this._pV1.y = this.p1Tweens2.shift();
				this.pLastVs.p1x = this._pV1.x;this.pLastVs.p1y = this._pV1.y;
			} else if(this._pLayer1) {
				tabageos.TweenMath.tweenArray(this.pLastVs.p1x, this._pV1.x,  this.pTweenTime || tweenTime*2 , this.pTweenType || "Linear", null,this.p1Tweens1);
				this.trsh = this.p1Tweens1.shift();
				this._pV1.x = this.p1Tweens1.shift();
				tabageos.TweenMath.tweenArray(this.pLastVs.p1y, this._pV1.y,  this.pTweenTime || tweenTime*2 , this.pTweenType || "Linear",null,this.p1Tweens2);
				this.trsh = this.p1Tweens2.shift();
				this._pV1.y = this.p1Tweens2.shift();
				this.pLastVs.p1x = this._pV1.x;this.pLastVs.p1y = this._pV1.y;	
			}
			
			if(this.p2Tweens1.length && this.p2Tweens2.length) { //p 2
				this._pV2.x = this.p2Tweens1.shift(); this._pV1.y = this.p2Tweens2.shift();
				this.pLastVs.p2x = this._pV2.x;this.pLastVs.p2y = this._pV2.y;
			} else if(this._pLayer2) {
				tabageos.TweenMath.tweenArray(this.pLastVs.p2x, this._pV2.x,  this.pTweenTime2 || tweenTime*2 , this.pTweenType2 || "Linear", null,this.p2Tweens1);
				this.trsh = this.p2Tweens1.shift();
				this._pV2.x = this.p2Tweens1.shift();
				tabageos.TweenMath.tweenArray(this.pLastVs.p2y, this._pV2.y,  this.pTweenTime2 || tweenTime*2 , this.pTweenType2 || "Linear",null,this.p2Tweens2);
				this.trsh = this.p2Tweens2.shift();
				this._pV2.y = this.p2Tweens2.shift();
				this.pLastVs.p2x = this._pV2.x;this.pLastVs.p2y = this._pV2.y;	
			}
			
			if(this._pLayer1) { this.renderP1(); }
			if(this._pLayer2) { this.renderP2(); }
			this.renderB1();
			this.renderB2();
			this.renderB3();
			this.renderB4();
			this.renderB5();
		};
		BasicCamera.prototype._dragPosition = null;
		BasicCamera.prototype.releaseDrag = function() {
			this._dragPosition = null;
		};
		/**
		*
		* example - document.onmousemove = function(e) { camera.drag(mouseMP,64,0,1,100); }
		*           document.onmouseup = function(e) { camera.releaseDrag(); }
		*           gameLoop = function(e) { camera.justRender(); }
		* dragPos - The MoverPoint position the drag starts from, this must be defined, normally is just the mouse position.
		*/
		BasicCamera.prototype.drag = function(dragPos, dragSpeed, limitX, limitY, tweenTime, easeType) {
			
			if(!this._dragPosition) {
				this._dragPosition = dragPos; return;
			}
			
			var spee = dragSpeed || 64;
			var rawx = this.v.x + ( (this._dragPosition.x - dragPos.x)/(this.v.width/spee) );//(cameraOffsetPosition.x - this.v.width);
			var rawy = this.v.y + ( (this._dragPosition.y - dragPos.y)/(this.v.height/spee) );//(cameraOffsetPosition.y - this.v.height);
			
			this.v.x = (rawx > 0 && rawx <= (limitX || this.v.width)) ? rawx : this.v.x;
			this.v.y = (rawy > 0 && rawy <= (limitY || this.v.height)) ? rawy : this.v.y;
			
			if (this.tweens1.length && this.tweens2.length) {
				this.v.x = this.tweens1.shift(); this.v.y = this.tweens2.shift();
				this.lastvx = this.v.x; this.lastvy = this.v.y;
			} else {
				this.tweens1 = tabageos.TweenMath.tweenArray(this.lastvx, this.v.x, tweenTime, easeType || "Linear");
				this.trsh = this.tweens1.shift();
				this.tweens2 = tabageos.TweenMath.tweenArray(this.lastvy, this.v.y, tweenTime, easeType || "Linear");
				this.trsh = this.tweens2.shift();
				this.v.x = this.tweens1.shift(); this.v.y = this.tweens2.shift();
				this.lastvx = this.v.x; this.lastvy = this.v.y;
			}
			this.renderB1();
			this.renderB2();
			this.renderB3();
			this.renderB4();
			this.renderB5();
		};
		/**
		*  
		* This method is primaraly for use with the drag method, to render the scene when not being dragged.
		*
		*/
		BasicCamera.prototype.justRender = function() {
			this.renderB1();
			this.renderB2();
			this.renderB3();
			this.renderB4();
			this.renderB5();
		};
		this.tabageos.TweenMath.doubleTweenArray = function(firstStart, firstEnd, secondStart, secondEnd, interval, how , secondHow , loopOptions) {
			var stoa = tabageos.TweenMath.tweenArray(firstStart, firstEnd, interval, how, loopOptions).join(",") + tabageos.TweenMath.tweenArray(secondStart, secondEnd, interval, secondHow, loopOptions).join(","); 
			return stoa.split(",");
		};
this.tabageos.BasicCamera = BasicCamera;
})();	
		
(function() {
	function LoopingImage(canvas, width, height) {
		this.init(canvas, width, height);
		this.bI = 0; this.fRect =new tabageos.Rectangle();
		this.tPoint = new tabageos.MoverPoint();
	};
		LoopingImage.prototype = new tabageos.CanvasObject();
		LoopingImage.prototype.fRect = null;
		LoopingImage.prototype.bI = 0;
		LoopingImage.prototype.tPoint = null;
		LoopingImage.prototype.loopHorizontal = function(imgToLoop,w,h,incer) {
			this.fRect.x = this.bI;//backgroundI;//Apply the increment to the x position to copy from, starts from 0.
            this.fRect.y = 0;//y does not change, we are only moving horizontally.
            this.fRect.width = w;//the width of the image
            this.fRect.height = h;//the height of the image
            this.tPoint.x = 0;
            this.copyPixels(imgToLoop, this.fRect, this.tPoint,w,h);//draw the image from backgroundI to 500.
            if (this.bI > 0) { //when the backgroundI is 1 or more, also
                this.fRect.x = 0;//copy from the start,
                this.tPoint.x = w - this.bI;//but draw at the end, 
                this.fRect.width = this.bI;//using only the left out front part of the image.
                this.copyPixels(imgToLoop, this.fRect, this.tPoint,this.fRect.width,h);
            }
            if (this.bI < w) { this.bI += incer || 1; } else { this.bI = 0; }
		};
	this.tabageos.LoopingImage = LoopingImage;
})();
this.tabageos = this.tabageos||{};
(function() {
	/* HTML5 Audio sound system -  HTML5 sound is not yet fully supported in all browers/devices. use native sound code for best results*/
	function SoundSystem() {
	
	};
	SoundSystem.prototype._soundPlaying = "";
	SoundSystem.prototype._sounds = [];
	SoundSystem.prototype._soundTracks = [];
	SoundSystem.prototype._soundIndex = 0;
	SoundSystem.prototype._soundNames = [];
	SoundSystem.prototype._currentTrack;
	SoundSystem.prototype._trackTimer;
	SoundSystem.prototype.addSound = function(soundLocation, name, vol, poolAmount) {
		var innera = []; var i = 0; var l = poolAmount;
		for(i;i<l;i++) {
			var s = new Audio(soundLocation);
			s.volume = vol; s.load();
			innera[innera.length] = s;
		}
		this._soundNames.push(name);
		this._sounds[this._sounds.length] = innera;
	};
	SoundSystem.prototype.addMusic = function(soundLocation, vol) {
		var s = new Audio(soundLocation);
		s.volume = vol; s.load();
		this._soundTracks[this._soundTracks.length] = s;
	};
	SoundSystem.prototype.playSound = function(name, time) {
		var a = this._sounds[this._soundNames.indexOf(name)];
		var ind = this._soundIndex;
		if(a[ind] && (a[ind].currentTime == 0 || a[ind].ended) ) {
			a[ind].play();
			if(this._soundIndex < a.length-1) {
				this._soundIndex += 1;
			} else { this._soundIndex = 0; }
		} 
	};
	//timer - optional already started tabageos.IntervalController used to loop the song
	SoundSystem.prototype.playMusic = function(index, timer) {
		index = index || 0; var s = this._soundTracks[index];
		if(s && (s.currentTime == 0 || s.ended || s.paused)) {
			s.play(); this._currentTrack  = s;
		}
		if(timer && this._currentTrack) { 
			timer.removeEventListener(tabageos.IntervalEvent.INTERVAL, "_replayTrack", this);
			timer.addEventListener(tabageos.IntervalEvent.INTERVAL, "_replayTrack", this);
		}
	};
	SoundSystem.prototype.stopMusic = function(timer) {
		this._currentTrack.pause();
		if(timer) { 
			timer.removeEventListener(tabageos.IntervalEvent.INTERVAL, "_replayTrack", this);
		}
	};
	SoundSystem.prototype._replayTrack = function(e) {
		if(this._currentTrack.ended) { this._currentTrack.play(); }
	};
	SoundSystem.prototype.audioContxt;//neither does WebApi work in all cases.
	SoundSystem.prototype.establishWebApi = function() {
		  try {
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.audioContxt = new AudioContext();
		  } catch(e) {
			this.audioContxt = null;
		  }
	};
	SoundSystem.prototype.soundBuffers = [];
	SoundSystem.prototype.addSoundBuffer = function(soundURL) {
		var xr = new XMLHttpRequest();
		  xr.open('GET', soundURL, true);
		  xr.responseType = 'arraybuffer';
		  var ctx = this.audioContxt;
		  var bffs = this.soundBuffers;
		  xr.onload = function() {
			ctx.decodeAudioData(xr.response, function(buffer) {
			  bffs.push(buffer);
			}, onError);
		  }
		  xr.send();
	};
	SoundSystem.prototype.playSoundBuffer = function(index, startPosition) {
		var starting = startPosition || 0;
		var s = this.audioContxt.createBufferSource();
		  s.buffer = this.soundBuffers[index];
		  s.connect(this.audioContxt.destination);  
		  s.start(starting);
	};
this.tabageos.SoundSystem = SoundSystem;
this.tabageos.seekTouch = function() {return ('ontouchstart' in window ? 1 : (navigator.maxTouchPoints ? 1 : 0));};
})();
this.tabageos = this.tabageos || {};
/*
* Scales the game based on window.innerWidth/Height and gameWidth/Height
* 
* gameWidth - the width of game game
* gameHeight - the height of the game
* divideScaleXBy - amount to divide the scaleX by (1.0 to 1.9)
* divideScaleYBy - amount to divide the scaleY by
* container - reference to the container div element that holds the game and controller canvas element
*             if null is passed no resizing happens
* controller - reference to the controller canvas element
*              (container through the end are optional params)
* showController - Boolean
* controllerStyle - 1 = 'basicController', 2 = 'directionalsController' or you can pass your own String.
*                   sets the controllers canvas elements style id. (see ControllerPad.css and ControllerPad.show())
*  dontPositionController - Boolean, optional if you have placed the controller in your own specific way.
*                           Otherwise the controllers canvas elements style top will be set as controller.y and the left as controller.x.
*  cW = controller width  - default is 640 and you don't ever really need to change it
*  cH = controller height - default is 192 and you don't ever really need to change it
*                           your free to make your game any size just being sure to put both it and the controller canvas
*                           inside of a container div, this method resizes everything.
*        
*
*/
this.tabageos.ResizeGame = function(gameWidth,gameHeight,divideScaleXBy,divideScaleYBy,container,controller,showController,controllerStyle,dontPositionController,cW,cH) {
	var scaleX = window.innerWidth / gameWidth;
	var scaleY = window.innerHeight / gameHeight;
	if(controller && !showController) { 
		controller.hide();
	} else if(showController && controller) {
		controller.show(cW || 640,cH || 192,controllerStyle || 1,dontPositionController);
	}
	if(container) {
		container.style.transformOrigin = "0 0";
		container.style.transform = "scale(" + (divideScaleXBy ? scaleX/divideScaleXBy : 1) + ","+ (divideScaleYBy ? scaleY/divideScaleYBy : 1) +")";
		var scaleRect = container.getBoundingClientRect();
		tabageos.MouseController.defineMousePositionOffset(gameWidth,gameHeight,scaleRect.width, scaleRect.height);
	}
};

this.tabageos = this.tabageos || {};
(function () {
	/*
	* eWidth/eHeight the explosion width/height
	* countStop the amount of frames of the explosion animation
	* spriteSheetX/Y the starting x/y position in your sprite sheet, of the explosion animation.
	*/
	function ExplosionFactory(eWidth,eHeight,countStop,spriteSheetX,spriteSheetY) {
		this.explosionRect = new tabageos.Rectangle(0,0,eWidth,eHeight);
		this.explosionPoint = new tabageos.MoverPoint();
		this.explosions = [];
		this.explosionHold = [];
		this.eWidth = eWidth; this.eHeight = eHeight;
		this.sFromX = spriteSheetX || 96;
		this.sFromY = spriteSheetY || 0;
		this.countStop = countStop;
		this.readyExplosions(51);
	};
	ExplosionFactory.prototype = new Object();
	ExplosionFactory.prototype.eWidth;
	ExplosionFactory.prototype.eHeight;
	ExplosionFactory.prototype.countStop = 6;
	ExplosionFactory.prototype.explosions = [];
	ExplosionFactory.prototype.explosionRect;
	ExplosionFactory.prototype.explosionPoint;
	ExplosionFactory.prototype.sFromX = 96;
	ExplosionFactory.prototype.sFromY = 0;
	ExplosionFactory.prototype.explosionHold = [];
	ExplosionFactory.prototype.readyExplosions = function(amount) {
		while(amount > 0) { amount -= 1;
			this.explosionHold.push({x:0,y:0,count:1,fromX:0});
		}
	};
	
	/* ex/ey, x/y position to place the explosion animation
	* ecount, the frame to start from, when it reaches countStop the animation stops
	* fromX, the x position in the sprite sheet to start the animation from
	*/
	ExplosionFactory.prototype.addExplosion = function(ex,ey,ecount,fromX) {
		this.explosions[this.explosions.length] = this.explosionHold.pop();
		this.explosions[this.explosions.length-1].x = ex;
		this.explosions[this.explosions.length-1].y = ey;
		this.explosions[this.explosions.length-1].count = ecount || 1;
		this.explosions[this.explosions.length-1].fromX = fromX || 0;
	};
	/*
	* canvasObejct, the tabageos.CanvasObject to draw the explosion animations into
	* source, the html img soruce to draw from. your sprite sheet.
	* this method needs to be called during a loop.
	*/
	ExplosionFactory.prototype.displayExplosions = function(canvasObject, source) {
		var i = 0;var l = this.explosions.length; var eo;
		for(i; i < l;i++) { eo = this.explosions[i];
			if(eo) { this.explosionRect.x = (eo.fromX || this.sFromX)+(eo.count*this.eWidth); this.explosionRect.y = this.sFromY; this.explosionPoint.x = eo.x;this.explosionPoint.y = eo.y;
				canvasObject.copyPixels(source, this.explosionRect, this.explosionPoint,this.eWidth,this.eHeight);					
				eo.count += 1; if(eo.count == this.countStop) { this.explosionHold[this.explosionHold.length] = this.explosions.splice(this.explosions.indexOf(eo), 1); continue; }
			}
		}
	};
this.tabageos.ExplosionFactory = ExplosionFactory;
})();
window.console.log("tabageos version 2.0: actiontad.com/basicGameObjects");
this.tabageos = this.tabageos || {};(function() {function GeometricMath() { };GeometricMath.quadCurvePoint = function(t, p0x, p0y, p1x, p1y, p2x, p2y) {var result = new tabageos.MoverPoint();var oneMinusTSq = (1-t) * (1-t);var TSq = t*t;result.x = oneMinusTSq * p0x + 2 * (1-t) * t * p1x + TSq * p2x;result.y = oneMinusTSq * p0y + 2 * (1-t) * t * p1y + TSq * p2y;return result;};GeometricMath.updateQuadCurvePoint = function(point, t, p0x, p0y, p1x, p1y, p2x, p2y) {var oneMinusTSq = (1-t) * (1-t);var TSq = t*t;point.x = oneMinusTSq * p0x + 2 * (1-t) * t * p1x + TSq * p2x;point.y = oneMinusTSq * p0y + 2 * (1-t) * t * p1y + TSq * p2y;};GeometricMath.getQuadCurvePath = function(p0, p1, p2, amountOfPathPoints) {var i = 0;var addBy = (100 / amountOfPathPoints) / 100;var path = [];var pathPoint;while ( i < 1 ) {pathPoint = GeometricMath.quadCurvePoint(i, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);path[path.length] = pathPoint;i += addBy;} return path;};GeometricMath.updateQuadCurvePath = function(path, p0, p1, p2) {var i = 0;var l = path.length; var pathPoint;var addBy = (100 / l) / 100;var t = 0;while ( i < l ) { pathPoint = path[i];updateQuadCurvePoint(pathPoint, t, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);i += 1; t += addBy;} };GeometricMath.hermiteCurvePoint = function(t, p0x, p0y, t0x, t0y, p1x, p1y, t1x, t1y) {var result = new tabageos.MoverPoint();result.x = (2 * Math.pow(t,3) - 3 * t * t + 1) * p0x+(Math.pow(t,3) - 2 * t * t + t) * t0x + (- 2 * Math.pow(t,3) + 3*t*t) * p1x +( Math.pow(t,3) - t*t) * t1x;result.y = (2 * Math.pow(t,3) - 3 * t * t + 1) * p0y+(Math.pow(t,3) - 2 * t * t + t) * t0y + (- 2 * Math.pow(t,3) + 3*t*t) * p1y +( Math.pow(t,3) - t*t) * t1y;return result;};GeometricMath.getHermiteCurvePath = function(p0, t0, p1, t1, amountOfPathPoints) {var i = 0;var addBy = (100 / amountOfPathPoints) / 100;var path = [];while ( i < 1 ) {var pathPoint = GeometricMath.hermiteCurvePoint(i, p0.x, p0.y, t0.x, t0.y, p1.x, p1.y, t1.x, t1.y);path[path.length] = pathPoint;i += addBy;} return path;};GeometricMath.lineIntersectionTest = function(a, b, c, d) {var top1 = (a.y-c.y)*(d.x-c.x)-(a.x-c.x)*(d.y-c.y);var top2 = (a.y-c.y)*(b.x-a.x)-(a.x-c.x)*(b.y-a.y);var bott = (b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x);if (bott == 0) {return false;}var opBott = 1.0/bott;var u = top1 * opBott;var dw = top2 * opBott;if ( (u > 0) && (u < 1) && (dw > 0) && (dw < 1) ) {return true;} return false;};GeometricMath.lineIntersectionPoint = function(a, b, c, d) {var top1 = (a.y-c.y)*(d.x-c.x)-(a.x-c.x)*(d.y-c.y);var top2 = (a.y-c.y)*(b.x-a.x)-(a.x-c.x)*(b.y-a.y);var bott = (b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x);if ( bott == 0) {return null;}var u = top1/bott;var dw = top2/bott;if ( (u > 0) && (u < 1) && (dw > 0) && (dw < 1) ) {var temp = b.subtract(a).multiply(u);var point = a.add(temp);return point;} else {return null;}};GeometricMath.testForPointInCircle = function(circlePosition, circleRadius, pointToTest) {var dist = pointToTest.subtract(circlePosition).getSquaredLength();if (dist < (circleRadius*circleRadius)) {return true;} return false;};GeometricMath.testForPointInArea = function(p, left, top, right, bottom) {return Boolean(!(p.x < left || p.x > right || p.y < top || p.y > bottom));};GeometricMath.getMoverPointsOnCircle = function(circleCenter, circleRadius, numberOfPoints) {var alpha = (Math.PI * 2) / numberOfPoints;var points = [];var theta;var p;var i = -1;while ( i < numberOfPoints ) { i += 1;  theta = alpha * i;p = new tabageos.MoverPoint( Math.cos(theta) * circleRadius, Math.sin(theta) * circleRadius );points[i] = circleCenter.add(p);} return points;};GeometricMath.getRawPointsOnCircle = function(circleCenterX, circleCenterY, circleRadius, numberOfPoints) {var alpha = (Math.PI * 2) / numberOfPoints;var points = [];var theta;var cpx;var cpy;var i = -1;var remainder = numberOfPoints % 2;if (remainder != 0) {numberOfPoints = numberOfPoints - Math.round(remainder);}while ( i < numberOfPoints * 2 ) { i += 2;  theta = alpha * int(i/2);cpx = Math.cos(theta) * circleRadius;cpy = Math.sin(theta) * circleRadius;points[i - 1] = circleCenterX + cpx;points[i] = circleCenterY + cpy;} return points;};GeometricMath.mergeArrays = function(a1, a2) {var i;for (i = 0; i < a2.length; i++) { a1[a1.length] = a2[i]; }return a1;};GeometricMath.quadCurvePoint = function(t, p0x, p0y, p1x, p1y, p2x, p2y) {var result = new tabageos.MoverPoint(); var oneMinusTSq = (1-t) * (1-t); var TSq = t*t; result.x = oneMinusTSq * p0x + 2 * (1-t) * t * p1x + TSq * p2x; result.y = oneMinusTSq * p0y + 2 * (1-t) * t * p1y + TSq * p2y;return result;}; GeometricMath.rectanglesIntersect = function(r1,r2) { return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y); }; GeometricMath.rectanglesOverlapAmount = function(r1, r2) { var top = Math.max(r1.y,r2.y);var bottom = Math.min(r1.y +r1.height, r2.y+r2.height); var left = Math.max(r1.x, r2.x); var right = Math.min(r1.x + r1.width, r2.x + r2.width); var si = Math.max(0, right - left) * Math.max(0, bottom - top); var su = (r1.width * r1.height) + (r2.width * r2.height) - si; return si; }; GeometricMath.isPowerOfTwo = function(x) { return x > 0 && (x & (x - 1)) == 0;}; tabageos.GeometricMath = GeometricMath;})();
//CopyRight 2017 (t)ad - You may use this code (tbgs.js) to make your own commercial/free HTML5 game, but you may not sell the code in code form, or distribute it as just code, even if you modify it.
