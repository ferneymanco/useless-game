import { Component, ElementRef, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { SPECIMENS } from '../../../core/constants/specimens';
import { Specimen } from '../../../core/models/specimen';

@Component({
  selector: 'app-location-map',
  standalone: true,
  templateUrl: './location-map.html',
  styleUrls: ['./location-map.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationMapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  specimens: Specimen[] = Object.values(SPECIMENS) as Specimen[];


  ngAfterViewInit() {
    this.createMap();
  }

  async createMap() {
    const width = 960;
    const height = 500;

    const tooltip = d3.select(this.mapContainer.nativeElement)
      .append('div')
      .attr('class', 'tooltip');

    const svg = d3.select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');


    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glitch-filter');

    filter.append('feTurbulence')
      .attr('type', 'fractalNoise')
      .attr('baseFrequency', '0.05 0.5') // Frecuencia de ruido
      .attr('numOctaves', '2')
      .attr('result', 'noise');

    filter.append('feDisplacementMap')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'noise')
      .attr('scale', '15') // Intensidad de la distorsión
      .attr('xChannelSelector', 'R')
      .attr('yChannelSelector', 'G');

    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json') as any;
    const countries = topojson.feature(world, world.objects.countries);

    svg.append('path')
      .datum(countries)
      .attr('class', 'land')
      .attr('d', path);

    this.specimens.forEach(specimen=>{
      const [x, y] = projection([specimen.location.longitude, specimen.location.latitude])!;
      const nodeGroup = svg.append('g')
      .style('cursor', 'crosshair')
      .on('mouseover', (event) => {
        tooltip.style('opacity', 1)
              .html(`
                <span class="tooltip-header">DIAGNOSTIC_DATA</span>
                ID: ${specimen.id}<br>
                LOC: ${specimen.location.name}<br>
                STAT: ${specimen.status}<br>
                SIG: ${specimen.signal}
              `);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.pageX + 15) + 'px')
              .style('top', (event.pageY - 15) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    nodeGroup.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('class', 'node blink');

    nodeGroup.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 2)
      .attr('fill', '#fff');
    });
    const medellinCoords: [number, number] = [-75.567, 6.247]; 
    const [x, y] = projection(medellinCoords)!;
  
  }
}