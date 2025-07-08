document.addEventListener('DOMContentLoaded', () => {
  const tabMore = document.getElementById('tabMore');
  const tabApi = document.getElementById('tabApi');
  const moreInfoDiv = document.getElementById('moreInfo');
  const apiInfoDiv = document.getElementById('apiInfo');

  if (tabMore && tabApi && moreInfoDiv && apiInfoDiv) {
    tabMore.addEventListener('click', () => showContent('info'));
    tabApi.addEventListener('click', () => showContent('api'));

    function showContent(type) {
      if (type === 'info') {
        moreInfoDiv.style.display = "block";
        apiInfoDiv.style.display = "none";
        tabMore.classList.add("active");
        tabApi.classList.remove("active");
      } else if (type === 'api') {
        moreInfoDiv.style.display = "none";
        apiInfoDiv.style.display = "block";
        tabApi.classList.add("active");
        tabMore.classList.remove("active");
      }
    }
  }
});


  // Button logic after auth status is known
    if (tryButton) {
      tryButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = user ? 'scraper-maps' : 'signup';
      });
    }
  