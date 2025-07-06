from django.urls import path
from .views import SubmitStoreView

urlpatterns = [
    path('submitstore/', SubmitStoreView.as_view(), name='submitstore'),
]
