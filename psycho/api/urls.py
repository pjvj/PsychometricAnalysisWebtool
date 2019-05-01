from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from api import views
from api.views import FindSentiment
from api.views import RecordFindSentiment
from api.views import FindSimilarity
from api.views import FindEmotionSpeech
from api.views import FindEmotionFace
from api.views import ChatterBot

urlpatterns = {

  url(r'^FindSentiment/$', FindSentiment.as_view(), name="create1"),
  url(r'^FindSimilarity/$', FindSimilarity.as_view(), name="create2"),
  url(r'^FindEmotionSpeech/$', FindEmotionSpeech.as_view(), name="create3"),
  url(r'^FindEmotionFace/$', FindEmotionFace.as_view(), name="create4"),
  url(r'^RecordFindSentiment/$', RecordFindSentiment.as_view(), name="create5"),
  url(r'^ChatterBot/', ChatterBot.as_view(), name='chatterbot'),
  
}

urlpatterns = format_suffix_patterns(urlpatterns)