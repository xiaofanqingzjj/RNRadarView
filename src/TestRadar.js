/**
 * Created by fortunexiao on 2018/3/20.
 */

import React, {Component, PropTypes} from "react";
import RadarView from "./RadarView";
import {px, scale} from "./ViewUtil";
import {ART, View, StyleSheet} from "react-native";


export default class TestRadar extends React.Component {

    render() {

        let data = {
            title: 'aaa',
            max: 100,
            data: [
                {k: '在的', v: 20, desc: '这是一'},
                {k: '吃的', v: 40, desc: '这是一'},
                {k: '阿法', v: 60, desc: '这是一'},
                {k: '东东', v: 80, desc: '这是一'},
                {k: '啊', v: 100, desc: '这是一'},
                {k: 'AB', v: 60, desc: '这是一'},
                {k: 'C/D', v: 20, desc: '这是一'},
            ],
            compare: [
                {k: '在的', v: 30, desc: 'a'},
                {k: '吃的昂发', v: 30, desc: 'v'},
                {k: '阿德法', v: 30, desc: 'c'},
                {k: '东东', v: 30, desc: 'd'},
                {k: '啊', v: 70, desc: 'e'},
                {k: 'AB', v: 60, desc: 'e'},
                {k: 'gg', v: 80, desc: 'e'},
            ]
        };


        // 所有的参数都是可选
        return (<View style={styles.container}>

            <RadarView
                size={180}
                radarData={data}
            />


            <RadarView
                size={180}
                radarData={data}
                drawTitle={true}
                drawSubTitle={true}
                radarStyle={{
                    radarPadding: 40,
                    titlePadding: scale(16),


                    radarBorderColor: '#ff0000',
                    radarFillColor: '#ff0000aa',
                    radarBorderWidth: 1,

                    compareRadarBorderColor: '#cccccc',
                    compareRadarFillColor: '#cccccccc',
                    compareRadarBorderWidth: 1,


                }}/>

            <RadarView
                size={180}
                radarData={data}
                drawTitle={true}
                drawSubTitle={true}
                radarStyle={{
                    radarPadding: 40,
                    titlePadding: scale(16),

                    borderWidth: px(1),
                    borderColor: '#999999',
                    borderFillColor: '#ffffff',

                    spiderColor: '#dddddd',
                    spiderLineCount: 3,
                    spiderWidth: px(1),
                    drawVSpiderLine: true,

                    radarBorderColor: '#ff0000',
                    radarFillColor: '#ff0000aa',
                    radarBorderWidth: 1,

                    compareRadarBorderColor: '#cccccc',
                    compareRadarFillColor: '#cccccccc',
                    compareRadarBorderWidth: 1,

                    titleSize: 10,
                    titleColor: '#333333',
                    subTitleSize: 8,
                    subTitleColor: '#999999',

                }}/>
        </View>);
    }

    _renderTitle = (x, y, index) => {
        let font = "normal " + scale(12) + "px Helvetica";
        y = y - scale(12) / 2;
        return <ART.Group>
            <ART.Text
                key={index}
                strokeWidth={1}
                fill={'#ff0000'}
                font={font}
                alignment="center"
                fontWeight="normal"
                x={x}
                y={y}>
                sss
            </ART.Text>
        </ART.Group>
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    }
})