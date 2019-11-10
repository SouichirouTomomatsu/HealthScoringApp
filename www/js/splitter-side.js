// SplingMenuバーのメソッド
// 何をやってるのか。ようわからん
window.fn = {};
window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};
window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content
    .load(page)
    .then(menu.close.bind(menu));
};

/**
 * メニュー遷移時のロードイベント
 */
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'InputData') {
    //InputDataがロードされた時に実行されるプログラム
    var date = new Date();

    var yyyy = date.getFullYear();
    var mm = ("0"+(date.getMonth()+1)).slice(-2);
    var dd = ("0"+date.getDate()).slice(-2);

    document.getElementById("SelectDate").value = yyyy+"-"+mm+"-"+dd;

  } else if (page.id === 'scoring') {
    //scoringがロードされた時に実行されるプログラム
    alert("!!");
  } else if (page.id === 'home') {
    //scoringがロードされた時に実行されるプログラム
    Load("");
  }
});