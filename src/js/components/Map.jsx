import { uniqueId } from 'lodash';
import { connect } from 'react-redux';
import React from "react";
import * as actions from "../actions"
const mapStateToProps = (state) => ({
    map: state.map
})
const actionsCreater = {
    addMap: actions.addMap,
}

class Map extends React.Component{
    init = () => {
        const {addMap} = this.props;
        let newMap = new ymaps.Map('map', {
            center: [54.3282400, 48.3865700],
            zoom: 12,
            controls: []
        });
        addMap({map: newMap});
    }
    componentDidMount () {
        ymaps.ready(this.init);
    }
	render() {
		return <div id="map"></div>;
	}
}
export default connect(mapStateToProps, actionsCreater) (Map)