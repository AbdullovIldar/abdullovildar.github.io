/*jshint esversion: 6 */
import {Item} from './Item.js';
'use strict'
window.onload = () => {
    createMap('map');
}
function createMap (id) {
    const init = () => {
        let newMap = new ymaps.Map(id, {
            center: [54.3282400, 48.3865700],
            zoom: 12,
            controls: []
        });
        createNewPoint(newMap);
    }
    ymaps.ready(init);
}

function createNewPoint (map) {
    const state = {
        listLength: 0,
        coordinates: {},
        polyline: new ymaps.Polyline([])
    };
    const addressLine = document.querySelector('#addressLine');
    const pointlist = document.querySelector('.pointlist');
    const renderPolyline = () => {
        const pointItems = pointlist.querySelectorAll('.pointlist__point[data-id]');
        const coordinates = [...pointItems].map(item => state.coordinates[item.dataset.id]);
        map.geoObjects.remove(state.polyline);
        const newPolyline = new ymaps.Polyline(coordinates);
        state.polyline = newPolyline;
        map.geoObjects.add(newPolyline);
    };
    const addPoint =  () => {
        const text = addressLine.value;
        const number = state.listLength;
        const coordinate = map.getCenter();
        const newPlacemark = new ymaps.Placemark(coordinate, {
            balloonContent: text
        }, {
            draggable: true,
            balloonPanelMaxMapArea: 0
        });
        const itemEventListener = (event) => {
            switch (event) {
                case 'remove' : 
                    map.geoObjects.remove(newPlacemark);
                    delete state.coordinates[number];
                    renderPolyline();
                    break;
                case 'mouseup' : 
                    renderPolyline();
                    break;
            }
        };
        const pointItem = new Item({
            pointlist: pointlist, 
            itemClassName: 'pointlist__point',
            text: text,
            id: number, 
            eventFunction: itemEventListener
        });
        newPlacemark.events.add('dragend', () => {
            state.coordinates[number] = newPlacemark.geometry.getCoordinates();
            renderPolyline();
        });
        newPlacemark.events.add('click', () => {
            renderPolyline();
        });
        state.coordinates[number] = coordinate;
        map.geoObjects.add(newPlacemark);
        pointItem.createItem(text, number);
        renderPolyline();
        addressLine.value = '';
        state.listLength++;
    };
    addressLine.addEventListener('keydown', (event) => {
        if (event.keyCode == 13) {
            addPoint();
        }
    })
}