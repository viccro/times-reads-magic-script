google_books_api_url = "https://www.googleapis.com/books/v1/volumes?country=US&q="
goodreads_api_url = "https://www.goodreads.com/search/index.xml"
goodreads_key = "mb5pbxGpVshlA7lubvtKA"

function callGoodreadsApi(title, author) {

  url = goodreads_api_url + "?key=" + goodreads_key + "&q=" + escapeUrlString(title, author)

  var response = UrlFetchApp.fetch(url)
  //Logger.log(response.getContentText());
  
  xmlDoc = XmlService.parse(response.getContentText());
  var top_book = xmlDoc.getRootElement().getChild('search').getChild('results').getChild('work');

  var rating = top_book.getChild("average_rating").getValue()
  var num_ratings = numberWithCommas(top_book.getChild("ratings_count").getValue())
  var pub_year = top_book.getChild("original_publication_year").getValue()
  var url = "https://www.goodreads.com/book/show/" + top_book.getChild("best_book").getChild("id").getValue()

  Logger.log(num_ratings)
  
  return "Title: " + title + "\nAuthor: " + author + "\nPublication year: " + pub_year + "\nGoodreads: " + url +
    "\nGoodreads rating: " + rating + "(from " + num_ratings + " ratings) \n"
}

function callGoogleApi(title, author) {
  url = google_books_api_url + escapeUrlString(title, author)
  var response = UrlFetchApp.fetch(url)
  var json_object = JSON.parse(response.getContentText())
  var top_result = json_object.items[0].volumeInfo

  var page_count = top_result.pageCount

  return "Page Count: " + page_count + "\n"
}

function escapeUrlString(title, author){
  unescaped_data = title + " " + author
  return title.replace(/ /g,'+')
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function magicScript(title, author, why) {
  formattedString = callGoodreadsApi(title, author)
  formattedString += callGoogleApi(title, author)
  return formattedString + "Why are you nominating this book? " + why
}