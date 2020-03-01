import { uniqueId } from 'lodash';
import { connect } from 'react-redux';
import React, { createRef } from "react";
import * as actions from "../actions"
const mapStateToProps = (state) => ({
    text: state.text,
    map: state.map,
    points: state.points,
    polyline: state.polyline,
})
const actionsCreater = {
    addMap: actions.addMap,
    textUpdate: actions.textUpdate,
    changePointList: actions.changePointList,
    addPolyline: actions.addPolyline
};
class Points extends React.Component{
    constructor (props) {
        super(props);
        this.moveRef = React.createRef();
    }
    componentDidUpdate() {
        const pointlist = this.moveRef.current;
        const pointsHtmlElements = pointlist.querySelectorAll('.pointlist__point');
        pointsHtmlElements.forEach(point => {
            point.addEventListener('mousedown', this.moveItem)
        })
    }
    valueUpdate = (e) => {
        const {textUpdate} = this.props;
        textUpdate({text: e.target.value});
    }
    pointAdd = (e) => {
        if(e.keyCode != 13) return false;
        const {changePointList, text, textUpdate, map, points} = this.props;
        const coordinate = map.getCenter();
        const placemark = new ymaps.Placemark(coordinate, {
            balloonContent: text
        }, {
            draggable: true,
            balloonPanelMaxMapArea: 0
        });
        map.geoObjects.add(placemark)
        const newPoint = {
            name: text,
            id: uniqueId(),
            placemark,
            coordinate
        };
        const newPoints = {...points, [newPoint.id]: newPoint};
        placemark.events.add('dragend', () => {
            const {points} = this.props;
            const newPoints = Object.keys(points).reduce((acc, key) => {
                if(points[key].id != newPoint.id) return {...acc, [key]: points[key]}
                const {name, id} = points[key];
                const coordinate = placemark.geometry.getCoordinates();
                return {...acc, 
                    [key]: {
                        name, 
                        id, 
                        placemark, 
                        coordinate
                    }}
            }, {})
            changePointList({newPoints});
            this.renderPolyline(newPoints);
        });
        changePointList({newPoints});
        textUpdate({text: ''});
        this.renderPolyline(newPoints)
    }
    pointRemove = ({id, placemark}) => (e) => {
        const {changePointList, map, points} = this.props;
        map.geoObjects.remove(placemark);
        const newPoints = Object.keys(points).reduce((acc, key)=>{
            if(key == id) {
                return acc
            }
            return {...acc, [key]: points[key]}
        }, {});
        changePointList({newPoints});
        this.renderPolyline(newPoints);
    }
    renderPolyline = (points) => {
        const {map, polyline, addPolyline} = this.props;
        let coordinates = points;
        if(!Array.isArray(points)) {
            coordinates = Object.keys(points).map(key => points[key].coordinate);
        } 
        const newPolyline = new ymaps.Polyline(coordinates);
        map.geoObjects.remove(polyline);
        map.geoObjects.add(newPolyline);
        addPolyline({polyline: newPolyline})
    }
    moveItem = (e) => {
        if(!e.target.classList.contains('pointlist__point')) return;
        const margin = e.target.style.margin;
        const itemLayout = document.createElement('li');
        itemLayout.classList.add('pointlist__point_Layout');
        const pointlist = e.target.parentNode;
        const anotherItems = [...pointlist.querySelectorAll('.pointlist__point')]
                            .filter(item => item.dataset.id != e.target.dataset.id);
        const itemHeight = pointlist.scrollHeight / (anotherItems.length + 1);
        const shiftY = e.clientY - e.target.getBoundingClientRect().top;
        const getLocation = (elem) => {
           return elem.getBoundingClientRect().top + pageYOffset;
        };
        const parentLocation = getLocation(pointlist);
        const newSiblingNum = (pageY) => {
            return Math.round(pageY / itemHeight);
        }
        const moveTo = (event) => {
            const needLocation = event.pageY - parentLocation - shiftY ;
            if (needLocation >= 0) {
                const siblingNum = newSiblingNum(needLocation);
                const newSibling = anotherItems[siblingNum];
                e.target.style.top = needLocation + 'px';
                if(newSibling) {
                    newSibling.before(itemLayout);
                } else if (anotherItems.length > 0) {
                    anotherItems[anotherItems.length - 1].after(itemLayout);
                }
            }
        }
        const leaveOn = ()=>{
            e.target.style.margin = margin;
            e.target.style.position = 'static';
            e.target.style.zIndex = '1';
            itemLayout.replaceWith(e.target);
            itemLayout.remove();
            window.removeEventListener('mousemove', moveTo);
            window.removeEventListener('mouseup', leaveOn);
            this.changeItemsOrder();
        }
        e.target.style.position = 'absolute';
        e.target.style.zIndex = '999';
        if(anotherItems.length > 0) e.target.style.margin = '0px';
        moveTo(event);
        window.addEventListener('mousemove', moveTo);
        window.addEventListener('mouseup', leaveOn);
    }
    changeItemsOrder = () => {
        const {points, changePointList} = this.props;
        const items = this.moveRef.current.querySelectorAll('.pointlist__point');
        const newPoints = [...items].map(item => points[item.dataset.id].coordinate);
        this.renderPolyline(newPoints);
    }
    renderList = () => {
        const {points} = this.props;
        const pointsArr = Object.keys(points)
                               .map(key => points[key])
        if(pointsArr.length == 0) return null;
        return <ul className="pointlist">
                    {pointsArr.map((point, i) => {
                        return <li className="pointlist__point" 
                                    key={i} 
                                    data-id={point.id}>
                            {point.name}
                            <span className="pointlist__point_remove" onMouseDown={this.pointRemove(point)}>
                            </span>
                            </li>
                    })}
                </ul>
    }
    render() {
        const {text} = this.props;
        return <div className="routePoints" ref={this.moveRef}>
                    <input type="text" 
                            id="addressLine" 
                            value={text} 
                            onChange={this.valueUpdate} 
                            onKeyDown={this.pointAdd}/>
                    {this.renderList()}
                </div>
    }
}
export default connect(mapStateToProps, actionsCreater) (Points);