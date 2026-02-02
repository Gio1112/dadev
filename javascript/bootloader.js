document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('bootloader'))Bootloader.init();});
window.Bootloader = {
    selected:0,timer:10,items:[],interval:null,
    init: function(){
        this.items=document.querySelectorAll('.grub-item');
        this.setupKeyboard();this.startTimer();
    },
    setupKeyboard: function(){
        window.addEventListener('keydown',(e)=>{
            this.resetTimer();
            if(e.key==='ArrowUp'){
                this.selected--;if(this.selected<0)this.selected=this.items.length-1;this.updateMenu();
            }else if(e.key==='ArrowDown'){
                 this.selected++;if(this.selected>=this.items.length)this.selected=0;this.updateMenu();
            }else if(e.key==='Enter'){this.boot();}
        });
    },
    updateMenu: function(){
        this.items.forEach((item,index)=>{if(index===this.selected){item.classList.add('selected');}else{item.classList.remove('selected');}});
    },
    startTimer: function(){
        if(this.interval)clearInterval(this.interval);
        const timerEl=document.getElementById('boot-timer');
        this.interval=setInterval(()=>{
            this.timer--;
            if(timerEl)timerEl.innerText=`Autoboot in ${this.timer}s...`;
            if(this.timer<=0){this.boot();}
        },1000);
    },
    resetTimer: function(){
        this.timer=30;const timerEl=document.getElementById('boot-timer');
        if(timerEl)timerEl.innerText=`Autoboot in ${this.timer}s...`;
    },
    boot: function(){
        clearInterval(this.interval);
        // window.removeEventListener('keydown', this.setupKeyboard); // broken ref
        const selectedItem=this.items[this.selected];
        const os=selectedItem.getAttribute('data-os');
        const action=selectedItem.getAttribute('data-action');
        if(action==='shutdown'){
            document.body.innerHTML='<div style="background:black; color:white; height:100vh; display:flex; justify-content:center; align-items:center;">System Halted.</div>';return;
        }
        document.getElementById('bootloader').style.display='none';
        if(os==='linux'){if(window.LinuxOS)window.LinuxOS.boot();}
        else if(os==='windows'){if(window.WindowsOS)window.WindowsOS.boot();}
    }
};

window.rebootSystem = function(currentOs){
    if(currentOs==='linux'){
        const t=document.getElementById('linux-os');
        t.innerHTML="";t.classList.remove('active');t.style.display='none';
        location.reload();
    }else{location.reload();}
}
