 //提交
 let message = document.getElementById('message');
 document.addEventListener("keydown", function (e) {
     //可以判断是不是mac，如果是mac,ctrl变为花键
     if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
         e.preventDefault();
         var info = document.getElementsByName('message').values
         console.log(info);
         if (info == undefined) {
             alert('请勿提交空数据')
             return;
         }
         console.log('提交保存');
         let but = document.getElementById('submit')
         but.click();
     }
 }, false);
 //问好
 var dd = new Date();
 var st = document.getElementById("hid");
 var hour = dd.getHours();//获取当前时
 if (hour > 0 && hour <= 5) {
     st.innerHTML = "夜猫子，该休息了";
 } else if (hour > 5 && hour <= 8) {
     st.innerHTML = "——上午好";
 } else if (hour > 8 && hour <= 10) {
     st.innerHTML = "——早上好";
 } else if (hour > 10 && hour <= 14) {
     st.innerHTML = "——中午好";
 } else if (hour > 14 && hour <= 17) {
     st.innerHTML = "——下午好";
 } else if (hour > 17 && hour <= 20) {
     st.innerHTML = "——傍晚好";
 } else if (hour > 20 && hour <= 23) {
     st.innerHTML = "——晚上好";
 }
 //加点颜文字
 const cuteEmoticonsMatrix =
     ["(◕‿◕)", "(◠‿◠)", "(◡‿◡)",
         "(◕ᴗ◕)", "(◉‿◉)", "(◕ᴥ◕)",
         "(´• ω •`)", "(´｡• ω •｡`)", "(´｡• ᵕ •｡`)",
         "(´• ᴗ •`)"]
 var emoji = cuteEmoticonsMatrix[random()];
 st.innerHTML += emoji;
 // 随机数
 function random() {
     var x = Math.floor(Math.random() * 10);
     return x;
 }