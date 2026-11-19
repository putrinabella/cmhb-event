import{c as o}from"./createLucideIcon-D0bWaWtv.js";/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],u=o("calendar",c);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],g=o("clock",i);function m(t,s=!1){if(!t)return"";const e=typeof t=="string"?new Date(t):t;if(isNaN(e.getTime()))return"";const a=s?["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];return`${e.getDate()} ${a[e.getMonth()]} ${e.getFullYear()}`}function y(t){const s=new Date(t),e=new Date;s.setHours(0,0,0,0),e.setHours(0,0,0,0);const n=Math.ceil((s.getTime()-e.getTime())/(1e3*60*60*24));let r="",a="text-neutral";return n>0?(r=`H-${n}`,a="text-success"):n===0?(r="D-Day",a="text-primary font-semibold"):(r=`H+${Math.abs(n)}`,a="text-error"),{statusLabel:r,statusColor:a}}export{u as C,g as a,y as b,m as g};
