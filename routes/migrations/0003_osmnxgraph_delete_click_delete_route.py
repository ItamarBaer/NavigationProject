# Generated by Django 4.2.7 on 2023-12-13 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routes', '0002_route_avgpoint'),
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
            name='Click',
        ),
        migrations.DeleteModel(
            name='Route',
        ),
    ]