/**
 * 雷达图组件
 *
 * 属性列表：
 *
 * size
 * radarData {}
 *
 * drawTitle 是否绘制标题（包括小标题）
 * drawSubTitle 是否绘制小标题
 * renderTitle(x, y, index) 在外部渲染标题(回调函数)
 *
 * radarStyle { 雷达图样式
 *
 *  radarPadding
 *  titlePadding
 *
 *  borderColor
 *  borderWidth
 *  borderFillColor
 *
 *  spiderLineCount
 *  spiderColor
 *  spiderWidth
 *
 *  radarBorderColor
 *  radarFillColor
 *  radarBorderWidth
 *
 *  compareRadarBorderColor
 *  compareRadarFillColor
 *  compareRadarBorderWidth
 *
 *  titleSize
 *  titleColor
 *  subTitleSize
 *  subTitleColor
 *
 * }
 *
 *  Created by fortunexiao on 2018/3/20.
 */


import React, {Component, PropTypes} from "react";
import {ART, PixelRatio, View, Dimensions} from "react-native";

const {width, height} = Dimensions.get('window');
const scale = size => width / 375 * size;
const px = size => (1 / PixelRatio.get()) * size;
const {
    Surface,
    Shape,
    Group,
    Path,
    Text,
} = ART;


/**
 * 工具方法，把弧度转换成度数
 */
const _toDu = (v) => {
    return (360 * v) / (Math.PI * 2);
}

/**
 * 根据坐标数组返回一个Path对象
 * @param pointArray
 * @returns {*}
 * @private
 */
const _createPathByArray = (pointArray) => {
    if (!pointArray || pointArray.length === 0) {
        return null;
    }
    const p = new Path();
    p.moveTo(pointArray[0].x, pointArray[0].y);
    pointArray.map(({x, y}) => {
        p.lineTo(x, y);
    });
    p.close();
    return p;
}


/**
 * 计算某个值(value, 0)在坐标系旋转后的新坐标值(x, y)
 */
const _rotate = (center, value, angle) => {
    return {
        x: center.x + Math.cos(angle) * value,
        y: center.y + Math.sin(angle) * value,
    }
}


export default class RadarView extends Component {

    static defaultProps = { // 默认配置
        size: 200,
        radarData: {},
        drawTitle: true, // 是否绘制标题（包括小标题）
        drawSubTitle: false, // 是否绘制小标题
        renderTitle: undefined, //(x, y, index)  在外部渲染标题(回调函数)

        radarStyle: { //雷达图样式
            radarPadding: scale(30),
            titlePadding: scale(15),

            borderColor: '#999999',
            borderWidth: px(1),
            borderFillColor: '#00000000',

            drawVSpiderLine: false, // 是否绘制纵向蜘蛛网线
            spiderLineCount: 3,
            spiderColor: '#cccccc',
            spiderWidth: px(1),

            radarBorderColor: '#DF9117',
            radarFillColor: 'FFC05CAA',
            radarBorderWidth: 1,

            compareRadarBorderColor: '#999999',
            compareRadarFillColor: '#aaaaaaaa',
            compareRadarBorderWidth: 1,

            titleSize: 10,
            titleColor: '#333333',
            subTitleSize: 8,
            subTitleColor: '#999999',
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            radarData: this.props.radarData,
        }

        const radarStyle = props.radarStyle;

        // 雷达图顶点和边界的距离
        this.radarPadding = radarStyle.radarPadding;

        // 雷达图顶点和标题中心点的距离
        this.titlePadding = radarStyle.titlePadding;

        const width = this.props.size;
        const height = this.props.size;

        // 中心点
        this.center = {
            x: width / 2,
            y: height / 2
        };

        // 雷达图半径
        this.radius = Math.min((height) / 2, (width) / 2) - this.radarPadding;

        // 各个顶点
        this.borderPoints = []; //
        this.radarPoints = [];
        this.compareRadarPoint = [];
        this.titlePoints = [];

        // 标题和小标题
        this.radarTitles = [];
        this.radarSubTitles = [];

        this._prepareRender();
    }


    /**
     * 注意里面用到的角度的单位都是弧度
     * 度和弧度的单位转换：360=2π
     * @private
     */
    _prepareRender = () => {
        let radarData = this.state.radarData;
        if (!radarData) {
            return;
        }
        let data = radarData.data ? radarData.data : [];
        let compare = radarData.compare ? radarData.compare : [];

        const num = data.length;

        const startAngle = -Math.PI / 2;  // 初始角度为-90°
        const angle = (Math.PI * 2) / num; // 按维度分割角度

        const radius = this.radius;
        const center = this.center;

        for (let i = 0; i < num; i++) {
            const d = data[i];
            const currentAngle = startAngle + angle * i;

            // 设置纬度的边界点
            this.borderPoints[i] = _rotate(center, radius, currentAngle);

            let value = (radarData.max === null || radarData.max === 0 || d.v === null || isNaN(d.v)) ? 0 : d.v / radarData.max;

            this.radarPoints[i] = _rotate(center, radius * value, currentAngle);
            this.radarTitles[i] = d.k;
            this.titlePoints[i] = _rotate(center, radius + this.titlePadding, currentAngle);
            this.radarSubTitles[i] = d.desc;
        }

        for (let i = 0; i < compare.length; i++) {
            const d = compare[i];
            const currentAngle = startAngle + angle * i;
            let value = (radarData.max === null || radarData.max === 0 || d.v === null || isNaN(d.v)) ? 0 : d.v / radarData.max;
            this.compareRadarPoint[i] = _rotate(center, radius * value, currentAngle);
        }
    }

    render() {
        let width = this.props.size;
        let height = this.props.size;
        return (
            <View style={{width: width, height: height}}>
                <Surface key={'surfaceRadarView'} width={width} height={height} visible={true}>
                    {this._renderBg()}
                    {this._renderRadar()}
                    {this._renderTitles()}
                </Surface>
            </View>
        )
    }

    //绘制背景,包括大背景填充色，外边框色，蜘蛛网颜色
    _renderBg = () => {
        const borderPoints = this.borderPoints;
        if (!borderPoints || borderPoints.length === 0) {
            return
        }

        // 获取样式配置
        const radarStyle = this.props.radarStyle ? this.props.radarStyle : {};

        const {
            borderColor,
            borderWidth,
            borderFillColor,
            spiderColor,
            spiderWidth,
            spiderLineCount,
            drawVSpiderLine
        } = radarStyle;

        const center = this.center;
        const radius = this.radius;
        return (
            <Group>
                {this._renderBgColor(borderPoints, borderFillColor)}
                {drawVSpiderLine ? this._renderVerticalSpiderLines(borderPoints, center, spiderColor, spiderWidth) : null}
                {this._renderHorizontalSpiderLines(borderPoints, center, radius, spiderLineCount, spiderColor, spiderWidth)}
                {this._renderBorderLine(borderPoints, borderColor, borderWidth)}
            </Group>
        )
    }

    _renderBgColor = (borderPoints, borderFillColor) => {
        return <Shape
            key='bgColor'
            d={_createPathByArray(borderPoints)}
            stroke={0}
            fill={borderFillColor}
            strokeWidth={0}/>
    }

    _renderBorderLine = (borderPoints, borderColor, borderWidth) => {
        return <Shape
            key="borderLine"
            d={_createPathByArray(borderPoints)}
            stroke={borderColor}
            strokeWidth={borderWidth}/>;
    }


    /**
     * 横向蜘蛛网线
     */
    _renderHorizontalSpiderLines = (borderPoints, center, r, spiderLineCount, spiderColor, spiderWidth) => {
        if (!borderPoints || borderPoints.length === 0) {
            return null;
        }
        if (spiderLineCount === 0) {
            return null;
        }

        const d = r / spiderLineCount;
        const startAngle = -Math.PI / 2;  // 初始角度为-90°
        const angle = (Math.PI * 2) / borderPoints.length; // 按维度分割角度
        let spiderPaths = [];
        for (let i = 0; i < spiderLineCount; i++) {
            let pr = d * i;
            let spiderPoints = [];
            for (let j = 0; j < borderPoints.length; j++) {
                let currentAngle = startAngle + angle * j;
                spiderPoints[j] = _rotate(center, pr, currentAngle);
            }
            spiderPaths[i] = _createPathByArray(spiderPoints);
        }

        let index = 0;
        return spiderPaths.map((path) => {
            return (
                <Shape
                    key={'spiderHLines' + index++}
                    d={path}
                    stroke={spiderColor} strokeWidth={spiderWidth}
                />
            )
        });
    }

    /**
     * 纵向蜘蛛网线
     */
    _renderVerticalSpiderLines = (borderPoints, center, spiderColor, spiderWidth) => {
        if (!borderPoints || borderPoints.length === 0) {
            return
        }
        let index = 0;
        return borderPoints.map(({x, y}) => {
            let path = new Path();
            path.moveTo(center.x, center.y);
            path.lineTo(x, y);
            path.close();
            return (
                <Shape
                    key={'spiderVLine_' + index++}
                    d={path}
                    stroke={spiderColor} strokeWidth={spiderWidth}
                />
            )
        });
    }


    //绘制雷达图
    _renderRadar = () => {
        const radarPoints = this.radarPoints;
        const compareRadarPoint = this.compareRadarPoint;

        if (!radarPoints || radarPoints.length === 0) {
            return null;
        }

        let {
            radarBorderColor, radarBorderWidth, radarFillColor,
            compareRadarBorderColor, compareRadarBorderWidth, compareRadarFillColor
        } = this.props.radarStyle;
        const radarPath = _createPathByArray(radarPoints);
        const compareRadarPath = _createPathByArray(compareRadarPoint);
        return (
            <Group>
                <Shape
                    d={compareRadarPath}
                    stroke={compareRadarBorderColor}
                    fill={compareRadarFillColor}
                    strokeWidth={compareRadarBorderWidth}/>
                <Shape
                    d={radarPath} stroke={radarBorderColor} fill={radarFillColor} strokeWidth={radarBorderWidth}/>
            </Group>
        )
    }


    //绘制文字
    _renderTitles = () => {
        const props = this.props;
        let {drawTitle, drawSubTitle, renderTitle} = props;
        // 不绘制标题直接返回
        if (!drawTitle) {
            return null;
        }
        let {titleSize, titleColor, subTitleSize, subTitleColor} = this.props.radarStyle;
        const titlePoint = this.titlePoints;
        const radarTitles = this.radarTitles;
        return titlePoint.map(({x, y}, index) => {
            // 如果外部处理了标题绘制，使用外部的处理，否则调用默认绘制
            let callbackResult = null;
            if (renderTitle && ((typeof renderTitle) === 'function')) {
                // console.log('call renderTitle', renderTitle, callbackResult);
                callbackResult = renderTitle(x, y, index);
            }
            if (callbackResult !== null) {
                return callbackResult;
            }
            let textValue = radarTitles[index];
            let subTitle = this.radarSubTitles[index];
            let titleY = drawSubTitle ? y - titleSize : y - titleSize / 2;
            return (
                <Group key={"title" + index}>
                    {this._renderTitleInner(index, textValue, titleSize, titleColor, x, titleY)}
                    {drawSubTitle ? this._renderTitleInner(index, subTitle, subTitleSize, subTitleColor, x, y) : null }
                </Group>
            )
        });
    }

    _renderTitleInner = (index, text, textSize, textColor, x, y) => {
        let font = "normal " + textSize + "px Helvetica";
        return <Text
            strokeWidth={1}
            fill={textColor}
            font={font}
            alignment="center"
            fontWeight="normal"
            x={x}
            y={y}>
            {text}
        </Text>
    }

}
