
Hooks.once("dragRuler.ready", (SpeedProvider) => {
	class ShadowrunSpeedProvider extends SpeedProvider {
        get colors() {
            return [
                {id: "walk", default: 0x00FF00, name: "SR5.WalkingSpeed"},
                {id: "dash", default: 0xFFFF00, name: "SR5.RunningSpeed"},
                {id: "run", default: 0xFF8000, name: "Sprinting"}
            ]
        }

        getRanges(token) {
            var baseSpeed = 0
			var runSpeed = 0
			var maxSprint =0
			var sprintSpeed = 0
            if(token.actor.system.movement){ //if there are values, use them. else the defaults are fine
				baseSpeed = token.actor.system.movement.walk.value
	            runSpeed = token.actor.system.movement.run.value
				maxSprint = token.actor.system.movement.sprint * token.actor.system.limits.physical.value
	            sprintSpeed = maxSprint + token.actor.system.movement.run.value //sprint * phys-limit + run value is max sprint range
			}
            // Characters walk up to agi*2 unless thats modified, and sprint with agi*4, so lets just take the final value
            const ranges = [
                {range: baseSpeed, color: "walk"},
                {range: runSpeed, color: "dash"},
				{range: sprintSpeed, color: "run"}
            ]

            return ranges
        }
		
		get settings() {
			return [
				{
					id: "runCondition",
					name: "Name of the Condition Lab condition",
					hint: "If provided with the name of a Condition Lab condition, it will attempt to apply it to tokens who move over their walking distance",
					scope: "world",
					config: true,
					type: String,
					default: ""
				},
				{
					id: "onlyNPC",
					name: "Only apply to NPC's",
					hint: "should the condition be only applied to npc's",
					scope: "world",
					config: true,
					type: Boolean,
					default: ""
				}
			];
		}
		
		async onMovementHistoryUpdate(tokens) {	
			const condition = this.getSetting("runCondition");
			const npc_switch = this.getSetting("onlyNPC");
			if(condition){
				for(var token of tokens){
					const movedDistance = dragRuler.getMovedDistanceFromToken(token);
					const range = dragRuler.getRangesFromSpeedProvider(token)[0]["range"];
					if(!token.actor.system.is_npc && npc_switch ){//token is not npc *and* only_npc is toggled
						continue;
					} 
					if(movedDistance > range+1){
						if (!game.cub.hasCondition(condition,token)) {
							game.cub.addCondition(condition,token)
						}
					}else{
						if (game.cub.hasCondition(condition,token)) {
							game.cub.removeCondition(condition,token)
						}
					}
				}	
			}
		}
    }
    dragRuler.registerModule("drag-ruler-integration-for-shadowrun-5e", ShadowrunSpeedProvider)
})
