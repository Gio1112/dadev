class AudioManager {
    constructor() {
        this.enabled = false;
        this.sounds = {
            linuxStartup: new Audio('audio/linux-startup.ogg'),
            linuxShutdown: new Audio('audio/linux-shutdown.ogg'),
            winStartup: new Audio('audio/windows-startup.mp3'),
            winShutdown: new Audio('audio/windows-shutdown.mp3')
        };
        
        // Preload
        Object.values(this.sounds).forEach(s => {
            s.load();
            s.volume = 0.4; // Slightly muted/balanced
        });

        // Unlock audio on first interaction
        const unlock = () => {
            this.enabled = true;
            console.log('Audio unlocked');
            document.removeEventListener('keydown', unlock);
            document.removeEventListener('click', unlock);
        };
        document.addEventListener('keydown', unlock);
        document.addEventListener('click', unlock);
    }

    play(soundName) {
        if (!this.enabled) return;
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            const promise = sound.play();
            if (promise !== undefined) {
                promise.catch(e => {
                    console.log(`Audio play failed for ${soundName}:`, e);
                    // It likely means user interaction didn't propagate or file missing
                });
            }
        }
    }
}

window.audioManager = new AudioManager();
