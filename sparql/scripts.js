
function film() {

  //display panes
  document.getElementById("film-pane").style.display = "block";
  document.getElementById("actor-pane").style.display = "none";
  document.getElementById("director-pane").style.display = "none";

  //reinit divs
  document.getElementById("filmTitle").innerHTML = "";
  document.getElementById("filmDate").innerHTML = "";
  document.getElementById("filmImg").src = "YYY";
  document.getElementById("abstract").innerHTML = "Abastract is unavalaible";
  document.getElementById("DirectorNames").innerHTML = "";
  document.getElementById("ActorNames").innerHTML = "";
  document.getElementById("FreeBase").style.display = "none";
  document.getElementById("filmImg").style.display = "none";


  // title date sameAs freebase
  urlclient = document.getElementById("film-uri").value;
  var endpoint = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
  'PREFIX dct: <http://purl.org/dc/terms/> ' + 
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * {OPTIONAL {<'+urlclient+'> dct:date ?date} OPTIONAL {<'+urlclient+'> dct:title ?title} OPTIONAL {<'+urlclient+'> owl:sameAs ?sameAs. FILTER regex(str(?sameAs), "dbpedia").} OPTIONAL {<'+urlclient+'> foaf:page ?foaf. FILTER regex(str(?foaf), "freebase").} } ' + 'LIMIT 10' + ''
    );
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
          dbpedia(urlDbpedia);
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
  actorname();
  directorname();
}
  
function dbpedia(urlDbpedia) {
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
      console.log(bindings2);
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

function actorname() {
  var endpoint3 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql3 = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
  'PREFIX dct: <http://purl.org/dc/terms/> ' + 
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * { <'+urlclient+'> :actor ?actor. ?actor :actor_name ?actorname. ?actor foaf:page ?actorpage} ' +
  'LIMIT 10' +
  '');
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
      var bindings = JSON.parse(req3.responseText).results.bindings;
      var ul = document.getElementById("ActorNames");
      for (var i=0; i<bindings.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = bindings[i].actorname.value;
        a.href = bindings[i].actorpage.value;
        li.appendChild(a);
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

function directorname() {
  var endpoint4 = 'http://dsi-liris-silex.univ-lyon1.fr/archinfo/linkedmdb/';
  var sparql4 = (
  'PREFIX : <http://data.linkedmdb.org/resource/movie/> '+
  'PREFIX dct: <http://purl.org/dc/terms/> ' + 
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
  'SELECT * { <'+urlclient+'> :director ?director. ?director :director_name ?directorname. ?director foaf:page ?directorpage} ' +
  'LIMIT 10' +
  '');
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
      var bindings = JSON.parse(req4.responseText).results.bindings;
      var ul = document.getElementById("DirectorNames");
      for (var i=0; i<bindings.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = bindings[i].directorname.value;
        a.href = bindings[i].directorpage.value;
        li.appendChild(a);
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