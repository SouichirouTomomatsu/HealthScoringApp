/**
 * 個別画面遷移
 */
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'Scoring') {
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#myNavigator').pushPage('ScoringResult.html', {data: {title: 'ScoringResult'}});
    };
  } else if (page.id === 'ScoringResult') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});