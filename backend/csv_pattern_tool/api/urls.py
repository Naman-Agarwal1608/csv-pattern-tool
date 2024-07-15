from django.urls import path
from . import views

urlpatterns = [
    path('addCSV/', views.addCSV, name='addCSV'),
    path('getregex/', views.getRegex, name='getRegex'),
]
