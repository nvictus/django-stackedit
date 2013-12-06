Django StackEdit
================

Fork of Benoit Schweblin's [StackEdit](https://github.com/benweet/stackedit) ported from Node.js to Django.

Quick start
-----------

1) Add "stackedit" to your INSTALLED_APPS setting like this:

```
INSTALLED_APPS = (
    ...
    'stackedit',
)
```

2) Include the stackedit URLconf in your project urls.py like this:

```
url(r'^editor/', include('stackedit.urls')),
```

Assumes that ``STATIC_URL`` settings variable is set appropriately. You may have to do ``python manage.py collectstatic`` if running with ``DEBUG = False``.


Development
-----------
Static resources are minified (``static/stackedit/res-min/``) and used by default. For development, un-minified javascripts are stored in ``static/stackedit/res`` and are served instead by using ``http://.../?debug``. However, you will need to install the missing bower packages and other dependencies for this to work. See developer-guide in the docs.