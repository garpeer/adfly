                           Adf.ly link changer script

Usage
=====
Include js:

`<script type="text/javascript" src="adfly.js" ></script>`

Init script:

`Adfly('your_adfly_id', {options});`

Example
=======

`Adfly('your_adfly_id', {
    exclude: ['www.testsite.com','*example.com','test.test.com'],
    type : 'banner'
});`

Options
=======

 * include: domains to include [str|array] (defaults to '*')
 * exclude: domains to exclude [str|array]
 * parent: element in which to change links [DOM Element] (defaults to document)
 * type: ad type [int|banner] (defaults to int)

Include & exclude accepts '*' as a wildcard ( *example.com matches www.example.com, example.com, foo.bar.baz.example.com)

Alternative usage
=================

`var adfly = new Adfly('your_adfly_id', { include : '*example.com' });
adfly.replace();
adfly.options.type = 'banner';
adfly.options.include = '*example.other';
adfly.replace();`

License
=======

GPL3

