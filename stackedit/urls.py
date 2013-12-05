from django.conf.urls import patterns, include, url
from . import views

urlpatterns = patterns('',
    url(r'^$', views.index),
    url(r'^viewer$', views.viewer),
    url(r'^recovery$', views.recovery),
)
