webpackJsonp([15],{139:function(n,e,t){var o=t(1),d=o&&o.__esModule?function(){return o["default"]}:function(){return o};Object.defineProperty(d,"a",{get:d});var i=t(30);d.a.bind()(document).ready(function(){d.a.bind()(".dropdown").dropdown({onChange:function(n){i.a.bind()(n.length,sms_cost)}}),d.a.bind()("#id_content").keyup(function(){var n=d.a.bind()(".delete.icon").length;i.a.bind()(n,sms_cost)})})},30:function(n,e,t){function o(n,e){var t=i.a.bind()("#id_content")[0].value.length,o=Math.ceil(t/160),d="$"+n*o*e;document.getElementById("#send").innerHTML="Send ("+d+")"}var d=t(1),i=d&&d.__esModule?function(){return d["default"]}:function(){return d};Object.defineProperty(i,"a",{get:i}),e.a=o}},[139]);
//# sourceMappingURL=send_adhoc.js.map