from django.shortcuts import render
from .models import *
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from .validations import custom_validation, validate_email, validate_password
from rest_framework import permissions, status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Avg
from django.contrib.gis.geos import Point, MultiPoint
import os
from datetime import datetime, timezone, timedelta
import osmnx as ox
import networkx as nx

import geopandas as gpd
from geopy.distance import geodesic
import shapely
import json
import requests
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
import pickle

class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
        
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return JsonResponse(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)
     

class UserView(APIView):
    
        permission_classes = (permissions.IsAuthenticated,)
        authentication_classes = (SessionAuthentication,)
        def get(self, request):
                serializer = UserSerializer(request.user)
                return Response({'user': serializer.data}, status=status.HTTP_200_OK)




def index(request):
    context = {}
    return render(request, 'index.html', context)

@csrf_exempt
@require_POST
def generate_route(request):
    try:
        data = json.loads(request.body)
        points = data.get('markers', [])
        transportation = data.get('transportation', [])
        if len(points)>0:         
            shortest, max_dist, center = calculate_shortest_route(points,transportation )
            weather_data = calculate_weather(lat =center[0], lng = center[1])
            elevation_list = calculate_elevation(shortest)
             
            distances = calculate_distances(shortest)

            route_data = {'route': shortest,
                        'weather': weather_data,
                        'elevation': elevation_list,
                        'distances': distances,
                        'center': center,
                        'max_dist': max_dist}
            return JsonResponse(route_data, status=200)
        else:
            return JsonResponse({'route': points,
                                  'weather': None,
                                  'elevation': None,
                                  'distances': [],
                                  'center': center,
                                  'max_dist': 1}
                                  
                                  , status=200)


    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    

def convert_unix(unix_time, offset_seconds):
    utc = datetime.utcfromtimestamp(unix_time)
    offset = timedelta(seconds=offset_seconds)
    return utc + offset

def calculate_weather(lat,lng):
        api_key = os.environ.get('OPENWEATHER_API_KEY')
        url = "https://api.openweathermap.org/data/2.5/weather"

        params = {
            'lat': lat,
            'lon': lng,
            'appid': api_key,
            'units': 'metric',}
        response = requests.get(url,params=params)
        if response.status_code==200:
            weather_data = response.json()
            time_zone = weather_data['timezone']
            out = {'temperature': weather_data['main']['temp'],
                   'humidity':weather_data['main']['humidity'] ,
                   'icon': f"http://openweathermap.org/img/w/{weather_data['weather'][0]['icon']}.png",
                   'sunrise':convert_unix(weather_data['sys']['sunrise'],time_zone).strftime("%H:%M") ,
                   'sunset':convert_unix(weather_data['sys']['sunset'],time_zone).strftime("%H:%M")}
        else:
            out = {}
        return out

def create_euclidian_distance_heuristic(graph):
    def euclidean_distance_heuristic(node1, node2):
        x1, y1 = graph.nodes[node1]['x'], graph.nodes[node1]['y']
        x2, y2 = graph.nodes[node2]['x'], graph.nodes[node2]['y']
        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
    return euclidean_distance_heuristic

def calculate_shortest_route(points, transportation):
    coords= [(p['lat'], p['lng']) for p in points]
    lats, longs = zip(*coords)
    north, south, west, east = max(lats)+0.01, min(lats)-0.01, min(longs)-0.01, max(longs)+0.01 # buffers
    max_dist = geodesic((north, east),(south,west)).kilometers
    center = ((north + south) /2 , (east + west)/2 )
    osmnx_graph = get_object_or_404(OSMnxGraph, name=f"Jerusalem_{transportation}")
    graph = pickle.loads(osmnx_graph.graphml_file)
    nodes = ox.nearest_nodes(G=graph, X=longs, Y=lats)
    heuristic = create_euclidian_distance_heuristic(graph)
    shortest_path = []
    for i in range(len(nodes)-1):
        shortest_path.extend(nx.astar_path(graph, source=nodes[i], target=nodes[i+1],
                        heuristic=heuristic)[:-1])
    shortest_path.append(nodes[-1])
    node_positions =  [{'lat': graph.nodes[node]['y'],'lng': graph.nodes[node]['x']} for node in shortest_path]
    return node_positions, max_dist, center

def get_elevation(lats, lngs):
    base_url = "https://api.open-meteo.com/v1/elevation"
    url = f"{base_url}?latitude={lats}&longitude={lngs}"

    try:
        response = requests.get(url)
        data = response.json()

        if 'error' in data:
            print(f"Error: {data['error']['message']}")
            return None
        else:
            elevation = data
            return elevation['elevation']

    except Exception as e:
        print(f"Error: {e}")
        return None

def calculate_elevation(path):
    div = 1+len(path)//100

    lats = ["" for i in range(div)]
    lngs = ["" for i in range(div)]
    for i,p in enumerate(path):

        lats[i//100]+=f"{p['lat']},"
        lngs[i//100]+=f"{p['lng']},"
    res = []
    for i in range(len(lats)):
        res.extend(get_elevation(lats[i][:-1], lngs[i][:-1]))
    return res

def calculate_distances(path):
    distances = [0]
    for i in range(1,len(path)):
        dist = geodesic((path[i-1]['lat'],path[i-1]['lng']),(path[i]['lat'],path[i]['lng']) ).meters
        distances.append(dist + distances[-1])
    return distances
