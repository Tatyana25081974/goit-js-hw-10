import"./assets/modulepreload-polyfill-B5Qt9EMX.js";import{i as o,f as l}from"./assets/vendor-BbSUbo7J.js";const s={deadline:null,intervalId:null,elements:{days:document.querySelector("[data-days]"),hours:document.querySelector("[data-hours]"),minutes:document.querySelector("[data-minutes]"),seconds:document.querySelector("[data-seconds]")},start(){this.deadline&&(this.isPaused&&(this.deadline=new Date(Date.now()+this.remainingTime),this.isPaused=!1),this.intervalId=setInterval(()=>{const e=this.deadline-Date.now();if(e<=0){this.stop(),this.updateUI({days:0,hours:0,minutes:0,seconds:0}),o.success({title:"Success",message:"Countdown completed!",position:"topRight"}),document.getElementById("alarm-sound").play();return}this.remainingTime=e;const t=this.getTimeComponents(e);this.updateUI(t)},1e3))},stop(){clearInterval(this.intervalId),this.intervalId=null},setDeadline(e){this.deadline=e},getTimeComponents(e){const d=Math.floor(e/864e5),i=Math.floor(e%864e5/36e5),r=Math.floor(e%864e5%36e5/6e4),u=Math.floor(e%864e5%36e5%6e4/1e3);return{days:d,hours:i,minutes:r,seconds:u}},pad(e){return String(e).padStart(2,"0")},updateUI({days:e,hours:t,minutes:n,seconds:a}){this.elements.days.textContent=this.pad(e),this.elements.hours.textContent=this.pad(t),this.elements.minutes.textContent=this.pad(n),this.elements.seconds.textContent=this.pad(a)}};l("#datetime-picker",{enableTime:!0,time_24hr:!0,defaultDate:new Date,minuteIncrement:1,onClose(e){const t=e[0],n=document.querySelector("button[data-start]");t<=new Date?(o.error({title:"Error",message:"Please choose a date in the future",position:"topRight"}),n.disabled=!0):(s.setDeadline(t),n.disabled=!1)}});document.querySelector("button[data-start]").addEventListener("click",()=>{s.start(),document.getElementById("datetime-picker").disabled=!0,document.querySelector("button[data-start]").disabled=!0,document.querySelector("button[data-pause]").disabled=!1});document.querySelector("button[data-pause]").addEventListener("click",()=>{s.isPaused?(s.start(),document.querySelector("button[data-pause]").textContent="Pause"):(clearInterval(s.intervalId),s.isPaused=!0,document.querySelector("button[data-pause]").textContent="Resume")});
//# sourceMappingURL=3-timer.js.map
