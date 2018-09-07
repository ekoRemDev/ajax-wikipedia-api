function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // // load streetview
    // var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    // $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');



    // // load nytimes
    // // var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest&api-key=4f8a657b34b9474d989068c10b7def92"
    // var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&api-key=4f8a657b34b9474d989068c10b7def92"
    // // alert(nytimesUrl);
    //
    // $.getJSON(nytimesUrl, function (jd) {
    //     $.each(jd.response.docs, function (i, field) {
    //         $("#nytimes-articles").append('<li id=\"nytimes-article\">' + field.headline.main + '</li>');
    //         // $("div").append('article id : ' + field._id + '</p>');
    //         // $("div").append(field.snippet + '</p>');
    //         // $("div").append("<a href=\"" + field.web_url + "\" target='_blank'>Read More</a>");
    //
    //     });
    //     // $('#stage').html('<p> Name: ' + jd.status + '</p>');
    //     // $('#stage').append('<p>Age : ' + jd.copyright+ '</p>');
    //     // $('#stage').append('<p> Sex: ' + jd.response.docs.web_url+ '</p>');
    // }).error(function (e) {
    //     alert("i cannot load site");
    //
    // });

    // load nytimes
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=4f8a657b34b9474d989068c10b7def92';
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
                '</li>');
        };

    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // $('.article-list').append(article);

    //load wikipedia

    // var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&searchc=' + cityStr + '&format=json&callback=wikiCallback';
    //
    // $.ajax({
    //     url: wikiUrl,
    //     dataType: 'jsonp',
    //
    //     success: function (response) {
    //         //alert('basarili');
    //         var articleList = response[1];
    //         alert(articleList.length)
    //         for (var i = 1; i < articleList.length; i++) {
    //             alert(i);
    //         }
    //     }
    // });


    // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });


    return false;
};

$('#form-container').submit(loadData);
// $('#street').on('keyup' ,loadData)