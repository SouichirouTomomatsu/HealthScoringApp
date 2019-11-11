// ナビゲーションメニュー（SplingMenuバー）のメソッド
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
 * ナビゲーションメニュー遷移時のロードイベント
 */
document.addEventListener('init', function(event) {

  var page = event.target;
 
  switch (page.id){
    case 'InputData':
      // InputDataがロードされた時に実行されるプログラム
      // 本日日付を取得しカレンダーにセット
      var date = new Date();
      var yyyy = date.getFullYear();
      var mm = ("0"+(date.getMonth()+1)).slice(-2);
      var dd = ("0"+date.getDate()).slice(-2);
      document.getElementById("SelectDate").value = yyyy+"-"+mm+"-"+dd;
      break;

    case 'scoring':
      // scoringがロードされた時に実行されるプログラム
      alert("テスト");
      break;

    case 'home':
      // homeがロードされた時に実行されるプログラム    
      break;
  }
});
