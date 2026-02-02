document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------
    // GRUB BOOTLOADER LOGIC (Humanified)
    // ----------------------------------------
    const items = document.querySelectorAll('.grub-item');
    // Only real OS options are selectable (the first two usually)
    const activeItems = Array.from(items).filter(i => i.dataset.os);
    let selIdx = 0;
    
    let time = 10;
    let tInt = null;
    let userAct = false;

    // Draw selection
    const draw = () => {
        // Clear all
        items.forEach(i => i.classList.remove('selected'));
        // Select current
        if(activeItems[selIdx]) activeItems[selIdx].classList.add('selected');
    };

    // Boot function
    const boot = () => {
        if(tInt) clearInterval(tInt);
        const os = activeItems[selIdx].dataset.os;
        
        const b = document.getElementById('bootloader');
        b.style.display = 'none';
        
        if(os === 'linux' && window.LinuxOS) window.LinuxOS.boot();
        else if(os === 'windows' && window.WindowsOS) window.WindowsOS.boot();
    };

    // Stop timer
    const stop = () => {
        if(!userAct) {
            userAct = true;
            if(tInt) clearInterval(tInt);
            const disp = document.querySelector('.grub-timer');
            if(disp) disp.style.visibility = 'hidden';
            // Also remove auto text logic if needed, but hiding the div is enough
        }
    };

    // Timer
    const tDisp = document.getElementById('boot-timer-val');
    if(tDisp) {
        tInt = setInterval(() => {
            time--;
            tDisp.innerText = time;
            if(time <= 0) {
                clearInterval(tInt);
                boot();
            }
        }, 1000);
    }

    // Input Handling
    document.addEventListener('keydown', (e) => {
        // Stop timer on any interaction
        if(['ArrowUp','ArrowDown','Enter'].includes(e.key)) stop();

        if (e.key === 'ArrowUp') {
            selIdx--;
            if(selIdx < 0) selIdx = activeItems.length - 1;
            draw();
        } else if (e.key === 'ArrowDown') {
            selIdx++;
            if(selIdx >= activeItems.length) selIdx = 0;
            draw();
        } else if (e.key === 'Enter') {
            boot();
        }
    });

    // Mouse click support
    activeItems.forEach((el, idx) => {
        el.addEventListener('mouseenter', () => {
            stop();
            selIdx = idx;
            draw();
        });
        el.addEventListener('click', () => {
            stop();
            boot();
        });
    });

    // Sys helpers
    window.rebootSystem = function() {
        window.location.reload();
    };

    // Audio stub
    if (!window.audioManager) {
        window.audioManager = { play:()=>{}, volume:1 };
    }
});
