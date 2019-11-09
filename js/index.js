/*jshint esversion: 6 */
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
        coordinates: [],
        polyline: new ymaps.Polyline([])
    };
    const addressLine = document.querySelector('#addressLine');
    const pointlist = document.querySelector('.pointlist');
    const reloadCoordinates = () => {
        const pointItems = pointlist.querySelectorAll('.pointlist__point');
        state.coordinates = [...pointItems].map(item => state.coordinates[item.dataset.number]);
        pointItems.forEach((item, i) => item.dataset.number = i);
    };

    const renderPolyline = () => {
        map.geoObjects.remove(state.polyline);
        const newPolyline = new ymaps.Polyline(state.coordinates);
        state.polyline = newPolyline;
        map.geoObjects.add(newPolyline);
    };

    function movePointItem (event) {
        const itemLayout = document.createElement('li');
        itemLayout.classList.add('pointlist__point_layout');
        const anotherItems = [...pointlist.querySelectorAll('.pointlist__point')]
                            .filter(item => item.dataset.number != this.dataset.number);
        const margin = this.style.getPropertyValue('margin');
        const itemtHeight = this.parentElement.scrollHeight / (anotherItems.length + 1);
        const shiftY = event.clientY - this.getBoundingClientRect().top;
        const getLocation = (elem) => {
           return elem.getBoundingClientRect().top + pageYOffset;
        };
        const parentLocation = getLocation(this.parentElement);
        const newSiblingNum = (pageY) => {
            return Math.round(pageY / itemtHeight);
        }
        const moveTo = (event) => {
            const needLocation = event.pageY - parentLocation - shiftY ;
            if (needLocation >= 0) {
                anotherItems.forEach(item => item.style.margin = margin);
                const siblingNum = newSiblingNum(needLocation);
                const newSibling = anotherItems[siblingNum];
                this.style.top = needLocation + 'px';
                if(newSibling) {
                    newSibling.before(itemLayout);
                } else if (anotherItems.length > 0) {
                    anotherItems[anotherItems.length - 1].after(itemLayout);
                }
            }
        };
        this.style.position = 'absolute';
        this.style.zIndex = '999';
        if (state.listLength != 1) this.style.margin = '0';
        moveTo(event);
        window.addEventListener('mousemove', moveTo);
        window.addEventListener('mouseup', ()=>{
            this.style.margin = margin;
            this.style.position = 'static';
            this.style.zIndex = '1';
            itemLayout.replaceWith(this);
            itemLayout.remove();
            window.removeEventListener('mousemove', moveTo);
            reloadCoordinates();
            renderPolyline();
        })
    }
    const createPointItem = (mark, text, num) => {
        const newItem = document.createElement('li');
        const removeKey = document.createElement('span');
        newItem.classList.add('pointlist__point');
        removeKey.classList.add('pointlist__point_remove');
        newItem.textContent = text;
        newItem.dataset.number = num;
        newItem.append(removeKey);
        removeKey.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            newItem.remove();
            map.geoObjects.remove(mark);
            reloadCoordinates();
            renderPolyline();
            state.listLength--;
        })
        newItem.addEventListener('mousedown',movePointItem);
        pointlist.append(newItem);
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
        newPlacemark.events.add('dragend', () => {
            state.coordinates[number] = newPlacemark.geometry.getCoordinates();
            renderPolyline();
        });
        state.coordinates.push(coordinate);
        map.geoObjects.add(newPlacemark);
        renderPolyline();
        createPointItem(newPlacemark, text, number);
        addressLine.value = '';
        state.listLength++;
    };
    addressLine.addEventListener('keydown', (event) => {
        if (event.keyCode == 13) {
            addPoint();
        }
    });
}