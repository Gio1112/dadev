window.LinuxOS={
    boot:function(){
        const osEl=document.getElementById('linux-os');const bootScreen=document.getElementById('linux-boot-screen');
        const desktop=document.getElementById('linux-desktop');const log=document.getElementById('linux-boot-log');
        osEl.classList.add('active');bootScreen.style.display='block';desktop.style.display='none';log.innerHTML='';
        const bootLines=["[ OK ] Started Adjust Time.","[ OK ] Started Kernel Modules.","[ OK ] Reached target Local File Systems.","[ OK ] Reached target System Initialization.","[ OK ] Started D-Bus System Message Bus.","[ OK ] Started Network Manager.","[ OK ] Reached target Network.","[ OK ] Reached target Multi-User System.","[ OK ] Reached target Graphical Interface.","Starting Genome Desktop Manager...","Welcome to Ubuntu 26.04 LTS"];
        let i=0;
        const interval=setInterval(()=>{
            if(i>=bootLines.length){
                clearInterval(interval);setTimeout(this.showDesktop.bind(this),800);
            }else{
                const line=document.createElement('div');
                line.textContent=bootLines[i];
                if(bootLines[i].includes('[ OK ]')){line.style.color='#22c55e';}
                log.appendChild(line);window.scrollTo(0,document.body.scrollHeight);i++;
            }
        },120);
    },
    showDesktop:function(){
        document.getElementById('linux-boot-screen').style.display='none';
        document.getElementById('linux-desktop').style.display='block';
        if(window.audioManager)window.audioManager.play('linuxStartup');
        this.fetchVisitorCount();this.typewriter();
    },
    fetchVisitorCount:async function(){
        const counterEl=document.querySelector('#linux-desktop .visitor-counter');
        if(!counterEl)return;counterEl.innerText="Connecting...";
        try{
            const res=await fetch("https://api.counterapi.dev/v1/giorgio-is-a-dev/visits/up");
            if(!res.ok)throw new Error("API Error");
            const data=await res.json();counterEl.innerText=`${data.count} visitors`;
        }catch(e){console.error(e);counterEl.innerText="Offline Mode";}
    },
    typewriter:function(){
        const prompt=document.querySelector('#linux-os .prompt');const text="./init_portfolio.sh --verbose";
        let i=0;prompt.textContent="";
        const typeInterval=setInterval(()=>{
            if(i<text.length){prompt.textContent+=text.charAt(i);i++;}else{clearInterval(typeInterval);this.runScript();}
        },40);
    },
    runScript:async function(){
        const container=document.getElementById('terminal-content');
        container.innerHTML='<div class="mt-2 text-green-400">Executing startup script...</div>';
        const delay=(ms)=>new Promise(r=>setTimeout(r,ms));
        const print=(html)=>{const div=document.createElement('div');div.innerHTML=html;container.appendChild(div);window.scrollTo(0,document.body.scrollHeight);};
        await delay(400);print('<div class="text-gray-500 font-mono text-sm">[INFO] Initializing environment... OK</div>');
        await delay(200);print('<div class="text-gray-500 font-mono text-sm">[INFO] Loading user profile... OK</div>');
        await delay(200);print('<div class="text-gray-500 font-mono text-sm">[INFO] Fetching github repositories... OK</div>');
        await delay(600);
        print(`<div class="mb-6 pt-4 border-t border-gray-800"><div class="text-yellow-400 font-bold font-mono uppercase tracking-wider mb-2">>> User Configuration (About)</div><div class="text-gray-300 ml-4 border-l-2 border-yellow-600 pl-3"><p>Passionate developer specializing in Discord bots and web applications.</p><p>Combining aviation knowledge with coding skills to build immersive tools.</p></div></div>`);
        await delay(600);
        print(`<div class="mb-6"><div class="text-blue-400 font-bold font-mono uppercase tracking-wider mb-2">>> Loaded Modules (Skills)</div><div class="text-gray-300 ml-4 grid grid-cols-2 gap-x-4 gap-y-1 max-w-lg font-mono text-sm"><span>[X] JavaScript (ES6+)</span><span>[X] TypeScript</span><span>[X] Python 3</span><span>[X] React / Next.js</span><span>[X] Discord.js</span><span>[X] Tailwind CSS</span></div></div>`);
        await delay(600);
        print(`<div class="mb-6"><div class="text-green-400 font-bold font-mono uppercase tracking-wider mb-2">>> Mounted Projects</div><div class="ml-4 space-y-3 font-mono"><div class="group cursor-pointer hover:bg-gray-800 p-1 -ml-1 rounded transition-colors" onclick="window.open('https://github.com/Gio1112', '_blank')"><div class="text-purple-400 font-bold">atmos_rewards/ <span class="text-xs text-gray-500 ml-2 font-normal">[dir]</span></div><div class="text-gray-400 text-sm pl-2"> PTFS Aviation Loyalty System</div></div><div class="group cursor-pointer hover:bg-gray-800 p-1 -ml-1 rounded transition-colors" onclick="window.open('https://github.com/Gio1112/korean-air', '_blank')"><div class="text-purple-400 font-bold">korean_air_web.js <span class="text-xs text-gray-500 ml-2 font-normal">[file]</span></div><div class="text-gray-400 text-sm pl-2"> Full stack booking mock application</div></div><div class="group cursor-pointer hover:bg-gray-800 p-1 -ml-1 rounded transition-colors" onclick="window.open('https://giorgio.is-a.dev/swiss', '_blank')"><div class="text-purple-400 font-bold">swiss_air_web.ts <span class="text-xs text-gray-500 ml-2 font-normal">[file]</span></div><div class="text-gray-400 text-sm pl-2"> Next.js frontend rebuild</div></div><div class="group cursor-pointer hover:bg-gray-800 p-1 -ml-1 rounded transition-colors"><div class="text-purple-400 font-bold">ba_helpdesk.py <span class="text-xs text-gray-500 ml-2 font-normal">[file]</span></div><div class="text-gray-400 text-sm pl-2"> Automation utilities & scripts</div></div></div></div>`);
        await delay(400);
        print(`<div class="mb-6 border-b border-gray-800 pb-4"><div class="text-red-400 font-bold font-mono uppercase tracking-wider mb-2">>> Communication Channels</div><div class="ml-4 text-gray-300 font-mono text-sm space-y-1"><div><span class="text-gray-500">Email:</span> <a href="mailto:giorgiodabest1@gmail.com" class="hover:text-white underline">giorgiodabest1@gmail.com</a></div><div><span class="text-gray-500">Discord:</span> giorgiodabest</div><div><span class="text-gray-500">GitHub:</span> <a href="https://github.com/Gio1112" target="_blank" class="hover:text-white underline">github.com/Gio1112</a></div></div></div>`);
        await delay(200);
        print('<div class="text-green-500 font-bold">Script finished successfully.</div>');
        this.enableInteractiveShell();
    },
    enableInteractiveShell:function(){
        const container=document.getElementById('terminal-content');
        const inputContainer=document.createElement('div');
        inputContainer.innerHTML='<div id="active-prompt" class="mt-4 flex items-center"><span class="text-green-500">root@giorgio</span>:<span class="text-blue-500">~</span>$&nbsp;<input type="text" id="linux-cmd-input" class="bg-transparent border-none outline-none text-green-300 w-full font-mono" autocomplete="off" autofocus spellcheck="false"></div>';
        container.appendChild(inputContainer);
        const input=inputContainer.querySelector('input');input.focus();window.scrollTo(0,document.body.scrollHeight);
        const refocus=()=>{const linux=document.getElementById('linux-os');const sel=window.getSelection().toString();if(linux&&linux.classList.contains('active')&&!sel)input.focus();};
        document.addEventListener('click',refocus);
        input.addEventListener('keydown',(e)=>{
            if(e.key==='Enter'){
                const cmd=input.value.trim().toLowerCase();
                const promptDiv=document.getElementById('active-prompt');
                if(promptDiv){
                    promptDiv.removeAttribute('id');
                    promptDiv.innerHTML=`<span class="text-green-500">root@giorgio</span>:<span class="text-blue-500">~</span>$&nbsp;<span class="text-gray-300">${input.value}</span>`;
                }
                if(cmd==='reboot'||cmd==='exit'){window.rebootSystem('linux');return;}
                else if(cmd==='clear'){container.innerHTML='';}
                else if(cmd!==''){
                    const error=document.createElement('div');error.className="text-gray-400 my-1";error.innerText="Interactive mode disabled. Type 'reboot' to exit.";container.appendChild(error);
                }
                this.enableInteractiveShell();document.removeEventListener('click',refocus);
            }
        });
    }
};
