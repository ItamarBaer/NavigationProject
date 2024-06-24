
from django.urls import path
from .import views
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', ensure_csrf_cookie(views.UserView.as_view()), name='user'),

    # path('', views.index),
    path('generate_route/', views.generate_route, name='generate_route'),
]   