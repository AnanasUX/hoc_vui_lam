import{a as e,n as t,r as n,t as r}from"./PaperPreview.Badw0miv.js";import{n as i,t as a}from"./fonts.ETLTDK-W.js";import{n as o,r as s}from"./hooks.DxbccWXy.js";import{a as c,n as l}from"./text.DosMA7M_.js";import{a as u,c as d,i as f,n as p,o as m,r as h,s as g,t as _}from"./ui.BYqHN-4Y.js";var v={text:`cat
dog
bird
fish`,names:``,font:`Andika`,unit:6,mode:`mo`,mo:65,color:`den`,repeat:!0,firstSolid:!0,rowsPerItem:1,blankRows:1,header:!0,title:`English handwriting`},y=`abcdefghijklmnopqrstuvwxyz`.split(``),b=[{label:`Chữ cái thường a–z`,text:y.join(`
`),patch:{rowsPerItem:1,blankRows:0}},{label:`Chữ cái HOA A–Z`,text:y.map(e=>e.toUpperCase()).join(`
`),patch:{rowsPerItem:1,blankRows:0}},{label:`Aa Bb Cc…`,text:y.map(e=>e.toUpperCase()+e).join(`
`),patch:{rowsPerItem:1,blankRows:0}},{label:`Số 1–10 (chữ)`,text:`one
two
three
four
five
six
seven
eight
nine
ten`,patch:{rowsPerItem:1,blankRows:0}},{label:`Màu sắc`,text:`red
blue
green
yellow
black
white
pink
orange
brown
purple`,patch:{rowsPerItem:1,blankRows:0}},{label:`Con vật`,text:`cat
dog
bird
fish
duck
pig
cow
rabbit
monkey`,patch:{rowsPerItem:1,blankRows:0}},{label:`Đồ dùng học tập`,text:`book
pen
pencil
ruler
bag
rubber
desk
chair`,patch:{rowsPerItem:1,blankRows:0}},{label:`Gia đình`,text:`mother
father
brother
sister
grandmother
grandfather`,patch:{rowsPerItem:1,blankRows:0}},{label:`Câu chào hỏi`,text:`Hello, I am Lan.
How are you?
I am fine, thank you.
What is your name?
My name is Nam.`,patch:{rowsPerItem:2,blankRows:1}}];async function x(r){let a=r.text.split(`
`).map(e=>e.trim()).filter(Boolean);if(await i([{family:r.font,text:r.text},{family:`Be Vietnam Pro`,weight:400},{family:`Be Vietnam Pro`,weight:600}]),!a.length)return[];let o=n.A4,s=r.unit,u=s*3+s*.9,d=document.createElement(`canvas`).getContext(`2d`);d.font=`400 100px "${r.font}"`;let f=s/((d.measureText(`x`).actualBoundingBoxAscent||50)/100),p=l(r.font),m=15.5,h=o.w-14-1,g=h-m,_=Math.max(4,s*1.1),v=[];for(let e of a){for(let t of c(e,g,f,p)){let e=r.repeat&&p(t,f)*2+_<=g;for(let n=0;n<r.rowsPerItem;n++)v.push({text:t,solid:r.firstSolid&&n===0,repeat:e})}for(let e=0;e<r.blankRows;e++)v.push({text:null,solid:!1,repeat:!1})}let y=r.header?r.title?30:20:12,b=Math.max(1,Math.floor((o.h-y-12)/u)),x=Math.max(1,Math.floor((o.h-14-12)/u)),S=[],C=0;for(S.push(v.slice(C,C+=b));C<v.length;)S.push(v.slice(C,C+=x));let w=t[r.color]?.hex??t.den.hex,T=1-r.mo/100,E=(e,t,n,i,a)=>{e.save(),e.font=`400 ${f}px "${r.font}"`,e.textBaseline=`alphabetic`,e.lineJoin=`round`,a?(e.fillStyle=`#111827`,e.fillText(t,n,i)):r.mode===`mo`?(e.globalAlpha=T,e.fillStyle=w,e.fillText(t,n,i)):r.mode===`cham`?(e.globalAlpha=Math.min(1,T*1.3),e.strokeStyle=w,e.lineWidth=.38,e.lineCap=`round`,e.setLineDash([.001,.95]),e.strokeText(t,n,i)):(e.globalAlpha=Math.min(1,T*1.3),e.strokeStyle=w,e.lineWidth=.28,e.strokeText(t,n,i)),e.restore()},D=(e,t)=>{e.save(),e.lineWidth=.28,[t,t+s,t+2*s,t+3*s].forEach((t,n)=>{e.strokeStyle=n===2?`#2563eb`:`#60a5fa`,e.lineWidth=n===2?.4:.28,e.setLineDash(n===1?[1.4,1.2]:[]),e.beginPath(),e.moveTo(14,t),e.lineTo(o.w-14,t),e.stroke()}),e.restore()},O=(t,n,i)=>a=>{let c=12;n&&r.header?(e(a,{title:r.title,name:i,x0:14,x1:o.w-14,y:10}),c=y):n||(c=14),t.forEach((e,t)=>{let n=c+t*u;if(D(a,n),!e.text)return;let r=n+2*s,i=p(e.text,f),o=m,l=0;do E(a,e.text,o,r,e.solid&&l===0),o+=i+_,l++;while(e.repeat&&o+i<=h+.5)})},k=r.names.split(`
`).map(e=>e.trim()).filter(Boolean).slice(0,60),A=k.length?k:[``],j=[];for(let e of A)S.forEach((t,n)=>j.push(O(t,n===0,e)));return j}function S(){let[e,i,c]=s(`tap-viet-anh`,v),l=o(e,x),y=e.names.split(`
`).filter(e=>e.trim()).length;return d(`div`,{class:`tool-layout`,children:[d(`aside`,{class:`panel panel-sticky no-print`,children:[d(h,{title:`Nội dung`,children:[d(`div`,{class:`chips`,children:b.map(e=>d(`button`,{class:`chip`,type:`button`,onClick:()=>i({text:e.text,...e.patch}),children:e.label}))}),d(p,{label:`Từ hoặc câu cần tập viết`,hint:`Mỗi dòng là một mẫu. Câu dài sẽ tự xuống dòng.`,children:d(`textarea`,{rows:5,value:e.text,onInput:e=>i({text:e.target.value})})}),d(p,{label:`Font chữ`,hint:`Andika và Quicksand là chữ in rõ ràng, phù hợp học sinh mới học viết tiếng Anh.`,children:d(g,{value:e.font,onChange:e=>i({font:e}),options:a.map(e=>({value:e.id,label:e.label}))})}),d(p,{label:`Khoảng cách giữa các dòng kẻ`,children:d(m,{value:e.unit,onChange:e=>i({unit:e}),options:[{value:5,label:`5 mm`},{value:6,label:`6 mm`},{value:7,label:`7 mm`},{value:8,label:`8 mm`}]})})]}),d(h,{title:`Nét chữ mẫu`,children:[d(p,{label:`Kiểu nét`,children:d(m,{value:e.mode,onChange:e=>i({mode:e}),options:[{value:`mo`,label:`Tô mờ`},{value:`cham`,label:`Nét chấm`},{value:`vien`,label:`Viền rỗng`}]})}),d(p,{label:`Độ mờ của nét`,children:d(u,{value:e.mo,min:10,max:92,step:1,onChange:e=>i({mo:e}),format:e=>e+`%`})}),d(p,{label:`Màu nét`,children:d(m,{value:e.color,onChange:e=>i({color:e}),options:Object.entries(t).map(([e,t])=>({value:e,label:t.label,color:t.hex}))})}),d(_,{checked:e.firstSolid,onChange:e=>i({firstSolid:e}),label:`Chữ mẫu đầu dòng viết đậm`}),d(_,{checked:e.repeat,onChange:e=>i({repeat:e}),label:`Lặp lại chữ cho đầy dòng`})]}),d(h,{title:`Số dòng`,children:d(`div`,{class:`row2`,children:[d(p,{label:`Dòng cho mỗi mẫu`,children:d(f,{value:e.rowsPerItem,min:1,max:6,onChange:e=>i({rowsPerItem:e})})}),d(p,{label:`Dòng trống sau mẫu`,children:d(f,{value:e.blankRows,min:0,max:5,onChange:e=>i({blankRows:e})})})]})}),d(h,{title:`Tiêu đề và tên bé`,children:[d(_,{checked:e.header,onChange:e=>i({header:e}),label:`Thêm dòng Họ và tên / Lớp`}),e.header&&d(p,{label:`Tiêu đề phiếu (có thể để trống)`,children:d(`input`,{type:`text`,value:e.title,onInput:e=>i({title:e.target.value})})}),e.header&&d(p,{label:`Danh sách tên học sinh (không bắt buộc)`,hint:`Mỗi dòng một bé, mỗi bé một phiếu có tên. Tối đa 60 bé${y?` (đang có ${y})`:``}.`,children:d(`textarea`,{rows:3,value:e.names,onInput:e=>i({names:e.target.value})})})]}),d(`button`,{class:`btn ghost small`,type:`button`,onClick:c,children:`Về mặc định`})]}),d(r,{pages:l,size:n.A4,filename:`tap-viet-tieng-anh-hoclieu.pdf`})]})}export{S as default};