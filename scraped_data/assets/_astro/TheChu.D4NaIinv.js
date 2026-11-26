import{r as e,t}from"./PaperPreview.Badw0miv.js";import{n,t as r}from"./fonts.ETLTDK-W.js";import{n as i,r as a}from"./hooks.DxbccWXy.js";import{n as o,r as s,t as c}from"./text.DosMA7M_.js";import{c as l,n as u,o as d,r as f,s as p,t as m}from"./ui.BYqHN-4Y.js";var h={text:`a
ă
â
b
c
d
đ
e`,per:8,cas:`thuong`,font:`Andika`,color:!0,back:!1},g=[`#fee2e2`,`#fef3c7`,`#d1fae5`,`#dbeafe`,`#ede9fe`,`#fce7f3`],_=[`#ef4444`,`#f59e0b`,`#10b981`,`#3b82f6`,`#8b5cf6`,`#ec4899`],v={"Bảng chữ cái":`a
ă
â
b
c
d
đ
e
ê
g
h
i
k
l
m
n
o
ô
ơ
p
q
r
s
t
u
ư
v
x
y`,"Vần cơ bản":`an
ăn
ân
en
ên
in
on
ôn
ơn
un
ưn
am
ăm
âm
em
êm
im
om
ôm
ơm
um`,"Vần có đuôi ng, nh":`ang
ăng
âng
eng
ong
ông
ung
ưng
inh
ênh
anh`,"Số 0 đến 20":Array.from({length:21},(e,t)=>String(t)).join(`
`),"Tiếng Anh: màu sắc":`red | đỏ
blue | xanh dương
green | xanh lá
yellow | vàng
black | đen
white | trắng
pink | hồng
orange | cam`,"Tiếng Anh: con vật":`cat | con mèo
dog | con chó
bird | con chim
fish | con cá
duck | con vịt
pig | con heo
cow | con bò
hen | con gà mái`},y=(e,t)=>t===`hoa`?e.toLocaleUpperCase(`vi`):t===`ca`?`${e.toLocaleUpperCase(`vi`)} ${e}`:e;async function b(t){let r=t.text.split(`
`).map(e=>e.trim()).filter(Boolean);if(!r.length)return[];await n([{family:t.font,weight:400},{family:`Be Vietnam Pro`,weight:400}]);let i=e.A4,a=o(t.font),l=t.per===12?3:2,u=t.per/l,d=(i.w-16)/l,f=(i.h-16)/u,p=[];for(let e=0;e<r.length;e+=t.per){let n=r.slice(e,e+t.per);p.push(r=>{n.forEach((n,i)=>{let[o,u]=n.split(`|`).map(e=>e.trim()),p=i%l,m=Math.floor(i/l),h=8+p*d,v=8+m*f,b=(e+i)%g.length;r.save(),t.color&&(r.fillStyle=g[b],s(r,h+2,v+2,d-4,f-4,5),r.fill()),r.setLineDash([2,2]),r.strokeStyle=t.color?_[b]:`#9ca3af`,r.lineWidth=.4,s(r,h+2,v+2,d-4,f-4,5),r.stroke(),r.setLineDash([]);let x=u?o:y(o,t.cas),S=Math.min(f*(u?.34:.5),90),C=c(x,d-14,S,a,8);r.fillStyle=`#111827`,r.textAlign=`center`,r.font=`400 ${C}px "${t.font}"`;let w=v+f/2+(u?-f*.04:0)+C*.3;if(r.fillText(x,h+d/2,w),u){let e=c(u,d-14,Math.min(f*.12,16),a,4);r.fillStyle=`#4b5563`,r.font=`400 ${e}px "Be Vietnam Pro"`,r.fillText(u,h+d/2,v+f*.78)}r.restore()})})}return p}function x(){let[n,o,s]=a(`the-chu`,h),c=i(n,b,250);return l(`div`,{class:`tool-layout`,children:[l(`aside`,{class:`panel panel-sticky no-print`,children:[l(f,{title:`Nội dung thẻ`,children:[l(`div`,{class:`chips`,style:{justifyContent:`flex-start`,marginBottom:`8px`},children:Object.keys(v).map(e=>l(`button`,{class:`btn ghost small`,type:`button`,onClick:()=>o({text:v[e]}),children:e}))}),l(u,{label:`Mỗi dòng một thẻ`,hint:`Muốn có dòng nghĩa nhỏ phía dưới, viết: english | tiếng Việt`,children:l(`textarea`,{rows:9,value:n.text,onInput:e=>o({text:e.target.value})})})]}),l(f,{title:`Kiểu thẻ`,children:[l(u,{label:`Số thẻ mỗi trang A4`,children:l(d,{value:n.per,onChange:e=>o({per:e}),options:[{value:4,label:`4`},{value:6,label:`6`},{value:8,label:`8`},{value:12,label:`12`}]})}),l(u,{label:`Kiểu chữ`,children:l(d,{value:n.cas,onChange:e=>o({cas:e}),options:[{value:`thuong`,label:`thường`},{value:`hoa`,label:`HOA`},{value:`ca`,label:`Hoa + thường`}]})}),l(u,{label:`Font`,children:l(p,{value:n.font,onChange:e=>o({font:e}),options:r.map(e=>({value:e.id,label:e.label}))})}),l(m,{checked:n.color,onChange:e=>o({color:e}),label:`Tô nền màu nhạt cho mỗi thẻ`})]}),l(`button`,{class:`btn ghost small`,type:`button`,onClick:s,children:`Về mặc định`})]}),l(t,{pages:c,size:e.A4,filename:`the-chu-hoclieu.pdf`,previewLimit:2})]})}export{x as default};