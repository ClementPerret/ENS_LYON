
///////////////////////////////////////////////FILM//////////////////////////////////////////////////////////////
///////////////////////////////////////////////FILM//////////////////////////////////////////////////////////////
///////////////////////////////////////////////FILM//////////////////////////////////////////////////////////////
///////////////////////////////////////////////FILM//////////////////////////////////////////////////////////////
function film(urlclient) {

  //display panes
  document.getElementById("film-pane").style.display = "block";
  document.getElementById("actor-pane").style.display = "none";
  document.getElementById("director-pane").style.display = "none";

  //reinit divs
  document.getElementById("filmTitle").innerHTML = "";
  document.getElementById("filmDate").innerHTML = "";
  document.getElementById("filmImg").src = "YYY";
  document.getElementById("abstract").innerHTML = "No abstract available";
  document.getElementById("DirectorNames").innerHTML = "";
  document.getElementById("ActorNames").innerHTML = "";
  document.getElementById("FreeBase").style.display = "none";
  document.getElementById("filmImg").style.display = "none";


  // title date sameAs freebase
  var endpoint = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
  'PREFIX dct: <http://purl.org/dc/terms/> ' + 
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * {OPTIONAL {<'+urlclient+'> dct:date ?date} OPTIONAL {<'+urlclient+'> dct:title ?title} OPTIONAL {<'+urlclient+'> owl:sameAs ?sameAs. FILTER regex(str(?sameAs), "dbpedia").} OPTIONAL {<'+urlclient+'> foaf:page ?foaf. FILTER regex(str(?foaf), "freebase").} } ' );
  var url = endpoint + '?query=' + encodeURIComponent(sparql);
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.setRequestHeader('accept', 'application/json');
  req.onerror = function() {
    console.log("Échec de chargement " + url);
  };
  req.onload = function() {
    if (req.status !== 200) {
      console.log("Erreur " + req.status);
    } else {

      console.log("Données obtenues");
      var bindings = JSON.parse(req.responseText).results.bindings;

      for (var i=0; i<bindings.length; i++) {

        if(typeof bindings[i].title != 'undefined') {
          document.getElementById("filmTitle").innerHTML = bindings[i].title.value;
        }
        if(typeof bindings[i].date != 'undefined') {
          document.getElementById("filmDate").innerHTML = bindings[i].date.value;
        }
        if(typeof bindings[i].sameAs != 'undefined') {
          var urlDbpedia = bindings[i].sameAs.value;
          getAbstractDepiction(urlDbpedia);
        }
        if(typeof bindings[i].foaf != 'undefined') {
          document.getElementById("FreeBase").href = bindings[i].foaf.value;
          if (document.getElementById("FreeBase").src != "XXX") {
            document.getElementById("FreeBase").style.display = "block";
          }
        }

      }
    }
  };
  req.send();
  getActorNames(urlclient);
  getDirectorName(urlclient);
}
  
function getAbstractDepiction(urlDbpedia) {
  // abstract depiction
  var endpoint2 = 'http://dbpedia.org/sparql/';
  var sparql2 = (
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX dbo: <http://dbpedia.org/ontology/>' +
  'SELECT * { <'+urlDbpedia+'> dbo:abstract ?abstract FILTER(LANG(?abstract) = "en"). OPTIONAL {<'+urlDbpedia+'> foaf:depiction ?depiction}}');

  var url2 = endpoint2 + '?query=' + encodeURIComponent(sparql2);
  var req2 = new XMLHttpRequest();
  req2.open("GET", url2);
  req2.setRequestHeader('accept', 'application/json');
  req2.onerror = function() {
    console.log("Échec de chargement " + url2);
  };
  req2.onload = function() {
    if (req2.status !== 200) {
      console.log("Erreur " + req2.status);
    } else {
      console.log("Données obtenues");
      var bindings2 = JSON.parse(req2.responseText).results.bindings;
      for (var i=0; i<bindings2.length; i++) {
        if(typeof bindings2[i].abstract != 'undefined') {
          document.getElementById("abstract").innerHTML = bindings2[i].abstract.value;
        }
        if(typeof bindings2[i].depiction != 'undefined') {
          document.getElementById("filmImg").src = bindings2[i].depiction.value;
          if (document.getElementById("filmImg").src != "YYY") {
            document.getElementById("filmImg").style.display = "block";
          }
        }
      }
    }
  };
  req2.send();
}

function getActorNames(urlclient) {
  var endpoint3 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql3 = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
  'PREFIX dct: <http://purl.org/dc/terms/> ' + 
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * { <'+urlclient+'> :actor ?actor. ?actor :actor_name ?actorname.} ');
  var url3 = endpoint3 + '?query=' + encodeURIComponent(sparql3);
  var req3 = new XMLHttpRequest();
  req3.open("GET", url3);
  req3.setRequestHeader('accept', 'application/json');
  req3.onerror = function() {
    console.log("Échec de chargement " + url3);
  };
  req3.onload = function() {
    if (req3.status !== 200) {
      console.log("Erreur " + req3.status);
    } else {
      console.log("Données obtenues");
      var bindings3 = JSON.parse(req3.responseText).results.bindings;
      var ul = document.getElementById("ActorNames");
      for (var i=0; i<bindings3.length; i++) {
        var li = document.createElement('li');
        var p = "<span class='link' onClick=actor('"+bindings3[i].actor.value+"')>"+bindings3[i].actorname.value+"</span>";
        li.innerHTML = p;
        ul.appendChild(li);
      }
      if (ul.getElementsByTagName('li').length < 1) {
        var p = document.createElement('p');
        var li = document.createElement('li');
        p.textContent = "Unavalaible actors names";
        li.appendChild(p);
        ul.appendChild(li);
      }
    }
  };
  req3.send();
}

function getDirectorName(urlclient) {
  var endpoint4 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql4 = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
  'PREFIX dct: <http://purl.org/dc/terms/> ' + 
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * { <'+urlclient+'> :director ?director. ?director :director_name ?directorname.}');
  var url4 = endpoint4 + '?query=' + encodeURIComponent(sparql4);
  var req4 = new XMLHttpRequest();
  req4.open("GET", url4);
  req4.setRequestHeader('accept', 'application/json');
  req4.onerror = function() {
    console.log("Échec de chargement " + url4);
  };
  req4.onload = function() {
    if (req4.status !== 200) {
      console.log("Erreur " + req4.status);
    } else {
      console.log("Données obtenues");
      var bindings4 = JSON.parse(req4.responseText).results.bindings;
      var ul = document.getElementById("DirectorNames");
      for (var i=0; i<bindings4.length; i++) {
        var li = document.createElement('li');
        var p = "<span class='link' onClick=director('"+bindings4[i].director.value+"')>"+bindings4[i].directorname.value+"</span>";
        li.innerHTML = p;
        ul.appendChild(li);
      }
      if (ul.getElementsByTagName('li').length < 1) {
        var p = document.createElement('p');
        var li = document.createElement('li');
        p.textContent = "Unavalaible director(s) name(s)";
        li.appendChild(p);
        ul.appendChild(li);
      }
    }
  };
  req4.send();
}

///////////////////////////////////////////////ACTOR//////////////////////////////////////////////////////////////
///////////////////////////////////////////////ACTOR//////////////////////////////////////////////////////////////
///////////////////////////////////////////////ACTOR//////////////////////////////////////////////////////////////
///////////////////////////////////////////////ACTOR//////////////////////////////////////////////////////////////

function actor(urlactor) {

  //display panes
  document.getElementById("film-pane").style.display = "none";
  document.getElementById("actor-pane").style.display = "block";
  document.getElementById("director-pane").style.display = "none";

  //reinit divs
  document.getElementById("actorImg").src = "YYY";
  document.getElementById("actorAbstract").innerHTML = "No abstract available";
  document.getElementById("actorName").innerHTML = "";
  document.getElementById("filmsList").innerHTML = "";
  document.getElementById("asDirector").innerHTML = "";
  document.getElementById("actorFreebase").style.display = "none";
  document.getElementById("actorImg").style.display = "none";

  getName(urlactor);
  getFilms(urlactor);
  }

function getName(urlactor) {
    var endpoint5 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
    var sparql5 = (
    'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
    'SELECT ?nom ?page ?same {<'+urlactor+'> :actor_name ?nom; foaf:page ?page. FILTER regex(str(?page), "freebase") OPTIONAL {<'+urlactor+'> owl:sameAs ?same. FILTER regex(str(?same), "dbpedia").}}'
      );
    var url5 = endpoint5 + '?query=' + encodeURIComponent(sparql5);
    var req5 = new XMLHttpRequest();
    req5.open("GET", url5);
    req5.setRequestHeader('accept', 'application/json');
    req5.onerror = function() {
      console.log("Échec de chargement " + url5);
    };
    req5.onload = function() {
      if (req5.status !== 200) {
        console.log("Erreur " + req5.status);
      } else {

        console.log("Données obtenues");
        var bindings5 = JSON.parse(req5.responseText).results.bindings;
        console.log(bindings5);
        for (var i=0; i<bindings5.length; i++) {
         if(typeof bindings5[i].same != 'undefined') {
            var urlDbpedia = bindings5[i].same.value;
            getActorAbstractDepiction(urlDbpedia);
          }
          if(typeof bindings5[i].nom != 'undefined') {
            var name = bindings5[i].nom.value;
            asDirector(name);
            document.getElementById('actorName').innerHTML = name;
          }
          if(typeof bindings5[i].page != 'undefined') {
            document.getElementById('actorFreebase').href = bindings5[i].page.value;
            if (document.getElementById("actorFreebase").src != "XXX") {
              document.getElementById("actorFreebase").style.display = "block";
            }
          }
        }
      }
    };
    req5.send();

}

function getActorAbstractDepiction(urlDbpedia) {
  // abstract depiction
  var endpoint12 = 'http://dbpedia.org/sparql/';
  var sparql12 = (
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX dbo: <http://dbpedia.org/ontology/>' +
  'SELECT * { <'+urlDbpedia+'> dbo:abstract ?abstract FILTER(LANG(?abstract) = "en"). OPTIONAL {<'+urlDbpedia+'> foaf:depiction ?depiction}}');

  var url12 = endpoint12 + '?query=' + encodeURIComponent(sparql12);
  var req12 = new XMLHttpRequest();
  req12.open("GET", url12);
  req12.setRequestHeader('accept', 'application/json');
  req12.onerror = function() {
    console.log("Échec de chargement " + url12);
  };
  req12.onload = function() {
    if (req12.status !== 200) {
      console.log("Erreur " + req12.status);
    } else {
      console.log("Données obtenues");
      var bindings12 = JSON.parse(req12.responseText).results.bindings;
      for (var i=0; i<bindings12.length; i++) {
        if(typeof bindings12[i].abstract != 'undefined') {
          document.getElementById("actorAbstract").innerHTML = bindings12[i].abstract.value;
        }
        if(typeof bindings12[i].depiction != 'undefined') {
          document.getElementById("actorImg").src = bindings12[i].depiction.value;
          if (document.getElementById("actorImg").src != "YYY") {
            document.getElementById("actorImg").style.display = "block";
          }
        }
      }
    }
  };
  req12.send();
}


function getFilms(urlactor) {
    var endpoint6 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
    var sparql6 = (
    'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
    'PREFIX dct: <http://purl.org/dc/terms/>' +
    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
    'SELECT ?title ?p { ?p :actor <'+urlactor+'>. ?p dct:title ?title.}'
      );
    var url6 = endpoint6 + '?query=' + encodeURIComponent(sparql6);
    var req6 = new XMLHttpRequest();
    req6.open("GET", url6);
    req6.setRequestHeader('accept', 'application/json');
    req6.onerror = function() {
      console.log("Échec de chargement " + url6);
    };
    req6.onload = function() {
      if (req6.status !== 200) {
        console.log("Erreur " + req6.status);
      } else {

        console.log("Données obtenues");
        var bindings6 = JSON.parse(req6.responseText).results.bindings;
        var ul = document.getElementById("filmsList");
        for (var i=0; i<bindings6.length; i++) {
          var li = document.createElement('li');
          var p = "<span class='link' onClick=film('"+bindings6[i].p.value+"')>"+bindings6[i].title.value+"</span>";
          li.innerHTML = p;
          ul.appendChild(li);
        }
        if (ul.getElementsByTagName('li').length < 1) {
          var p = document.createElement('p');
          var li = document.createElement('li');
          p.textContent = "This actor has performed in no movie";
          li.appendChild(p);
          ul.appendChild(li);
        }
      }
    };
    req6.send();
}

function asDirector(name) {
   var endpoint7 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
    var sparql7 = (
      'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
      'PREFIX dct: <http://purl.org/dc/terms/> '+
      'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
      'SELECT * { ?films a :film. ?films dct:title ?title. ?films :director ?director. ?director :director_name ?directorname. FILTER CONTAINS(?directorname, "'+name+'").}'

      );
    var url7 = endpoint7 + '?query=' + encodeURIComponent(sparql7);
    var req7 = new XMLHttpRequest();
    req7.open("GET", url7);
    req7.setRequestHeader('accept', 'application/json');
    req7.onerror = function() {
      console.log("Échec de chargement " + url7);
    };
    req7.onload = function() {
      if (req7.status !== 200) {
        console.log("Erreur " + req7.status);
      } else {

        console.log("Données obtenues");
        var bindings7 = JSON.parse(req7.responseText).results.bindings;
        var ul = document.getElementById("asDirector");
        for (var i=0; i<bindings7.length; i++) {
          var li = document.createElement('li');
          var p = "<span class='link' onClick=film('"+bindings7[i].films.value+"')>"+bindings7[i].title.value+"</span>";
          li.innerHTML = p;
          ul.appendChild(li);
        }
        if (ul.getElementsByTagName('li').length < 1) {
          var p = document.createElement('p');
          var li = document.createElement('li');
          p.textContent = "This actor has directed no movie";
          li.appendChild(p);
          ul.appendChild(li);
        }
      }
    };
    req7.send();
}

///////////////////////////////////////////////DIRECTOR//////////////////////////////////////////////////////////////
///////////////////////////////////////////////DIRECTOR//////////////////////////////////////////////////////////////
///////////////////////////////////////////////DIRECTOR//////////////////////////////////////////////////////////////
///////////////////////////////////////////////DIRECTOR//////////////////////////////////////////////////////////////


function director(urldirector){

  //display panes
  document.getElementById("film-pane").style.display = "none";
  document.getElementById("actor-pane").style.display = "none";
  document.getElementById("director-pane").style.display = "block";

  //reinit divs
  document.getElementById("directorImg").src = "YYY";
  document.getElementById("directorAbstract").innerHTML = "No abstract available";
  document.getElementById("directorName").innerHTML = "";
  document.getElementById("directorMovies").innerHTML = "";
  document.getElementById("asActor").innerHTML = "";
  document.getElementById("directorFreebase").style.display = "none";
  document.getElementById("directorImg").style.display = "none";

  getDirName(urldirector);
  getDirFilms(urldirector);
}

function getDirName(urldirector) {
    var endpoint8 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
    var sparql8 = (
    'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
    'SELECT * { <'+urldirector+'> :director_name ?nom; foaf:page ?freebase. FILTER regex(str(?freebase), "freebase").}'
      );
    var url8 = endpoint8 + '?query=' + encodeURIComponent(sparql8);
    var req8 = new XMLHttpRequest();
    req8.open("GET", url8);
    req8.setRequestHeader('accept', 'application/json');
    req8.onerror = function() {
      console.log("Échec de chargement " + url8);
    };
    req8.onload = function() {
      if (req8.status !== 200) {
        console.log("Erreur " + req8.status);
      } else {
        console.log("Données obtenues");
        var bindings8 = JSON.parse(req8.responseText).results.bindings;
        console.log(bindings8);
        for (var i=0; i<bindings8.length; i++) {
          if(typeof bindings8[i].nom != 'undefined') {
            var name = bindings8[i].nom.value;
            asActor(name);
            getDirectorActorName(name);
            document.getElementById('directorName').innerHTML = name;
          }
          if(typeof bindings8[i].freebase != 'undefined') {
            document.getElementById('directorFreebase').href = bindings8[i].freebase.value;
            if (document.getElementById("directorFreebase").src != "XXX") {
              document.getElementById("directorFreebase").style.display = "block";
            }
          }
        }
      }
    };
    req8.send();
}
function getDirectorActorName(name) {
  var endpoint14 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql14 = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/>' +
  'PREFIX dct: <http://purl.org/dc/terms/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * {?actor a :actor.?actor :actor_name ?actorname. FILTER CONTAINS(?actorname, "Steven Spielberg"). OPTIONAL {?actor owl:sameAs ?same. FILTER regex(str(?same), "dbpedia").}}');
  var url14 = endpoint14 + '?query=' + encodeURIComponent(sparql14);
  var req14 = new XMLHttpRequest();
  req14.open("GET", url14);
  req14.setRequestHeader('accept', 'application/json');
  req14.onerror = function() {
    console.log("Échec de chargement " + url14);
  };
  req14.onload = function() {
    if (req14.status !== 200) {
      console.log("Erreur " + req14.status);
    } else {
      console.log("Données obtenues");
      var bindings14 = JSON.parse(req14.responseText).results.bindings;
      for (var i=0; i<bindings14.length; i++) {
        if(typeof bindings14[i].same != 'undefined') {
          var urlDbpedia = bindings14.same.value;
          getDirectorAbstractDepiction(urlDbpedia);
        }
      }
    }
  };
  req14.send();
}

function getDirectorAbstractDepiction(urlDbpedia) {
  console.log(urlDbpedia);
  // abstract depiction
  var endpoint13 = 'http://dbpedia.org/sparql/';
  var sparql13 = (
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX dbo: <http://dbpedia.org/ontology/>' +
  'SELECT * { <'+urlDbpedia+'> dbo:abstract ?abstract FILTER(LANG(?abstract) = "en"). OPTIONAL {<'+urlDbpedia+'> foaf:depiction ?depiction}}');

  var url13 = endpoint13 + '?query=' + encodeURIComponent(sparql13);
  var req13 = new XMLHttpRequest();
  req13.open("GET", url13);
  req13.setRequestHeader('accept', 'application/json');
  req13.onerror = function() {
    console.log("Échec de chargement " + url13);
  };
  req13.onload = function() {
    if (req13.status !== 200) {
      console.log("Erreur " + req13.status);
    } else {
      console.log("Données obtenues");
      var bindings13 = JSON.parse(req13.responseText).results.bindings;
      for (var i=0; i<bindings13.length; i++) {
        if(typeof bindings13[i].abstract != 'undefined') {
          document.getElementById("directorAbstract").innerHTML = bindings13[i].abstract.value;
        }
        if(typeof bindings13[i].depiction != 'undefined') {
          document.getElementById("directorImg").src = bindings13[i].depiction.value;
          if (document.getElementById("directorImg").src != "YYY") {
            document.getElementById("directorImg").style.display = "block";
          }
        }
      }
    }
  };
  req13.send();
}

function getDirFilms(urldirector) {
    var endpoint9 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
    var sparql9 = (
    'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
    'PREFIX dct: <http://purl.org/dc/terms/>' +
    'SELECT ?film ?filmname {?film :director <'+urldirector+'>. ?film dct:title ?filmname.}'
      );
    var url9 = endpoint9 + '?query=' + encodeURIComponent(sparql9);
    var req9= new XMLHttpRequest();
    req9.open("GET", url9);
    req9.setRequestHeader('accept', 'application/json');
    req9.onerror = function() {
      console.log("Échec de chargement " + url9);
    };
    req9.onload = function() {
      if (req9.status !== 200) {
        console.log("Erreur " + req9.status);
      } else {

        console.log("Données obtenues");
        var bindings9 = JSON.parse(req9.responseText).results.bindings;
        var ul = document.getElementById("directorMovies");
        for (var i=0; i<bindings9.length; i++) {
          var li = document.createElement('li');
          var p = "<span class='link' onClick=film('"+bindings9[i].film.value+"')>"+bindings9[i].filmname.value+"</span>";
          li.innerHTML = p;
          ul.appendChild(li);
        }
        if (ul.getElementsByTagName('li').length < 1) {
          var p = document.createElement('p');
          var li = document.createElement('li');
          p.textContent = "This director has directed no movie";
          li.appendChild(p);
          ul.appendChild(li);
        }
      }
    };
    req9.send();
}

function asActor(name) {
   var endpoint10 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
    var sparql10 = (
      'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
      'PREFIX dct: <http://purl.org/dc/terms/> '+
      'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
      'SELECT ?title ?films{?films a :film. ?films dct:title ?title. ?films :actor ?actor. ?actor :actor_name ?actorname. FILTER CONTAINS(?actorname, "'+name+'").}'

      );
    var url10 = endpoint10 + '?query=' + encodeURIComponent(sparql10);
    var req10 = new XMLHttpRequest();
    req10.open("GET", url10);
    req10.setRequestHeader('accept', 'application/json');
    req10.onerror = function() {
      console.log("Échec de chargement " + url10);
    };
    req10.onload = function() {
      if (req10.status !== 200) {
        console.log("Erreur " + req10.status);
      } else {

        console.log("Données obtenues");
        var bindings10 = JSON.parse(req10.responseText).results.bindings;
        var ul = document.getElementById("asActor");
        for (var i=0; i<bindings10.length; i++) {
          var li = document.createElement('li');
          var p = "<span class='link' onClick=film('"+bindings10[i].films.value+"')>"+bindings10[i].title.value+"</span>";
          li.innerHTML = p;
          ul.appendChild(li);
        }
        if (ul.getElementsByTagName('li').length < 1) {
          var p = document.createElement('p');
          var li = document.createElement('li');
          p.textContent = "This director has played in no movie";
          li.appendChild(p);
          ul.appendChild(li);
        }
      }
    };
    req10.send();
}