  $(document).ready(function() {
    displaySearchHistory();
  });

  var previousSearches = [];
  var basicSearch_input = document.getElementById("searchKey");

  if (basicSearch_input) {
    basicSearch_input.addEventListener("keydown", function(e) {
      if (e.keyCode === 13) {
        basicSearch(e);
      }
    });
  }

  function basicSearch(e) {
    let searchKey = document.getElementById("searchKey").value;
    storeSearches(searchKey)
    searchKey = searchKey.toString().trim();
    let searchURL = 'https://github.com/search?q=' + searchKey;
    let createProperties = {
      "url": searchURL
    };
    chrome.tabs.create(createProperties, function() {});
  }

  var searchBtn = document.getElementById("advanced_btn");
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      advancedSearch();
    });
  }

  function advancedSearch() {
    let searchKey = document.getElementById("advanced_search").value;
    let searchType = document.getElementById("search_type").value
    if (searchKey) {
      searchKey = searchKey.toString().trim();
    }
    if (searchType == 'Packages') {
      searchType = 'RegistryPackages';
    }
    let searchParameters = getParameters();
    let searchURL = 'https://github.com/search?utf8=%E2%9C%93&q=' + searchKey + searchParameters + '&type=' + searchType + '&ref=advsearch&l=&l=';
    let createProperties = {
      "url": searchURL
    };
    chrome.tabs.create(createProperties, function() {});
  }

  function getParameters() {
    let param = '';
    param += repoParams(); // + codeParams() + issueParams() + userParams() + wikiParams();
    return param;
  }

  function displaySearchHistory() {
    if (localStorage["previousSearches"]) {
      previousSearches = JSON.parse(localStorage["previousSearches"]);
    } else {
      previousSearches = ['octokit/rest.js', 'atom', 'search-github-crx', 'antirez/redis', 'electron'];
    }

    $("#searchKey").autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(previousSearches, request.term);
        response(results.slice(0, 5));
      },
      messages: {
        noResults: ''
      }
    });
  }

  function storeSearches(search) {
    if (previousSearches.indexOf(search) == -1) {
      previousSearches.unshift(search);
      if (previousSearches.length > 100) {
        previousSearches.pop();
      }
      localStorage["previousSearches"] = JSON.stringify(previousSearches);
    }
  }

  function repoParams() {
    let repoParams = '';
    let users = document.getElementById("user").value;
    let repo = document.getElementById("repo").value;
    let stars = document.getElementById("stars").value;
    let forks = document.getElementById("forks").value;
    let size = document.getElementById("repo_size").value;
    let fork = filterForkOption(document.getElementById("repo_fork").value);

    if (!(isEmpty(users))) {
      repoParams += '+user%3A' + users;
    }
    if (!(isEmpty(repo))) {
      repoParams += '+repo%3A' + repo;
    }
    if (!(isEmpty(stars))) {
      repoParams += '+stars%3A' + stars;
    }
    if (!(isEmpty(forks))) {
      repoParams += '+forks%3A' + forks;
    }
    if (!(isEmpty(size))) {
      repoParams += '+size%3A' + size;
    }

    return repoParams + fork;

  }

  function isEmpty(str) {
    return (str == null || (str.toString().trim()).length == 0);
  }

  function filterForkOption(str) {
    if (str == 'Yes') {
      return '+fork%3Atrue'
    } else if (str == 'Only including forks') {
      return '+fork%3Aonly'
    } else {
      return '';
    }
  }
