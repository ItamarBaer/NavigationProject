# import os
import networkx as nx
import osmnx as ox
import pickle
from django.contrib.gis.geos import GEOSGeometry
from ...models import *
from django.core.management.base import BaseCommand


def save_graph_to_database(name, graph):
    graph_data = pickle.dumps(graph)
    osmnx_graph = OSMnxGraph(name = name, graphml_file=graph_data)
    osmnx_graph.save()

class Command(BaseCommand):
    help = 'This saves the graphs of Jerusalem'



    def handle(self, *args, **options):
        graph = ox.graph_from_place('Jerusalem', network_type='walk', simplify=False, truncate_by_edge=True)
        save_graph_to_database('Jerusalem_walk', graph)
        graph = ox.graph_from_place('Jerusalem', network_type='drive', simplify=False, truncate_by_edge=True)
        save_graph_to_database('Jerusalem_drive', graph)
        graph = ox.graph_from_place('Jerusalem', network_type='bike', simplify=False, truncate_by_edge=True)
        save_graph_to_database('Jerusalem_bike', graph)


        self.stdout.write(self.style.SUCCESS('Successfully saved graphs to the database'))
