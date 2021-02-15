// This is a JavaScript file

// デバッグモードを指定する
// 画面にエラーメッセージを出力
var debug = false;

/**
 * 
 */
var index_Load = function(){

  IndexedDBSetup();
  
  // TODO:暫定・レコードから読み込んでマスタにセットするよう変更する
  var arrHelthMaster = [
    {HealthNo : 1, HealthName:'睡眠'},
    {HealthNo : 2, HealthName:'飲酒'},
    {HealthNo : 3, HealthName:'喫煙本数'}
  ];

  // for(var i=0;i<arrHelthMaster.length;i++){
  //   let op = document.createElement("option");
  //   op.value = arrHelthMaster[i].HealthNo;     //value値
  //   op.text = arrHelthMaster[i].HealthName;    //テキスト値
  //   document.getElementById("HealthSetting").appendChild(op);
  // }
}

/**
 * DebugAlert : デバッグモードにするとアラートを表示する
 * @param {string} debugMessage     デバッグメッセージ
 */
var DebugAlert = function(debugMessage){
  if( debug ){
    alert(debugMessage);
  }
}
