window.WindowsOS = {
    settings: {crashChance:0.05,errorChance:0.08},
    boot: function(){
        const osEl=document.getElementById('windows-os');
        const bootScreen =document.getElementById('windows-boot-screen');
    const desktop=document.getElementById('windows-desktop');
        const progress= document.getElementById('xp-progress');
        osEl.classList.add('active'); bootScreen.style.display='flex';
        desktop.style.display='none';
        progress.style.width='0%';
        let w=0;
        const interval=setInterval(()=>{
            w+=2;
            progress.style.width=w+'%';
            if(w>=100){
                clearInterval(interval);
                setTimeout(this.showDesktop.bind(this),500);
            }
        },30);
        this.chaosTimer=setInterval(()=>this.systemStabilityCheck(),10000);
    },
    systemStabilityCheck: function(){
      const osEl=document.getElementById('windows-os');
      if(!osEl.classList.contains('active'))return;
      if(Math.random()<this.settings.crashChance){this.triggerBSOD();return;}
      if(Math.random()<this.settings.errorChance){this.triggerRandomError();}
    },
    triggerBSOD:function(){
        clearInterval(this.chaosTimer);
        const desktop=document.getElementById('windows-desktop');
        let bsod=document.getElementById('bsod');
        if(!bsod){
            bsod=document.createElement('div');
            bsod.id='bsod';
            bsod.style.cssText="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:#0000AA; color:white; padding:100px; font-family:'Courier New'; z-index:9999999; font-weight:bold; cursor:none; font-size: 16px; line-height: 1.5;";
            bsod.innerHTML = `<p>A problem has been detected and Windows has been shut down to prevent damage to your computer.</p><br><p>DRIVER_IRQL_NOT_LESS_OR_EQUAL</p><br><p>If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:</p><p>Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.</p><br><p>Technical information:</p><p>*** STOP: 0x000000FE (0x00000008, 0x00000006, 0x00000009, 0x847075CC)</p><br><p>Beginning dump of physical memory</p><p>Physical memory dump complete.</p><p>Contact your system administrator or technical support group for further assistance.</p>`;
            desktop.appendChild(bsod);
        }
        bsod.style.display='block';
        if(window.audioManager)window.audioManager.play('error');
        setTimeout(()=>{
            bsod.style.display='none';
            window.rebootSystem('windows');
        },8000);
    },
    showMessageBox: function(params){
        const {title,message,icon,width,height,type}=params;
        const modal=document.createElement('div');
        modal.className='xp-window msg-modal';
        const w=width||350;
        const h=height||'auto';
        const x=(window.innerWidth-w)/2;
        const y=(window.innerHeight-200)/2;
        modal.style.cssText=`position: absolute;left: ${x}px;top: ${y}px;width: ${w}px;height: ${h};z-index: 20000;display: flex;flex-direction: column;box-shadow: 3px 3px 10px rgba(0,0,0,0.5);font-family: Tahoma, sans-serif;border: 1px solid #0058ee;border-top-left-radius: 8px;border-top-right-radius: 8px;`;
        modal.innerHTML=`<div class="xp-titlebar" style="background: linear-gradient(to bottom, #0058ee 0%, #0e4fd8 100%); padding: 5px 10px; display: flex; justify-content: space-between; align-items: center; color: white; font-weight: bold; font-size: 11px; border-top-left-radius: 6px; border-top-right-radius: 6px;"><span>${title||'Message'}</span><div class="xp-controls"><div class="xp-btn close" style="background:#e81123; border:1px solid white; border-radius:3px; width:16px; height:16px; display:flex; justify-content:center; align-items:center; cursor:pointer;">X</div></div></div><div class="xp-content" style="padding: 15px; display: flex; gap: 15px; align-items: center; background: #ece9d8; border-left: 1px solid #0058ee; border-right: 1px solid #0058ee;"><img src="${icon||'https://win98icons.alexmeub.com/icons/png/msg_information-0.png'}" width="32" height="32"><div style="font-size: 11px; font-family: Tahoma; color: black; line-height: 1.4;">${message}</div></div><div style="padding: 10px; text-align: center; background: #ece9d8; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border: 1px solid #0058ee; border-top: none;"><button class="ok-btn" style="padding: 4px 25px; font-family: Tahoma; font-size: 11px; border:1px solid #003c74; background: linear-gradient(to bottom, #f0f0f0, #e0e0e0); cursor:pointer;">OK</button></div>`;
        document.getElementById('windows-area').appendChild(modal);
        if(window.audioManager){
             const snd=type==='error'?'error':'ding';
             window.audioManager.play(snd);
        }
        const close=()=>modal.remove();
        modal.querySelector('.close').onclick=close;
        modal.querySelector('.ok-btn').onclick=close;
        let isDown=false;
        let startX,startY;
        const header=modal.querySelector('.xp-titlebar');
        header.onmousedown=(e)=>{
            isDown=true;
            startX=e.clientX-modal.offsetLeft;
            startY=e.clientY-modal.offsetTop;
            modal.style.zIndex=20002;
        };
        window.addEventListener('mouseup',()=>isDown=false);
        window.addEventListener('mousemove',(e)=>{
            if(isDown){
                 modal.style.left=(e.clientX-startX)+'px';
                 modal.style.top=(e.clientY-startY)+'px';
            }
        });
    },
    triggerRandomError: function(){
        const errors=["Explorer.exe has encountered a problem and needs to close.","Visual Basic failed to initialize.","An error occurred while displaying the previous error.","Task failed successfully.","You do not have permission to view 'My Documents'."];
        const text=errors[Math.floor(Math.random()*errors.length)];
        this.showMessageBox({title:"Error",message:text,icon:"https://win98icons.alexmeub.com/icons/png/msg_error-0.png",type:'error'});
    },
    showDesktop: function(){
        document.getElementById('windows-boot-screen').style.display='none';
        const desktop=document.getElementById('windows-desktop');
        desktop.style.opacity=0;
        desktop.style.display='block';
        if(window.audioManager){window.audioManager.volume=1.0;window.audioManager.play('winStartup');}
        let op=0;
        const fade=setInterval(()=>{op+=0.05;desktop.style.opacity=op;if(op>=1)clearInterval(fade);},30);
        this.startClock();this.setupStartMenu();this.renderDesktopIcons();
        setTimeout(()=>WindowManager.open('about'),1500);
    },
    renderDesktopIcons: function(){
         const area=document.getElementById('windows-desktop');
         let iconContainer=document.getElementById('desktop-icons');
         if(!iconContainer){
              iconContainer=document.createElement('div');
              iconContainer.id='desktop-icons';
              iconContainer.style.cssText="position:absolute; inset:0; pointer-events:none; z-index:10;"; 
              const winArea=document.getElementById('windows-area');
              area.insertBefore(iconContainer,winArea);
         }
         iconContainer.innerHTML='';
         const icons=[{label: "My Computer", icon: "https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png", action: "computer"},{label: "My Documents", icon: "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png", action: "projects"},{label: "Recycle Bin", icon: "https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png", action: "recycle"},{label: "Internet Explorer", icon: "https://win98icons.alexmeub.com/icons/png/msie2-2.png", action: "about"},{label: "Notepad", icon: "https://win98icons.alexmeub.com/icons/png/notepad-1.png", action: "notepad"},{label: "Snake Game", icon: "https://win98icons.alexmeub.com/icons/png/game_freecell-1.png", action: "snake"}];
         let startX=20;let startY=20;let gapY=90;
         icons.forEach((i,idx)=>{
              const div=document.createElement('div');
              div.className='xp-icon';
              div.style.cssText=`position:absolute; top:${startY+idx*gapY}px; left:${startX}px; display:flex; flex-direction:column; align-items:center; width:70px; cursor:pointer; pointer-events:auto;`;
              div.innerHTML=`<img src="${i.icon}" style="width:32px; height:32px; margin-bottom:5px; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5)); pointer-events:none;"><span style="color:white; font-family:Tahoma; font-size:11px; text-shadow: 1px 1px 1px black; text-align:center; padding: 2px; border: 1px dotted transparent; pointer-events:none;">${i.label}</span>`;
              div.ondblclick=()=>{
                  if(i.action==='recycle'){
                       window.WindowsOS.showMessageBox({title:"Recycle Bin",message:"The Recycle Bin is empty.",icon:"https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png"});
                  }else if(i.action==='notepad'){WindowManager.open('notepad');
                  }else if(i.action==='snake'){WindowManager.open('snake');
                  }else if(i.action==='computer'){
                       window.WindowsOS.showMessageBox({title:"C:\\ Access Denied",message:"Access is denied.<br>You do not have permission to access the System Drive.",icon:"https://win98icons.alexmeub.com/icons/png/msg_error-0.png",type:"error"});
                  }else{WindowManager.open(i.action);}
              };
              this.makeIconDraggable(div);
              iconContainer.appendChild(div);
         });
    },
    makeIconDraggable: function(el){
        let isDragging=false;let startX,startY,startLeft,startTop;
        el.onmousedown=(e)=>{
            e.stopPropagation();
            el.querySelector('img').style.opacity=0.5;
            el.querySelector('span').style.background='#0046ff';
            startX=e.clientX;startY=e.clientY;startLeft=el.offsetLeft;startTop=el.offsetTop;
            isDragging=true;
        };
        window.addEventListener('mousemove',(e)=>{
            if(!isDragging)return;
            const newLeft=startLeft+e.clientX-startX;
            const newTop=startTop+e.clientY-startY;
            el.style.left=newLeft+'px';el.style.top=newTop+'px';
        });
        window.addEventListener('mouseup',()=>{
             if(isDragging){
                isDragging=false;
                el.querySelector('img').style.opacity=1;el.querySelector('span').style.background='transparent';
             }
        });
        document.addEventListener('mousedown',(e)=>{if(!el.contains(e.target)){el.querySelector('span').style.background='transparent';}});
    },
    startClock: function(){
        const clockEl=document.getElementById('xp-clock');
        setInterval(()=>{
            const date=new Date();let hours=date.getHours();const minutes=date.getMinutes();
            const ampm=hours>=12?'PM':'AM';
            hours=hours%12;hours=hours?hours:12;
            const strTime=hours+':'+(minutes<10?'0'+minutes:minutes)+' '+ampm;
            clockEl.textContent=strTime;
        },1000);
    },
    setupStartMenu: function(){
        const startBtn=document.querySelector('.xp-start-button');
        const taskbar=document.querySelector('.xp-taskbar');
        let menu=document.getElementById('xp-start-menu');
        if(menu)menu.remove();
        menu=document.createElement('div');
        menu.id='xp-start-menu';
        menu.style.cssText=`display: none;position: absolute;bottom: 30px;left: 0;width: 380px;height: 480px;background: white;border-top-right-radius: 8px;border-top-left-radius: 8px;box-shadow: 2px -2px 10px rgba(0,0,0,0.5);z-index: 100000;flex-direction: column;font-family: Tahoma, sans-serif;border: 1px solid #003399;`;
        menu.innerHTML=`<div style="height: 60px; background: linear-gradient(to bottom, #1d4093 0%, #305da6 100%); display: flex; align-items: center; padding: 0 10px; border-top-right-radius: 5px; border-top-left-radius: 5px; border-bottom: 2px solid #e56d29;"><img src="https://win98icons.alexmeub.com/icons/png/user_computer-2.png" style="width: 48px; height: 48px; border-radius: 4px; border: 2px solid white; margin-right: 10px; background: #9db2e6;"><span style="color: white; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px black;">Giorgio</span></div><div style="flex: 1; display: flex;"><div style="width: 50%; background: white; padding: 10px; display: flex; flex-direction: column; gap: 5px; border-right: 1px solid #d3e5fa;"><div class="start-item" onclick="WindowManager.open('about')" style="padding: 5px; display: flex; align-items: center; gap: 10px; cursor: pointer; color: #333;"><img src="https://win98icons.alexmeub.com/icons/png/msie2-2.png" width="32"><div><div style="font-weight: bold; font-size: 12px;">Internet</div><div style="font-size: 10px; color: #888;">Portfolio Browser</div></div></div><div class="start-item" onclick="WindowManager.open('snake')" style="padding: 5px; display: flex; align-items: center; gap: 10px; cursor: pointer; color: #333;"><img src="https://win98icons.alexmeub.com/icons/png/game_freecell-1.png" width="32"><div><div style="font-weight: bold; font-size: 12px;">Snake Game</div><div style="font-size: 10px; color: #888;">Easter Egg</div></div></div><div class="start-item" onclick="WindowManager.open('notepad')" style="padding: 5px; display: flex; align-items: center; gap: 10px; cursor: pointer; color: #333;"><img src="https://win98icons.alexmeub.com/icons/png/notepad-1.png" width="32"><div style="font-weight: bold; font-size: 12px;">Notepad</div></div><div style="margin-top: auto; padding-top: 10px; border-top: 1px solid #ccc; text-align: center;"><span style="font-size: 10px; color: #333; font-weight:bold;">All Programs </span><span style="font-size:10px; color:green;"></span></div></div><div style="width: 50%; background: #d3e5fa; padding: 10px; display: flex; flex-direction: column; gap: 5px; border-left: 1px solid #9bbcdb;"><div onclick="WindowManager.open('projects')" style="padding: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: bold; color: #001e4e; font-size: 11px;"><img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" width="24"> My Documents</div><div style="padding: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: bold; color: #001e4e; font-size: 11px;"><img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs_2k-4.png" width="24"> My Recent Documents</div><div style="padding: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: bold; color: #001e4e; font-size: 11px;"><img src="https://win98icons.alexmeub.com/icons/png/directory_pictures-4.png" width="24"> My Pictures</div><div style="padding: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: bold; color: #001e4e; font-size: 11px;"><img src="https://win98icons.alexmeub.com/icons/png/c_drive-3.png" width="24"> My Computer</div><div style="margin-top: auto; border-top: 1px solid #9bbcdb; padding-top:10px;"><div onclick="window.rebootSystem('windows')" style="display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 5px;"><img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-5.png" width="24"> <span style="font-size: 11px; color: #001e4e;">Turn Off Computer</span></div></div></div></div><div style="height: 40px; background: linear-gradient(to bottom, #1d4093 0%, #305da6 100%); text-align: right; padding: 10px; color: white;"><span style="font-size: 11px; cursor: pointer; display:flex; align-items:center; justify-content:flex-end; gap:5px;"><img src="https://win98icons.alexmeub.com/icons/png/key_access-0.png" width="18"> Log Off</span></div>`;
        taskbar.appendChild(menu);
        startBtn.onclick=(e)=>{e.stopPropagation();menu.style.display=menu.style.display==='none'?'flex':'none';};
        document.addEventListener('click',(e)=>{if(!menu.contains(e.target)&&!startBtn.contains(e.target)){menu.style.display='none';}});
        const items=menu.querySelectorAll('.start-item');
        items.forEach(item=>{
            item.onmouseenter=()=>{item.style.background='#316ac5';item.style.color='white';item.querySelectorAll('div').forEach(d=>d.style.color='white');};
            item.onmouseleave=()=>{item.style.background='transparent';item.style.color='#333';item.querySelectorAll('div').forEach(d=>d.style.color='');};
        });
    },
};

window.WindowManager = {
    zIndex:100,windows:{},activeWindow:null,
    open: function(appId){
        if(this.windows[appId]){this.setActive(appId);return;}
        const win=document.createElement('div');win.className='xp-window';win.id=`win-${appId}`;
        win.style.left=(80+Object.keys(this.windows).length*30)+'px';win.style.top=(40+Object.keys(this.windows).length*30)+'px';
        let title="Program";let content="";let icon="https://win98icons.alexmeub.com/icons/png/program_manager-0.png";let width="600px";let height="400px";
        if (appId === 'snake') {
             title = "Snake"; icon = "https://win98icons.alexmeub.com/icons/png/game_freecell-1.png";
             width = "320px"; height = "380px";
             content = `<div style="background: #F0F0F0; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; font-family:Tahoma;"><canvas id="snake-canvas" width="300" height="300" style="background: black; border: 2px solid #808080;"></canvas><div style="margin-top: 10px; font-weight: bold; font-size: 14px;">Score: <span id="snake-score">0</span></div></div>`;
             setTimeout(()=>this.startSnake(win),100);
        } else if (appId==='notepad') {
             title = "Untitled - Notepad"; icon = "https://win98icons.alexmeub.com/icons/png/notepad-1.png"; width = "400px"; height = "300px";
             content = `<div style="display:flex; flex-direction:column; height:100%;"><div style="display:flex; gap:10px; padding:2px 5px; background:white; font-family:Tahoma; font-size:11px; border-bottom:1px solid #ccc;"><span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span></div><textarea style="flex:1; border:none; resize:none; font-family:'Lucida Console', monospace; font-size:12px; padding:2px; outline:none;"></textarea></div>`;
        } else if (appId === 'about') {
            title="Giorgio's Portfolio - Microsoft Internet Explorer";icon="https://win98icons.alexmeub.com/icons/png/msie2-2.png";
            content=`<div style="background:white; height:100%; display:flex; flex-direction:column;"><div style="background:#efebde; border-bottom:1px solid #a0a0a0; padding:2px; font-family:Tahoma, sans-serif; font-size:11px;"><div style="padding:2px 5px; border-bottom:1px solid #a0a0a0;">File Edit View Favorites Tools Help</div><div style="padding:4px 5px; display:flex; gap:5px; align-items:center;"><span style="color:#666;">Address</span><div style="background:white; border:1px solid #7f9db9; padding:2px 5px; flex-grow:1; box-shadow: inset 1px 1px 1px #ccc;">http://www.giorgio.dev/about.html</div><span style="color:#666; cursor:pointer;">Go</span></div></div><div style="background:white; flex-grow:1; padding:20px; color:black; font-family:'Times New Roman', serif; overflow-y:auto;"><h1 style="font-size:24px; color:#003399; margin-bottom:10px;">Welcome to my Portfolio</h1><hr style="border:none; border-top:1px solid #ccc; margin-bottom:15px;"><div style="float:right; border:1px solid #ccc; padding:4px; margin:0 0 10px 10px; background:#f0f0f0; width:120px; text-align:center;"><img src="https://win98icons.alexmeub.com/icons/png/user_computer-2.png" style="width:64px; height:64px; image-rendering:pixelated;"><div style="font-size:10px; margin-top:4px;">Giorgio</div></div><p><strong>Self taught developer & starter UI/UX designer.</strong></p><p>Passionate developer specializing in Discord bots and web applications.</p><h3 style="color:#003399; margin-top:20px;">Contact Information</h3><ul style="padding-left:20px; list-style:none;"><li style="margin-bottom:5px;"><img src="https://win98icons.alexmeub.com/icons/png/envelope_closed-1.png" style="vertical-align:middle; width:16px;"> Email: <a href="mailto:giorgiodabest1@gmail.com" style="color:blue;">giorgiodabest1@gmail.com</a></li><li style="margin-bottom:5px;"><img src="https://win98icons.alexmeub.com/icons/png/chm-1.png" style="vertical-align:middle; width:16px;"> Discord: giorgiodabest#0</li><li style="margin-bottom:5px;"><img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" style="vertical-align:middle; width:16px;"> Github: <a href="https://github.com/Gio1112" target="_blank" style="color:blue;">Gio1112</a></li></ul></div></div>`;
        } else if (appId === 'projects') {
             title="My Documents";icon="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png";
             content=`<div style="background:white; height:100%; display:flex; flex-direction:column;"><div style="background:#efebde; border-bottom:1px solid #a0a0a0; padding:4px 10px; font-family:Tahoma; font-size:11px;">File Edit View Favorites Tools Help</div><div style="background:white; flex-grow:1; padding:10px; display:flex; flex-wrap:wrap; align-content:flex-start; gap:20px;"><div class="xp-file-item" onclick="window.open('https://github.com/Gio1112', '_blank')" style="display:flex; flex-direction:column; align-items:center; width:80px; text-align:center; cursor:pointer;"><img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" style="width:32px; height:32px;"><div style="font-size:11px; margin-top:4px; font-family:Tahoma; color:black;">Github</div></div><div class="xp-file-item" onclick="window.open('https://giorgio.is-a.dev/swiss', '_blank')" style="display:flex; flex-direction:column; align-items:center; width:80px; text-align:center; cursor:pointer;"><img src="https://win98icons.alexmeub.com/icons/png/world-4.png" style="width:32px; height:32px;"><div style="font-size:11px; margin-top:4px; font-family:Tahoma; color:black;">Swiss Air Web</div></div><div class="xp-file-item" style="display:flex; flex-direction:column; align-items:center; width:80px; text-align:center; cursor:pointer;"><img src="https://win98icons.alexmeub.com/icons/png/notepad_file-2.png" style="width:32px; height:32px;"><div style="font-size:11px; margin-top:4px; font-family:Tahoma; color:black;">Resume.txt</div></div><div class="xp-file-item" style="display:flex; flex-direction:column; align-items:center; width:80px; text-align:center; cursor:pointer;"><img src="https://win98icons.alexmeub.com/icons/png/directory_pictures-4.png" style="width:32px; height:32px;"><div style="font-size:11px; margin-top:4px; font-family:Tahoma; color:black;">My Pictures</div></div></div><div style="background:#efebde; border-top:1px solid #a0a0a0; padding:2px 5px; font-size:11px; color:#666;">4 objects</div></div>`;
        }
        const btnStyle="width:21px; height:21px; border:1px solid white; border-radius:3px; display:flex; justify-content:center; align-items:center; color:white; font-family:sans-serif; cursor:pointer; font-size:10px; font-weight:bold; margin-left:2px; box-shadow: 0px 0px 1px rgba(0,0,0,0.5);";
        win.innerHTML=`<div class="xp-titlebar" style="position:relative; height:30px; border-top-left-radius:8px; border-top-right-radius:8px; display:flex; align-items:center; padding:0 5px; overflow:hidden;"><div style="display:flex; align-items:center; z-index:2; flex-grow:1;"><img src="${icon}" style="width:16px; height:16px; margin-right:4px; filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));"><div class="xp-title" style="color:white; font-family:Tahoma; font-size:11px; font-weight:bold; text-shadow:1px 1px 1px black;">${title}</div></div><div class="xp-controls" style="display:flex; z-index:2;"><div class="xp-btn minimize" onclick="WindowManager.minimize('${appId}', event)" style="${btnStyle} background:linear-gradient(180deg, #4da4f7 0%, #004dc1 100%); opacity:0.8; line-height:10px;">_</div><div class="xp-btn maximize" style="${btnStyle} background:linear-gradient(180deg, #4da4f7 0%, #004dc1 100%); opacity:0.8;"></div><div class="xp-btn close" onclick="WindowManager.close('${appId}', this)" style="${btnStyle} background:linear-gradient(180deg, #e99092 0%, #d53a31 100%); margin-left:4px;">X</div></div></div><div class="xp-content" style="padding:0; overflow:hidden; background:#ECE9D8; height:calc(100% - 30px); border:3px solid #00138C; border-top:none; display:flex; flex-direction:column;">${content}</div>`;
        win.style.width=width;
        win.style.height=height;
        document.getElementById('windows-area').appendChild(win);
        this.windows[appId]=win;
        this.makeDraggable(win,appId);
        this.addTaskbarItem(appId,title,icon);
        this.setActive(appId);
    },
    setActive: function(appId){
        Object.keys(this.windows).forEach(k=>{
            const w=this.windows[k];
            w.classList.remove('active');
            w.querySelector('.xp-titlebar').style.background='linear-gradient(to bottom, #7697e7 0%,#7c9fe7 3%,#8cacfd 5%,#789be5 8%,#6d90e0 14%,#4e70d4 26%,#3356be 46%,#3053ba 49%,#3559bf 52%,#3b62c4 61%,#335bcf 88%,#2751ce 91%,#1f41b9 100%)';
            w.style.opacity=1;
            w.querySelector('.xp-content').style.borderColor='#7697e7';
            const tb=document.getElementById(`tb-${k}`);
            if(tb){tb.classList.remove('active-task');tb.style.background="#3c81f3";tb.style.boxShadow="none";}
        });
        if(this.windows[appId]){
            const w=this.windows[appId];
            this.activeWindow=appId;
            this.zIndex++;
            w.style.zIndex=this.zIndex;
            w.classList.add('active');
            w.style.display='flex';
            w.querySelector('.xp-titlebar').style.background='linear-gradient(to bottom, #0058ee 0%,#2074fd 3%,#3984fd 6%,#2171fc 8%,#1962ee 14%,#185de2 24%,#0642cc 50%,#0e4fd8 57%,#1a5eee 65%,#1c61f2 83%,#1253dc 90%,#114eca 100%)';
            w.querySelector('.xp-content').style.borderColor='#00138C';
            const tb=document.getElementById(`tb-${appId}`);
            if(tb){tb.classList.add('active-task');tb.style.background="#1e52b7";tb.style.boxShadow="inset 1px 1px 2px rgba(0,0,0,0.5)";}
        }
    },
    minimize: function(appId,event){
        if(event)event.stopPropagation();
        const win=this.windows[appId];
        if(win){
            win.style.display='none';
            if(this.activeWindow===appId)this.activeWindow=null;
            const tb=document.getElementById(`tb-${appId}`);
            if(tb){tb.classList.remove('active-task');tb.style.background="#3c81f3";tb.style.boxShadow="none";}
        }
    },
    toggle: function(appId){
        const win=this.windows[appId];
        if(!win)return;
        if(win.style.display==='none'){this.setActive(appId);}else{
            if(this.activeWindow===appId){this.minimize(appId);}else{this.setActive(appId);}
        }
    },
    addTaskbarItem: function(appId,title,icon){
        const taskbar=document.getElementById('taskbar-items');
        const item=document.createElement('div');
        item.className='xp-taskbar-item';
        item.id=`tb-${appId}`;
        item.onclick=()=>this.toggle(appId);
        item.style.cssText="background:#3c81f3; margin:2px; padding:2px 10px; width:150px; color:white; display:flex; align-items:center; cursor:pointer; gap:5px; border-radius:2px;";
        item.innerHTML=`<img src="${icon}" style="width:16px; height:16px;"> <span style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-family:Tahoma;">${title}</span>`;
        taskbar.appendChild(item);
    },
    makeDraggable: function(win,appId){
        const header=win.querySelector('.xp-titlebar');
        let isDragging=false;let startX,startY,startLeft,startTop;
        win.onmousedown=()=>this.setActive(appId);
        header.onmousedown=(e)=>{
            if(e.target.classList.contains('xp-btn'))return;
            isDragging=true;startX=e.clientX;startY=e.clientY;startLeft=win.offsetLeft;startTop=win.offsetTop;
            this.setActive(appId);
        };
        document.addEventListener('mousemove',(e)=>{
            if(!isDragging)return;
            let newLeft=startLeft+e.clientX-startX;
            let newTop=startTop+e.clientY-startY;
            if(newTop<0)newTop=0;
            if(newTop>window.innerHeight-30)newTop=window.innerHeight-30;
            if(newLeft<-200)newLeft=-200;
            if(newLeft>window.innerWidth-100)newLeft=window.innerWidth-100;
            win.style.left=newLeft+'px';win.style.top=newTop+'px';
        });
        document.addEventListener('mouseup',()=>isDragging=false);
    },
    close: function(appId,btn){
        const win=this.windows[appId];
        if(win){
            win.remove();delete this.windows[appId];
            const tbItem=document.getElementById(`tb-${appId}`);
            if(tbItem)tbItem.remove();
            if(this.activeWindow===appId){
                 const remaining=Object.keys(this.windows);
                 if(remaining.length>0)this.setActive(remaining[remaining.length-1]);
                 else this.activeWindow=null;
            }
        }
    },
    startSnake: function(win){
        const canvas=win.querySelector('#snake-canvas');if(!canvas)return;
        const ctx=canvas.getContext('2d');const scoreEl=win.querySelector('#snake-score');
        let box=20;let snake=[];snake[0]={x:9*box,y:10*box};
        let food={x:Math.floor(Math.random()*15)*box,y:Math.floor(Math.random()*15)*box};
        let d;let score=0;let game;
        const preventScroll=(e)=>{if(this.activeWindow==='snake'&&[37,38,39,40].indexOf(e.keyCode)>-1){e.preventDefault();}};
        window.addEventListener('keydown',preventScroll,false);
        const direction=(event)=>{
            if(this.activeWindow!=='snake')return;
            let key=event.keyCode;
            if(key==37&&d!="RIGHT")d="LEFT";else if(key==38&&d!="DOWN")d="UP";
            else if(key==39&&d!="LEFT")d="RIGHT";else if(key==40&&d!="UP")d="DOWN";
        };
        document.addEventListener('keydown',direction);
        function draw(){
            ctx.fillStyle="black";ctx.fillRect(0,0,300,300);
            for(let i=0;i<snake.length;i++){
                ctx.fillStyle=i==0?"#22c55e":"#16a34a";
                ctx.fillRect(snake[i].x,snake[i].y,box,box);
                ctx.strokeStyle="black";ctx.strokeRect(snake[i].x,snake[i].y,box,box);
            }
            ctx.fillStyle="red";ctx.fillRect(food.x,food.y,box,box);
            let snakeX=snake[0].x;let snakeY=snake[0].y;
            if(d=="LEFT")snakeX-=box;if(d=="UP")snakeY-=box;if(d=="RIGHT")snakeX+=box;if(d=="DOWN")snakeY+=box;
            if(snakeX==food.x&&snakeY==food.y){
                score++;scoreEl.innerText=score;food={x:Math.floor(Math.random()*15)*box,y:Math.floor(Math.random()*15)*box};
            }else{snake.pop();}
            let newHead={x:snakeX,y:snakeY};
            if(snakeX<0||snakeX>=300||snakeY<0||snakeY>=300||collision(newHead,snake)){
                clearInterval(game);ctx.fillStyle="white";ctx.font="20px Courier New";ctx.fillText("GAME OVER",90,150);return;
            }
            snake.unshift(newHead);
        }
        function collision(head,array){
            for(let i=0;i<array.length;i++){if(head.x==array[i].x&&head.y==array[i].y)return true;}
            return false;
        }
        game=setInterval(draw,100);
        const closeBtn=win.querySelector('.close');
        closeBtn.onclick=(e)=>{
             clearInterval(game);document.removeEventListener('keydown',direction);
             window.removeEventListener('keydown',preventScroll);WindowManager.close('snake',closeBtn);
        };
    }
};
