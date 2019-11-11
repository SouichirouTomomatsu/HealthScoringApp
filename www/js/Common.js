// This is a JavaScript file

// デバッグモードを指定する
// 画面にエラーメッセージを出力
var debug = true;

var DebugAlert = function(ErrorMessage){
  if( debug ){
    alert(ErrorMessage);
  }
}