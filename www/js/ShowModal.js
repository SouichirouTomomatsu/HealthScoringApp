/**
 * 画面全体マスク化
 */
function showModal() {
  var modal = document.querySelector('ons-modal');
  modal.show();
  setTimeout(function() {
    modal.hide();
  }, 2000);
  
  fn.load('ScoringResult.html');
}