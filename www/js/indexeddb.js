/**
 * TODO:IndexedDB_Common.jsに後程命名する。
 */
var hogehoge = 'ver 1.000.000';

/**
 * データベースの新規作成
 * @param {string} dbName     : 新規作成するデータベース名
 * @param {string} dbver      : DBのバージョン
 */
var CreateDB = function(dbName, dbVer){
	// DBに接続
	var dbRequest = indexedDB.open(dbName, dbVer);
  dbRequest.onsuccess = function(event){
    DebugAlert('DBの作成に成功しました。');
    var db = event.target.result;
    db.close();
    return 0;
	}
	dbRequest.onerror = function(event){
    DebugAlert('DBの接続に失敗しました。');
    return -1;
	}
}

/**
 * テーブルの新規作成
 * @param {string} dbName     : データベース名
 * @param {string} dbVer      : DBのバージョン
 * @param {string} tableName  : 新規作成するテーブル名
 * @param {string} key        : 主キーを指定
 */
var CreateTable = function(dbName, dbVer, tableName, key){
  // 入力チェック
  if(tableName == ""){
    DebugAlert('テーブル名に空白文字は無効です');
    return -2;
  }
	var dbRequest = indexedDB.open(dbName,dbVer);
  dbRequest.onupgradeneeded = function(event){
    // DBのバージョン変更が発生した場合実行
    var db = event.target.result;
    if(tableName){
      // DBにテーブルを追加します。
      db.createObjectStore(tableName, {keyPath : key})
      DebugAlert('DBにテーブルを追加しました。テーブル名 : ' + tableName + ' / keyPath : ' + key);
    }
	}
  dbRequest.onsuccess = function(event){
    var db = event.target.result;
    // DBVersionを更新
    dbversion = dbVer;
    db.close();
  }
  dbRequest.onerror = function(event){
    DebugAlert('DBの接続に失敗しました。');
    return -1;
  }
  // 正常終了
  return 0;
}

/**
 * テーブルの削除
 * @param {string} dbName     :DBの名前
 */
var DropDB = function(dbName){
  var deleteReq = indexedDB.deleteDatabase(dbName);
  deleteReq.onsuccess = function(event){
    DebugAlert('DBの削除に成功しました。');
    // 存在しないDB名を指定してもこっちが実行される
  }
  deleteReq.onerror = function(){
    DebugAlert('DBの削除に失敗しました。');
  }
  // DBVersionをリセット
  dbversion = 1;
}

/**
 * レコードの挿入
 * @param {string} dbName     : データベース名
 * @param {string} tableName  : テーブル名
 * @param {string} date       : 挿入するデータを指定
 */
var Insert = function(dbName, tableName, data){
	// DBに接続
	var dbRequest = indexedDB.open(dbName);
  dbRequest.onsuccess = function(event){
    var db = event.target.result;
    // テーブルが読み書き可能であることを宣言している。
    var trans = db.transaction(tableName, 'readwrite');
    var table = trans.objectStore(tableName);

    // テーブルにデータを追加
    var putRequest = table.put(data);
    DebugAlert("データを挿入しました");
    db.close();
	}
	dbRequest.onerror = function(event){
    DebugAlert('DBの接続に失敗しました。');
    return -1;
	}
  // 正常終了
  return 0;  
}

/**
 * 指定したDBに接続して、データを取得します。
 * 指定したキーに紐づくデータを取得します。
 * @param {string} dbName
 * @param {string} tabelName
 * @param {string} id
 */
var getValue = function(dbName, tableName, id){
	// DBに接続
	var dbRequest = indexedDB.open(dbName);

  dbRequest.onsuccess = function(event){
    var db = event.target.result;
    // userテーブルが読み書き可能であることを宣言している。
    var transaction = db.transaction(tableName);
    var store = transaction.objectStore(tableName);
    
    // データを取得
    var result = store.get(1);
    result.onsuccess = function(event) {
      var record = event.target.result;
      var str = "";

      if (record) {
        Object.keys(record).forEach(function (abc) {
          console.log("キー : " + key + ", 値 : " + record[abc]);
          str += record[abc] + "," ;
        });
        DebugAlert(str);
        console.log("");
      }
    };

    db.close();
  }
	dbRequest.onerror = function(event){
	    console.log('DBの接続に失敗しました。');
	}
}

/**
 * 指定したDBに接続して、全データを取得します。
 * @param {string} dbName
 * @param {string} tabelName
 */
var getAllValue = function(dbName, tableName){
	// DBに接続
	var dbRequest = indexedDB.open(dbName);

  dbRequest.onsuccess = function(event){
    var db = event.target.result;
    // トランザクション指定
    var trans = db.transaction(tableName);
    // テーブル指定
    var store = trans.objectStore(tableName);
    
    // 全件取得
    store.openCursor().onsuccess = function(event) {
      const record = event.target.result;
      var str = "";
      if (record) {
        for (key in record.value){
          str += key + " : " + record.value[key] + "\n";
        }
        alert(str);
        console.log(str);
        record.continue();
      }
    };
    //DB Close
    db.close();
  }
	dbRequest.onerror = function(event){
    console.log('DBの接続に失敗しました。');
	}
}

/**
 * HealthScoringMasterDBのセットアップ
 */
var IndexedDBSetup = function(){
  // 健康スコアリング_マスタ_データベース
  var dbname = "HealthScoringMasterDB";
  var dbversion = 1;
  // 健康変数マスタ・テーブル
  var tableName = "HealthMaster";
  var key = 'HealthNo';

  // テスト：セッティング・既存のDBを削除
  DropDB(dbname);

  // データベースの作成
  if(CreateDB(dbname, dbversion)==-1){
    DebugAlert("DBの作成に失敗しました!!");
    return ;
  };

  // テーブルの作成
  if(CreateTable(dbname, Number(dbversion) + 1, tableName, key)==-1){
    DebugAlert("テーブルの作成に失敗しました!!");
    return ;
  };

  // 健康変数マスタ・レコードの用意
  var HM_Rec1 = {
    HealthNo : 1,
    HealthName : '温度',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "True",
    ImpactDate : 1,
  };
  var HM_Rec2 = {
    HealthNo : 2,
    HealthName : '湿度',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec3 = {
    HealthNo : 3,
    HealthName : '降水量',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec4 = {
    HealthNo : 4,
    HealthName : '勤務時間',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec5 = {
    HealthNo : 5,
    HealthName : '座りっぱなし回数',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec6 = {
    HealthNo : 6,
    HealthName : '入浴時間',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec7 = {
    HealthNo : 7,
    HealthName : '睡眠時間',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec8 = {
    HealthNo : 8,
    HealthName : '歩数',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec9 = {
    HealthNo : 9,
    HealthName : 'スマホ操作時間',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec10 = {
    HealthNo : 10,
    HealthName : 'アルコール飲酒量',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };

  // レコードの追加
  Insert(dbname, tableName, HM_Rec1);
  Insert(dbname, tableName, HM_Rec2);
  Insert(dbname, tableName, HM_Rec3);
  Insert(dbname, tableName, HM_Rec4);
  Insert(dbname, tableName, HM_Rec5);
  Insert(dbname, tableName, HM_Rec6);
  Insert(dbname, tableName, HM_Rec7);
  Insert(dbname, tableName, HM_Rec8);
  Insert(dbname, tableName, HM_Rec9);
  Insert(dbname, tableName, HM_Rec10);

}

/**
 * 
 */
function EntryDate(){
  // 入力チェック
  if (document.getElementById( "HealthNo1" ).value == ""){
      return false;    //送信ボタン本来の動作をキャンセルします
  }

  // 健康データ登録
  DebugAlert("HealthNo:" + document.getElementById( "HealthNo1" ).value );

  return true;
}
