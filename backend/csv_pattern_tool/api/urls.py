from django.urls import path
from . import views

urlpatterns = [
    path('addCSV/', views.addCSV, name='addCSV'),
    path('getregex/', views.getRegex, name='getRegex'),
    path('getdesc/', views.getDesc, name='getDesc'),
    path('getdummydata/', views.getDummyData, name='getDummyData'),
    path('replace/', views.replace, name='replace'),
]
