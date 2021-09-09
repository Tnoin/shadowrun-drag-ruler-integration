
Hooks.once("dragRuler.ready", (SpeedProvider) => {
    class ShadowrunSpeedProvider extends SpeedProvider {
        get colors() {
            return [
                {id: "walk", default: 0x00FF00, name: "shadowrun5e.speeds.walk"},
                {id: "dash", default: 0xFFFF00, name: "shadowrun5e.speeds.dash"},
                {id: "run", default: 0xFF8000, name: "shadowrun5e.speeds.run"}
            ]
        }

        getRanges(token) {
            const baseSpeed = token.actor.data.data.movement.walk.value
            const runSpeed = token.actor.data.data.movement.run.value
            const sprintSpeed = token.actor.data.data.movement.sprint.value

            // Characters walk up to agi*2 unless thats modified, and sprint with agi*4, so lets just take the final value
            const ranges = [
                {range: baseSpeed, color: "walk"},
                {range: runSpeed, color: "dash"}
            ]

            return ranges
        }
    }
    dragRuler.registerModule("drag-ruler-integration-for-shadowrun-5e", ShadowrunSpeedProvider)
})