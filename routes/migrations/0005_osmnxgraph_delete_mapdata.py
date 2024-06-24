# Generated by Django 4.2.7 on 2023-12-17 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routes', '0004_mapdata_delete_osmnxgraph'),
    ]

    operations = [
        migrations.CreateModel(
            name='OSMnxGraph',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('graphml_file', models.BinaryField()),
            ],
        ),
        migrations.DeleteModel(
            name='MapData',
        ),
    ]