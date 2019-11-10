/**
 * TODO:IndexedDB_Common.jsに後程命名する。
 */
var hogehoge = 1;

/**
 * DBの新規作成
 * dbName   :DBの名前
 * dbver    :DBのバージョンを指定
 */
var CreateDB = function(dbName, dbVer){
	// DBに接続
	var dbRequest = indexedDB.open(dbName, dbVer);
  dbRequest.onsuccess = function(event){
    alert('DBの作成に成功しました。');
    var db = event.target.result;
    db.close();
    return 0;
	}
	dbRequest.onerror = function(event){
    alert('DBの接続に失敗しました。');
    return -1;
	}
}

/**
 * 
 */
var CreateTable = function(dbName, dbVer, tableName, key){
  // 入力チェック
  if(tableName == ""){
    alert('テーブルに空白文字は無効です');
    return ;
  }
	var dbRequest = indexedDB.open(dbName,dbVer);
  dbRequest.onupgradeneeded = function(event){
    // DBのバージョン変更が発生した場合実行
    var db = event.target.result;
    if(tableName){
      // DBにテーブルを追加します。
      db.createObjectStore(tableName, {keyPath : key})
      alert('DBにテーブルを追加しました。テーブル名 : ' + tableName + ' / keyPath : ' + key);
    }
	}
  dbRequest.onsuccess = function(event){
    var db = event.target.result;
    // DBVersionを更新
    dbversion = dbVer;
    db.close();
    return 0;
  }
  dbRequest.onerror = function(event){
    alert('DBの接続に失敗しました。');
    return -1;
  }
}

/**
 * 
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
    alert("データを挿入しました");
    db.close();
	}
	dbRequest.onerror = function(event){
    alert('DBの接続に失敗しました。');
	}
}

/**
 * 
 */
var DropDB = function(dbName){
  var deleteReq = indexedDB.deleteDatabase(dbName);
  deleteReq.onsuccess = function(event){
    alert('DBの削除に成功しました。');
    // 存在しないDB名を指定してもこっちが実行される
  }
  deleteReq.onerror = function(){
    alert('DBの削除に失敗しました。');
  }
  // DBVersionをリセット
  dbversion = 1;
}

/**
 * 指定したDBに接続して、データを取得します。
 * 指定したキーに紐づくデータを取得します。
 * @param {string} dbName
 * @param {string} tabelName
 * @param {string} key
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
    //( '00000' + id ).slice( -5 )は’00001’という数値で登録されているため桁数を揃えるために使う
    var result = store.get(1);
    result.onsuccess = function(event) {
      var record = event.target.result;
      var str = "";

      if (record) {
        Object.keys(record).forEach(function (abc) {
          console.log("キー : " + key + ", 値 : " + record[abc]);
          str += record[abc] + "," ;
        });
        alert(str);
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
 * 指定したDBに接続して、データを取得します。
 * 指定したキーに紐づくデータを取得します。
 * @param {string} dbName
 * @param {string} tabelName
 * @param {string} key
 */
var getAllValue = function(dbName, tableName, dbver){
	// DBに接続
  var version = dbver;
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
 * 
 */
var Load = function(){
  // 健康スコアリング_マスタ_データベース
  var dbname = "HealthScoringMasterDB";
  var dbversion = 1;

  // 健康変数マスタ・テーブル
  var tableName = "HealthMaster";
  var key = 'HealthNo';

  // 健康変数マスタ・レコード
  var HM_Rec1 = {
    HealthNo : 1,
    HealthName : '睡眠時間',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "True",
    ImpactDate : 1,
  };
  var HM_Rec2 = {
    HealthNo : 2,
    HealthName : '飲酒',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };
  var HM_Rec3 = {
    HealthNo : 3,
    HealthName : '喫煙本数',
    HealthWeight : 30,
    InputFormat : 1,
    IsPrivate : "",
    ImpactDate : 0,
  };

  // セッティング・既存のDBを削除（テスト）
  DropDB(dbname);

  // DBの作成
  if(CreateDB(dbname, dbversion)==-1){
    alert("MISS!!");
    return ;
  };

  // テーブルの作成
  if(CreateTable(dbname, Number(dbversion) + 1, tableName, key)==-1){
    alert("MISS!!");
    return ;
  };

  // レコードの追加
  Insert(dbname, tableName, HM_Rec1);
  Insert(dbname, tableName, HM_Rec2);
  Insert(dbname, tableName, HM_Rec3);

  // 暫定
  var arrHelthMaster = [
    {HealthNo : 1, HealthName:'睡眠'},
    {HealthNo : 2, HealthName:'飲酒'},
    {HealthNo : 3, HealthName:'喫煙本数'}
  ];

  for(var i=0;i<arrHelthMaster.length;i++){
    let op = document.createElement("option");
    op.value = arrHelthMaster[i].HealthNo;     //value値
    op.text = arrHelthMaster[i].HealthName;    //テキスト値
    document.getElementById("HealthSetting").appendChild(op);
  }
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
  alert("HealthNo:" + document.getElementById( "HealthNo1" ).value );

  return true;
}
