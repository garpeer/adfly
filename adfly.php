<html>
  <head>
    <title>Adf.ly script</title>
    <script type="text/javascript" src="adfly.js?v=<?php echo rand(1, 9999) ?>" ></script>
  </head>
  <body>
      <p>Wildcard domains: * can be used in the exclude_domains or domains ( *.example.com matches www.example.com, example.com, foo.bar.baz.example.com)
      <ul id="replace">
          <li><a href="http://www.google.com">google</a></li>
          <li><a href="http://www.google.com#hash">google#hash</a></li>
          <li><a href="http://www.google.com#www.testsite.com">google#www.testsite.com</a></li>
          <li><a href="http://adf.ly/www.testsite.com">adf.ly/www.testsite.com</a></li>
          <li><a href="http://www.google.com/path/to/www.testsite.com/#www.testsite.com">google/path/to/testsite.com/#www.testsite.com</a></li>
          <li><a href="http://testsite.com">TS</a></li>
          <li><a href="http://www.testsite.com">www.TS</a></li>
          <li><a href="http://link.testsite.com">link.TS</a></li>
          <li><a href="https://www.testsite.com">TSs</a></li>
          <li><a href="http://www.testsite.com/path/to/adf.ly">TS/path/to/adf.ly</a></li>
          <li><a href="http://www.google.com?q=www.testsite.com">google->tm</a></li>
          <li><a href="#www.testsite.com">#TS</a></li>
          <li><a href="">empty</a></li>   
          <li><a>null</a></li>

          <li><a href="http://test.example.com">test.example</a></li>
          <li><a href="http://example.com">example</a></li>

          <li><a href="http://foo.test.com">foo.test</a></li>      
          <li><a href="http://test.test.com">test.test</a></li>
      </ul>
      
      <ul>
          <li><a href="http://www.google.com">google</a></li>
          <li><a href="http://www.google.com#hash">google#hash</a></li>
          <li><a href="http://www.google.com#www.testsite.com">google#www.testsite.com</a></li>
          <li><a href="http://adf.ly/www.testsite.com">adf.ly/www.testsite.com</a></li>
          <li><a href="http://www.google.com/path/to/www.testsite.com/#www.testsite.com">google/path/to/testsite.com/#www.testsite.com</a></li>
          <li><a href="http://testsite.com">TS</a></li>
          <li><a href="http://www.testsite.com">www.TS</a></li>
          <li><a href="http://link.testsite.com">link.TS</a></li>
          <li><a href="https://www.testsite.com">TSs</a></li>
          <li><a href="http://www.testsite.com/path/to/adf.ly">TS/path/to/adf.ly</a></li>
          <li><a href="http://www.google.com?q=www.testsite.com">google->tm</a></li>
          <li><a href="#www.testsite.com">#TS</a></li>
          <li><a href="">empty</a></li>   
          <li><a>null</a></li>

          <li><a href="http://test.example.com">test.example</a></li>
          <li><a href="http://example.com">example</a></li>

          <li><a href="http://foo.test.com">foo.test</a></li>      
          <li><a href="http://test.test.com">test.test</a></li>
      </ul>
      
      <script type="text/javascript">
          Adfly('Blabbla', {
            type : 'int',
            exclude : ['www.testsite.com','*.example.com','test.test.com']
          });
          var ad = new Adfly('other', {
            domains : ['*.example.com'],
            exclude: 'test.example.com',
            type : 'banner'
          });
          ad.options.parent = document.getElementById('replace');
          ad.replace();
      </script>
  </body>
</html>
