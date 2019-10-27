/**
 * 地图api
 * 2017-03-17
 * v1.0
 */
var sourceUrl = './';
var ol = window.ol;
var SFMap = window.NameSpace || {};
(function ($) {
    var resolutions = [1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
        0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625,
        0.000010728836059570312, 0.000005364418029785156]

    SFMap.Drag = function () {
	    ol.interaction.Pointer.call(this, {
	        handleDownEvent: SFMap.Drag.prototype.handleDownEvent,
	        handleDragEvent: SFMap.Drag.prototype.handleDragEvent,
	        handleUpEvent: SFMap.Drag.prototype.handleUpEvent
	    })

	    this.coordinate_ = null

	    this.cursor_ = 'pointer'

	    this.feature_ = null

	    this.previousCursor_ = undefined
    }

    SFMap.Map = function (containerId, options) {
        ol.inherits(SFMap.Drag, ol.interaction.Pointer)

        SFMap.Drag.prototype.handleDownEvent = function (evt) {
		    var map = evt.map
		    var feature = map.forEachFeatureAtPixel(evt.pixel,
		        function (feature) {
		            return feature
		        })
		    if (feature) {
		        this.coordinate_ = evt.coordinate
		        this.feature_ = feature
		        var draggable = feature.get('draggable')
		        if (!draggable) {
		            return false
		        } else {
                    if (feature.options.dragstart && (typeof feature.options.dragstart === 'function')) {
		        		feature.options.dragstart(evt)
		    		}
		        	return true
		        }
		    } else {
		        return false
		    }
        }
        SFMap.Drag.prototype.handleDragEvent = function (evt) {
		    var deltaX = evt.coordinate[0] - this.coordinate_[0]
		    var deltaY = evt.coordinate[1] - this.coordinate_[1]

		    var geometry = (this.feature_.getGeometry())
		    geometry.translate(deltaX, deltaY)

		    this.coordinate_[0] = evt.coordinate[0]
		    this.coordinate_[1] = evt.coordinate[1]
        }
        SFMap.Drag.prototype.handleUpEvent = function (evt) {
            var map = evt.map
		    var feature = map.forEachFeatureAtPixel(evt.pixel,
		        function (feature) {
		            return feature
		        })
		    if (feature) {
		    	if (feature.options.dragend && (typeof feature.options.dragend === 'function')) {
		    		feature.options.dragend(evt)
	    		}
		    } else {
		        return false
		    }
		    return false
        }

        var defaultOpt = {
            center: [ 113.940159, 22.524729 ], // 地图中心点坐标值,默认软件产业基地
            zoom: 16, // 地图初始显示的缩放级别
            crs: 'EPSG:4326', // 参考坐标系
            zooms: [3, 18 ], // 地图显示的缩放级别范围
            resolution: null,
            overlays: null, 	// 初始叠加层
            logo: SFMap.getLogo(),
           	interactions: ol.interaction.defaults().extend([new SFMap.Drag()])
        }
        $.extend(defaultOpt, options || {})
        var tileUrl
        switch (defaultOpt.style) {
        case 'night':
            //				tileUrl = 'http://10.202.69.135:8080/MapTileService/maptile?fetchtype=static&x={x}&y={y}&z={z}&project=sfmap&pic_size=256&pic_type=png8&data_name=nightMap&data_format=merged-dat&data_type=normal';
            tileUrl = 'http://sgs-rpt-core-idsp.sit.sf-express.com/MapTileService/maptile?fetchtype=static&x={x}&y={y}&z={z}&project=sfmap&pic_size=256&pic_type=png8&data_name=Shenzhen&data_format=merged-dat&data_type=normal'// 获取地图图片的地址
            break
        case 'gd':
            tileUrl = 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            break
        default :
            tileUrl = 'http://esg-lem.sf-express.com/dynamic/02/GetPng/{z}/{x}/{y}/?2'
        }
        var layers = defaultOpt.layers || [ new ol.layer.Tile(
            {
                title: "bg",
                source: new ol.source.XYZ(
                    {
                        url: tileUrl,
                        tilePixelRatio: 1
                    }),
						 opacity: defaultOpt.opacity || 1
            }) ]
        var view = new ol.View({
            center: defaultOpt.center,
            zoom: defaultOpt.zoom,
            projection: defaultOpt.crs,
            minZoom: defaultOpt.zooms[0],
            maxZoom: defaultOpt.zooms[1],
            extent: defaultOpt.extent
        })
        var map = new ol.Map({
            target: containerId,
           		interactions: defaultOpt.interactions || ol.interaction.defaults(),
            controls: options.controls || ol.control.defaults(),
            layers: layers || [],
            overlays: defaultOpt.overlays || [],
            logo: defaultOpt.logo,
            view: view
        })
        // document.getElementById(containerId).style.cursor = "url(" +sourceUrl+ "images/openhand.cur), default";
        $("#" + containerId).css("cursor", "url(" + sourceUrl + "images/demo/openhand.cur), default")

        // 屏蔽地图右键自带菜单
        $(map.getViewport()).on("contextmenu", function (e) {
            e.preventDefault()
        })
        // 获取地图视图
        map.getView = function () {
            return view
        },
        // 设置中心点
        map.setCenter = function (LngLat) {
            view.setCenter(LngLat)
        },
        // 设置缩放级别
        map.setZoom = function (Level) {
            if (Level) {
                view.setZoom(Level)
            }
        },
        // 地图放大一级显示
        map.zoomIn = function () {
            var zoom = view.getZoom()
            view.setZoom(zoom - 1)
        },
        // 地图缩小一级显示
        map.zoomOut = function () {
            var zoom = view.getZoom()
            view.setZoom(zoom + 1)
        },
        // 设置中心点和缩放级别
        map.setZoomAndCenter = function (LngLat, Level) {
            view.setCenter(LngLat)
            if (Level) {
                view.setZoom(Level)
            }
        },
        // 获取地图中心点经纬度坐标值
        map.getCenter = function () {
            return view.getCenter()
        },
        // 获取当前地图缩放级别
        map.getZoom = function () {
            return view.getZoom()
        },
        // 地图中心点平移至指定点位置
        map.panTo = function (LngLat) {
            view.animate({
                center: LngLat,
                duration: 500
            })
        },
        // 删除地图上所有的覆盖物
        map.clearOverlay = function () {
            if (map != null) {
                var overlays = map.getOverlays()
                var arr = overlays.getArray()
                for (var i = arr.length - 1; i >= 0; i--) {
                    map.removeOverlay(arr[i])
                }
            }
        },
        // 创建wms图层
        map.createLayerWms = function (p_mapName, p_wms_url, p_layers) {
            var t_mapLayer = new ol.layer.WMS(p_mapName, p_wms_url, {
                layers: p_layers,
                styles: '',
                tiled: true,
                srs: defaultProjection,
                format: defaultFormat
            }, {
                singleTile: true,
                ratio: 1
            })
            return t_mapLayer
        },
        // 创建并添加Tile图层，瓦片底图
        map.addLayerTile = function (p_LayerName) {
            var t_layer_vector = new ol.layer.Tile({
                title: p_LayerName,
                visible: true
            })
            map.addLayer(t_layer_vector)
        },
        // 创建并添加Image图层
        map.addLayerImage = function (p_LayerName) {
            var t_layer_vector = new ol.layer.Image(p_LayerName)
            return t_layer_vector
        },
        // 创建并添加Vector图层，渲染用户矢量数据
        map.addLayerVector = function (p_LayerName) {
            var t_layer_vector = new ol.layer.Vector(p_LayerName)
            return t_layer_vector
        },
        map.setDefaultCursor = function (cur) {
            document.getElementById(containerId).style.cursor = "pointer"
        },
        map.getExtent = function () {
            var resolution = map.getView().getResolution()

            var mapHeight = $(map.getTargetElement()).innerHeight()
            var mapWidth = $(map.getTargetElement()).innerWidth()
            // 偏移中心高度和宽度坐标范围
            var devWidthCoor = (resolution * mapWidth / 2)
            var devHeightCoor = (resolution * mapHeight / 2)
            var center = map.getCenter()
            var minx = parseFloat((center[0] - devWidthCoor).toFixed(6))
            var miny = parseFloat((center[1] - devHeightCoor).toFixed(6))
            var maxx = parseFloat((center[0] + devWidthCoor).toFixed(6))
            var maxy = parseFloat((center[1] + devHeightCoor).toFixed(6))
            return [minx, miny, maxx, maxy]
        }
        return map
    }

    // 图层基类
    SFMap.Layer = function () {
        this.layer = new ol.layer.Layer()
    }
    SFMap.Layer.prototype.setZooms = function (zooms) {
        var	minResolution = resolutions[zooms[1]]
        var	maxResolution = resolutions[zooms[0]]
        this.layer.setMinResolution(resolutions[zooms[1]])
        this.layer.setMaxResolution(resolutions[zooms[0] - 1])
    }

    // 图片图层
    SFMap.ImageLayer = function (options) {
        var defaultOpt = {
            opacity: 1,
            source: null,
            map: null,
            bounds: null,
            zooms: null
        }
        $.extend(defaultOpt, options || {})
        var extent = new ol.Extent(defaultOpt.bounds)
        var layer = new ol.layer.Image({
            opacity: defaultOpt.opacity,
            //			extent: extent,
            source: new ol.source.ImageArcGISRest({
                url: url
            })
        })
    }

    // Wms图层
    SFMap.WmsLayer = function (options) {
        options = $.extend({
            version: '1.3.0',
            type: "image",
            show: true,
            projection: 'EPSG:4326',
            extData: {}
        }, options)
        var map = options.map
        var zooms = options.zooms
        var minResolution, maxResolution
        if (zooms && $.isArray(zooms)) {
            minResolution = resolutions[zooms[1]]
            maxResolution = resolutions[zooms[0]]
        }
        var type = options.type
        var layer
        if (type == "tile") {
            layer = new ol.layer.Tile({
                source: new ol.source.TileWMS({
				  url: options.url,
				  params: {
                        'LAYERS': options.layers,
                        'VERSION': options.version
				  },
				  serverType: options.serverType
                }),
                minResolution: minResolution || undefined,
                maxResolution: maxResolution || undefined,
                projection: options.projection,
                visible: options.show,
                zIndex: options.zIndex,
                extData: options.extData
			  })
        } else {
            layer = new ol.layer.Image({
                source: new ol.source.ImageWMS({
				  url: options.url,
				  params: {
                        'LAYERS': options.layers,
                        'VERSION': options.version
				  },
				  serverType: options.serverType
                }),
                minResolution: minResolution || undefined,
                maxResolution: maxResolution || undefined,
                projection: options.projection,
                visible: options.show,
                zIndex: options.zIndex,
                extData: options.extData
			  })
        }
        $.fn.extend(layer, {
            setZooms: function (zooms) {
                layer.setMinResolution(resolutions[zooms[1]])
                layer.setMaxResolution(resolutions[zooms[0] - 1])
            },
            hide: function () {
                layer.setVisible(false)
            },
            show: function () {
                layer.setVisible(true)
            }
        })
        if (map) {
		  map.addLayer(layer)
        }
        return layer
    }

    SFMap.VectorSource = function (options) {
        options = $.extend({
            features: undefined
        }, options || {})
        var vectorSource = new ol.source.Vector({
            features: options.features
        })
        return vectorSource
    }
    // 矢量数据图层
    SFMap.VectorLayer = function (options) {
        options = $.extend({
            map: null,
            features: undefined,
            zooms: null,
            style: null,
            zIndex: 0,
            show: true,
            extData: {}
        }, options || {})
        var map = options.map
        var features = options.features
        var zooms = options.zooms
        var minResolution, maxResolution
        if (zooms && $.isArray(zooms)) {
            minResolution = resolutions[zooms[1]]
            maxResolution = resolutions[zooms[0]]
        }

        var vectorSource = new ol.source.Vector({
            features: features
        })
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            minResolution: minResolution || undefined,
            maxResolution: maxResolution || undefined,
            style: options.style,
            zIndex: options.zIndex,
            visible: options.show,
            extData: options.extData
        })
        $.fn.extend(vectorLayer, {
            setZooms: function (zooms) {
                vectorLayer.setMinResolution(resolutions[zooms[1]])
                vectorLayer.setMaxResolution(resolutions[zooms[0] - 1])
            },
            getSource: function () {
                return vectorSource
            },
            addFeature: function (feature) {
                vectorSource.addFeature(feature)
            },
            addFeatures: function (myfeatures) {
                vectorSource.addFeatures(myfeatures)
            },
            getFeatures: function () {
                return vectorSource.getFeatures()
            },
            removeFeature: function (feature) {
                vectorSource.removeFeature(feature)
            },
            hide: function () {
                vectorLayer.setVisible(false)
            },
            show: function () {
                vectorLayer.setVisible(true)
            },
            // setMap : function(map){
            // 	map.addLayer(vectorLayer);
            // },
            clear: function () {
                vectorSource.clear()
            }
        })
        if (map) {
            map.addLayer(vectorLayer)
        }
        return vectorLayer
    }

    SFMap.extent = function () {
        this.extend = ol.extent.extend
        this.containsCoordinate = ol.extent.containsCoordinate
    }

    // 文字标注样式
    SFMap.TextStyle = function (options) {
        options = $.extend({
            text: '',
            font: '10px sans-serif',
            textAlign: 'start',
            textScale: undefined,
            textFillColor: '#000000',
            textStrokeColor: 'rgba(0, 0, 0, 0)',
            textStrokeWidth: 1,
            offset: [0, 0]
        }, options)
        var offsetX = options.offset[0]
        var offsetY = options.offset[1]
        return new ol.style.Text({
	          text: options.text,
	          font: options.font,
			  textAlign: options.textAlign,
			  offsetX: offsetX,
			  offsetY: offsetY,
			  scale: options.textScale,
            fill: new ol.style.Fill({
                color: options.textFillColor
				  }),
            stroke: new ol.style.Stroke({
                color: options.textStrokeColor,
                width: options.textStrokeWidth
				  })
        })
    }
    // 图标样式
    SFMap.Icon = function (imageSrc, opts) {
		 opts = $.extend({
            size: undefined,		// 大小
            anchor: [0.5, 0.5],	// 图标中心
            offset: [0, 0],		// 偏移
            scale: undefined,		// 比例
            rotation: undefined
        }, opts)
        return new ol.style.Icon({
            src: imageSrc,
            img: opts.img,
            size: opts.size,
            imgSize: opts.imgSize,
            color: opts.color,
            anchor: opts.anchor,
            offset: opts.offset,
            scale: opts.scale,
            rotation: opts.rotation
        })
    }
    SFMap.CircleStyle = function (opts) {
		 opts = $.extend({
            radius: 5,		// 半径
            strokeColor: '#fff',
            fillColor: '#3399CC'
        }, opts)
        return new ol.style.Circle({
            radius: opts.radius,
            stroke: new ol.style.Stroke({
						  color: opts.strokeColor
            }),
            fill: new ol.style.Fill({
						  color: opts.fillColor
            })
					  })
    }
    // 样式
    SFMap.Style = function (options) {
        var styleType = {}
        if (options.fillColor) {
            var fillRGBAColor = options.fillOpacity ? SFMap.getRGBA(options.fillColor, options.fillOpacity) : options.fillColor
            styleType.fill = new ol.style.Fill({ // 矢量图层填充颜色，以及透明度
                color: fillRGBAColor
            })
        }
        if (options.strokeColor) {
            var strokeRGBAColor = options.strokeOpacity ? SFMap.getRGBA(options.strokeColor, options.strokeOpacity) : options.strokeColor
            styleType.stroke = new ol.style.Stroke({ // 边界样式
                color: strokeRGBAColor,
                lineDash: options.lineDash,
                width: options.strokeWeight || 3
            })
        }
        if (options.icon) {
            styleType.image = options.icon
        }
        if (options.text) {
            styleType.text = options.text
        }
        var style = new ol.style.Style(styleType)
        return style
    }

    // 所在位置
    SFMap.LocalPosition = function (map) {
        // 获取GPS坐标
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showMap, handleError, { enableHighAccuracy: true, maximumAge: 1000 })
        } else {
            console.log("您的浏览器不支持使用HTML 5来获取地理位置服务")
        }

        function showMap (value) {
            var longitude = value.coords.longitude
            var latitude = value.coords.latitude
            showLocalPosition(longitude, latitude)
        }
        function handleError (value) {
            switch (value.code) {
            case 1:
                console.log("位置服务被拒绝")
                break
            case 2:
                console.log("暂时获取不到位置信息")
                break
            case 3:
                console.log("获取信息超时")
                break
            case 4:
                console.log("未知错误")
                break
            }
        }
        function showLocalPosition (x, y) {
            var lngLat = new SFMap.LngLat(x, y)
            var localMark = new SFMap.Marker({
                image: sourceUrl + "images/demo/point.png",
                width: 32,
                height: 32,
                position: lngLat,
                map: map
            })
            map.setZoomAndCenter(lngLat, 11)
        }
    }

    // 坐标
    SFMap.LngLat = function (x, y) {
        var lngLat = [x, y]
        var wgs84Sphere = new ol.Sphere(6378137)
        lngLat.distance = function (target) {
            if (target && target[0] instanceof Array) {	// 点到线
                var lineString = new ol.geom.LineString(target)
                var closestLngLat = lineString.getClosestPoint(this)
                var result = wgs84Sphere.haversineDistance(this, closestLngLat)
                return result
            } else if (target instanceof Array) {			// 点到点
                return wgs84Sphere.haversineDistance(this, target)
            }
        }
        return lngLat
    }

    // 几何坐标点lnglat : [x,y]
    SFMap.Point = function (lnglat) {
        return new ol.geom.Point(lnglat)
    }

    // 坐标点组成的线段
    SFMap.LineString = function (points) {
        var lineString = new ol.geom.LineString(points)
        return lineString
    }

    // 几何图形
    SFMap.Feature = function (geom, opts) {
        opts = $.extend({
            geometry: geom
        }, opts)
        var feature = new ol.Feature(opts)
        feature.updateStyle = function (options) {
            var defaultOpt = {
                strokeColor: '#3366FF',
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: '',
                fillOpacity: 0
            }
            $.extend(defaultOpt, options || {})
            feature.setStyle(new SFMap.Style({
                icon: defaultOpt.icon,
                strokeColor: defaultOpt.strokeColor,
                strokeOpacity: defaultOpt.strokeOpacity,
                strokeWeight: defaultOpt.strokeWeight,
                fillColor: defaultOpt.fillColor,
                fillOpacity: defaultOpt.fillOpacity
            }))
        }
        return feature
    }

    // 折线
    SFMap.Polyline = function (options) {
        var defaultOpt = {
            map: null,
            showArrow: false,		// 是否显示方向箭头
            arrow: {
                icon: undefined
            },
            coordinates: null,
            strokeColor: '#0c821b',
            strokeStyle: 'solid',
            strokeOpacity: 1,
            strokeWeight: 5,
            zIndex: 1
        }
        $.extend(defaultOpt, options || {})
        var map = defaultOpt.map
        var lineString = new ol.geom.LineString(defaultOpt.coordinates)
        var feature = new SFMap.Feature(lineString)
        feature.setStyle(new SFMap.Style({
            strokeColor: defaultOpt.strokeColor,
            strokeOpacity: defaultOpt.strokeOpacity,
            strokeWeight: defaultOpt.strokeWeight,
            lineDash: defaultOpt.lineDash
        }))
        if (map) {
            var trackLayer = new SFMap.VectorLayer({map: map, zIndex: defaultOpt.zIndex})
            trackLayer.addFeature(feature)
            feature.clear = function () {
                trackLayer.clear()
            }
        }
        // 指定地图并显示箭头开启时
        if (map && defaultOpt.showArrow) {
            var arrow = SFMap.showArrow(map, lineString, defaultOpt.arrow)
            feature.clearArrow = function () {
                arrow.destory()
            }
		 }
        return feature
    }

    // 多边形
    SFMap.Polygon = function (coordinates) {
        var polygon = new ol.geom.Polygon(coordinates)
        polygon.contains = function (lngLat) {
            return polygon.intersectsExtent(lngLat)
        }
        return polygon
    }
    //	SFMap.Polygon = function(options){
    //		var defaultOpt = {
    //			path : null,
    //			strokeColor : '#3366FF',
    //			strokeOpacity : 1,
    //			strokeWeight : 3,
    //			fillColor : '#ffffff',
    //			fillOpacity : 0.6
    //		}
    //		$.extend(defaultOpt, options || {});
    //		var polygon = new ol.geom.Polygon(defaultOpt.path);
    //		var feature = new SFMap.Feature(polygon);
    //		feature.setStyle(new SFMap.Style({
    //				strokeColor : defaultOpt.strokeColor,
    //				strokeOpacity : defaultOpt.strokeOpacity,
    //				strokeWeight : defaultOpt.strokeWeight,
    //				fillColor : defaultOpt.fillColor,
    //				fillOpacity : defaultOpt.fillOpacity
    //			}));
    //		feature.contains = function(lngLat){
    //			return polygon.intersectsExtent(lngLat);
    //		}
    //		return feature;
    //	}

    // 圆形
    SFMap.Circle = function (options) {
        var defaultOpt = {
            center: null,
            radius: 100,
            fillColor: '#ffffff',
            fillOpacity: 0.6,
            strokeColor: '#319FD3',
            strokeOpacity: 1,
            strokeWeight: 1
        }
        $.extend(defaultOpt, options || {})

        var center = defaultOpt.center

        var wgs84Sphere = new ol.Sphere(6378137)
        var circularPolygon = ol.geom.Polygon.circular(wgs84Sphere, center,
            defaultOpt.radius, 64)
        var feature = new SFMap.Feature(circularPolygon)
        feature.setStyle(new SFMap.Style({
            strokeColor: defaultOpt.strokeColor,
            strokeOpacity: defaultOpt.strokeOpacity,
            strokeWeight: defaultOpt.strokeWeight,
            fillColor: defaultOpt.fillColor,
            fillOpacity: defaultOpt.fillOpacity
        }))
        feature.contains = function (lngLat) {
            return circularPolygon.intersectsExtent(lngLat)
        }
        return feature
    }

    // 图层切换控件
    SFMap.Control = function (controlType) {
        //		var control = {
        //				FullScreen,
        //				OverviewMap,
        //				LayerSwitcher,
        //				ScaleLine,
        //				ZoomSlider
        //			};
        return new ol.control.FullScreen({})
    }

    // 覆盖物
    SFMap.Overlay = function (container, options) {
        options = $.extend({
            offset: [0, 0],
            positioning: 'top-left'
        }, options)
        return new ol.Overlay({
            element: container,
            //			autoPan : true,
            positioning: options.positioning,
            offset: options.offset,
            autoPanAnimation: {
                duration: 250
            }
        })
    }

    /*
	 * geojson转换为适量几何图形
	 */
    SFMap.geoJSON = function (json, options) {
        var myLayer
        if (options.map) {
            myLayer = new SFMap.VectorLayer({map: options.map, zIndex: options.zIndex})
        } else {
            myLayer = new SFMap.VectorLayer()
        }
        var geo = new ol.format.GeoJSON()
        var features
        if (json instanceof Array) {
            var jsonStr = { "type": "FeatureCollection",
					  "features": json
				   }
            features = geo.readFeatures(jsonStr)
            myLayer.addFeatures(features)
        } else {
            var jsonStr = { "type": "Feature",
					  "feature": json
				   }
            features = geo.readFeature(json)
            myLayer.addFeature(features)
        }
        if (options.style) {
            if ($.isFunction(options.style)) {

            } else {
                for (var i = 0; i < features.length; i++) {
                    var feature = features[i]
                    feature.setStyle(new SFMap.Style(options.style))
                }
            }
        }
        return myLayer
    }
    /*
	 * 适量几何图形转换为geojson
	 */
    SFMap.toGeoJSON = function (object, options) {
        var geo = new ol.format.GeoJSON()
        var json
        if (typeof object.getArray==='function') {	// 传入features
            json = geo.writeFeatures(object)
        } else if (typeof object.getGeometry==='function') {	// 传入feature
            json = geo.writeFeature(object)
        } else if (typeof object.getExtent == 'function') {	// 传入geometry
            json = geo.writeGeometry(object)
        }
        return json
    }

    // 标注
    SFMap.Marker = function (options) {
        options = $.extend({
            map: null,		// 若未指定map，则需要后加上 map.addOverlay(marker);
            image: "",
            number: null,
            position: null,
            positioning: 'center-center'
        }, options)
        // image = contextPath + "/pc-rs/novatar.frameimpl/sfmap/images/marker.png";
        var image = options.image
        var number = options.number
        var position = options.position
        var positioning = options.positioning
        var offset = options.offset
        var map = options.map
        // var html = "<img class='sfmap-marker' id='mark' src='" + image + "'/>";
        var aclass = ""
        if (!image) {
            offset = offset || [-9, 0]
            positioning = 'bottom-left'
            aclass = number == null || number == undefined ? "sfmap-marker sfmap-marker-normal" : "sfmap-marker sfmap-marker-no-" + number
        }
        var html = "<a href='javascript:void(0)' class='" + aclass + "'></a>"
        var element = options.element || $(html)[0]
        var marker = new ol.Overlay({
            element: element,
            id: options.id || undefined,
            position: position,
            positioning: positioning,
            offset: offset,
            stopEvent: false
            //				autoPan : true
        })
        if (map) {
            map.addOverlay(marker)
        }
        var obj = $(element)
        if (image) {
            var imgstyle = "background:url(" + image + ") no-repeat;display: inline-block;"
            if (options.width) { imgstyle += "width:" + options.width + ";"}
            if (options.height) { imgstyle += "height:" + options.height + ";"}
            if (options.backgroundposition) {
                imgstyle += "background-position:" + options.backgroundposition + ";"
            }
            obj.attr("style", imgstyle)
        }
        marker.getPosition = function () {
            return position
        }
        marker.updatePosition = function (lnglat) {
            marker.setPosition(lnglat)
        }
        return marker
    }

    // 封装矢量元素标记
    SFMap.FeatureMarker = function (options) {
        options = $.extend({
            layer: null,
            iconUrl: sourceUrl + 'images/demo/marker.png',
            position: null,
            offset: [0, 0],
            anchor: [0.5, 0.5],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            size: [32, 32],
            zIndex: 1, // 标记层级，用于控制标记重叠的时候的显示控制
            extData: null, // 自定义扩展属性
            draggable: false, // 是否能拖动
            dragstart: null, // 自定义拖动开始响应函数
            dragend: null// 自定义拖动结束函数
        }, options)

        var markerIcon = new ol.style.Icon({
            anchor: options.anchor,	// 图标中心
            offset: options.offset,
            src: options.iconUrl,
            anchorXUnits: options.anchorXUnits,
            anchorYUnits: options.anchorYUnits,
            size: options.size
        })
        var markerStyle = new ol.style.Style({
            image: markerIcon,
            zIndex: options.zIndex
        })

        var marker = new ol.Feature({
            geometry: new ol.geom.Point(options.position),
            draggable: options.draggable,
            extData: options.extData
        })

        if (options.layer) {
            options.layer.addFeature(marker)
        }

        marker.options = options
        // 获取标记经纬度
        marker.getPosition = function () {
            return marker.getGeometry().getCoordinates()
        }

        // 设置标记经纬度
        marker.setPosition = function (lnglat) {
            // lnglat为经纬度数组
            marker.getGeometry().setCoordinates(lnglat)
        }
        marker.remove = function () {
            options.layer.getSource().removeFeature(marker)
        }

        return marker
    }

    // 信息窗口
    SFMap.InfoWindow = function (options) {
        options = $.extend({
            content: "",
            autoView: false,
            offset: [0, -11]
        }, options)
        //		var html = "<div class='popup' title='标注信息' style='min-width:200px'></div>";
        var s = $(".ol-popup").length
        var popDiv = "<div id='popup" + (s + 1) + "' class='ol-popup'>" +
				"<a href='#' id='popup-closer' class='ol-popup-closer'></a>" +
				"<div class='popup-content'></div></div>"
        var popup = $(popDiv)[0]
        var infoWindow = new ol.Overlay({
            id: options.id || 'info-window',
            element: popup,
            positioning: 'bottom-center',
            offset: options.offset,
            autoPan: options.autoView,
            autoPanAnimation: {
                duration: 250
            }
        })
        $(popup).find(".ol-popup-closer").on("click", function () {
            infoWindow.setPosition(undefined)
            this.blur()
            return false
        })
        $(popup).find(".popup-content").html(options.content)
        var element = infoWindow.getElement()
        infoWindow.setContent = function (htm) {
            $(this.getElement()).find(".popup-content").html(htm)
        }
        infoWindow.getContent = function () {
            return $(this.getElement()).find(".popup-content").html()
        }
        infoWindow.open = function (map, lnglat) {
            if (!infoWindow.getMap()) {
                map.addOverlay(infoWindow)
            }
            infoWindow.setPosition(lnglat)
        }
        infoWindow.hide = function () {
            infoWindow.setPosition(null)
        }
        return infoWindow
    }

    // 右键菜单
    SFMap.ContextMenu = function () {
        var popDiv = "<div class='sfmap-menu' style='left: 648px; top: 187px;'><ul class='context_menu'></ul></div>"
        var contextMenuPositon
        var popup = $(popDiv)[0]
        var contextMenu = new ol.Overlay({
            id: 'contextMenu',
            element: popup,
            offset: [0, 0],
            autoPan: true,
            positioning: 'top-left',
            autoPanAnimation: {
                duration: 250
            }
        })
        map.addOverlay(contextMenu)
        contextMenu.addItem = function (item, clickFn) {
            var itemHtml = "<li class='menu_item'><a href='javascript:void(0)'><i class='menu-icon menu-icon-from'></i><span>" + item + "</span></a></li>"
            var liSize = $(popup).find(".context_menu").find("li").length
            $(popup).find(".context_menu").append(itemHtml)
            $(popup).find(".context_menu").find("li").eq(liSize).on("click", function (e) {
                $.isFunction(clickFn) && clickFn(contextMenuPositon)
                contextMenu.setPosition(null)
            }
            )
            var element = $(itemHtml)[0]
            return element
        }
        contextMenu.open = function (map, lnglat) {
            contextMenuPositon = lnglat
            contextMenu.setPosition(lnglat)
        }
        contextMenu.hide = function () {
            contextMenu.setPosition(null)
        }
        return contextMenu
    }

    // 热力图图层
    SFMap.Heatmap = function (map, options) {
        options = $.extend({
            gradient: [ '#00f', '#0ff', '#0f0', '#ff0', '#f00' ],
            shadow: 250,
            radius: 8,
            blur: 15,
            opacity: 1,
            visible: true,
            zooms: [3, 18]
        }, options)
        var zooms = options.zooms
        var minResolution, maxResolution
        if (zooms && $.isArray(zooms)) {
            minResolution = resolutions[zooms[1]]
            maxResolution = resolutions[[zooms[0] - 1]]
        }
        var heatmap = new ol.layer.Heatmap({
            source: new ol.source.Vector(),
            blur: parseInt(options.blur, 10),
            radius: parseInt(options.radius, 10),
            weight: options.weight || 'weight',
            gradient: options.gradient,
            shadow: options.shadow,
            opacity: 1,
            minResolution: minResolution || undefined,
            maxResolution: maxResolution || undefined,
            visible: true
        })
        map.addLayer(heatmap)
        heatmap.setDataSet = function (data) {
            var features = new Array()
		      for (var i = 0; i < data.length; i++) {
		          var feature = new ol.Feature({
		            geometry: new ol.geom.Point([data[i][0], data[i][1]])
		          })
				  features.push(feature)
		      }
			  heatmap.getSource().addFeatures(features)
        }
        return heatmap
    }

    // 点聚合
    SFMap.MarkerClusterer = function (options) {
        var features = options.features
        var featureStyle = options.style || new ol.style.Style({
            image: new SFMap.Icon(sourceUrl + 'images/demo/point.png')
			  })
        if (options.data) {
            var count = options.data.length
            features = new Array(count)
			  for (var i = 0; i < count; ++i) {
                var coordinates = options.data[i]
                features[i] = new ol.Feature(new ol.geom.Point(coordinates))
			  }
        }
		 var source = new ol.source.Vector({
            features: features
		  })

		  var clusterSource = new ol.source.Cluster({
            distance: options.distance || 20,
            projection: 'EPSG:4326',
            source: source
		  })
		  var styleCache = {}
		  var clusters = new ol.layer.Vector({
            source: clusterSource,
            zIndex: options.zIndex,
            style: function (feature) {
			  var size = feature.get('features').length
			  if (size > 1) {
				  var style = styleCache[size]
				  if (!style) {
                        style = new ol.style.Style({
					  image: new ol.style.Circle({
                                radius: 10,
                                stroke: new ol.style.Stroke({
						  color: '#fff'
                                }),
                                fill: new ol.style.Fill({
						  color: '#3399CC'
                                })
					  }),
					  text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
						  color: '#fff'
                                })
					  })
                        })
                        styleCache[size] = style
				  }
			  return style
			  } else {
				  return feature.get('features')[0].getStyle() || featureStyle
			  }
            }
		  })
		  if (options.map) {
			  map.addLayer(clusters)
		  }
		  clusters.clear = function () {
			  clusterSource.clear()
		  }
		  return clusters
    }

    // 绘制工具
    SFMap.DrawingManager = function (map, options) {
        var draw
        var html = "<div class='SFMap_Drawing'>"
        html += "<div class='SFMap_Drawing_panel'>"
        html += "<a class='SFMap_Drawing_box SFMap_drawtool_hander' drawingtype='hander' href='javascript:void(0)' title='拖动地图' onfocus='this.blur()'></a>"
        html += "<a class='SFMap_Drawing_box SFMap_drawtool_point' drawingtype='point' href='javascript:void(0)' title='画点' onfocus='this.blur()'></a>"
        html += "<a class='SFMap_Drawing_box SFMap_drawtool_circle' drawingtype='circle' href='javascript:void(0)' title='画圆' onfocus='this.blur()'></a>"
        html += "<a class='SFMap_Drawing_box SFMap_drawtool_polyline' drawingtype='polyline' href='javascript:void(0)' title='画折线' onfocus='this.blur()'></a>"
        html += "<a class='SFMap_Drawing_box SFMap_drawtool_polygon' drawingtype='polygon' href='javascript:void(0)' title='画多边形' onfocus='this.blur()'></a>"
        // html += "<a class='SFMap_Drawing_box SFMap_drawtool_rectangle SFMap_drawtool_last' drawingtype='rectangle' href='javascript:void(0)' title='画矩形' onfocus='this.blur()'></a>";
        html += "</div></div>"
        $(map.getTargetElement()).append(html)
        $(".SFMap_Drawing").find("a").click(function () {
            var thisA = $(this)
            var drawingtype = thisA.attr("drawingtype")
            thisA.removeClass("SFMap_drawtool_" + drawingtype).addClass("SFMap_drawtool_" + drawingtype + "_hover")
            // 先移除绘制实例
            map.removeInteraction(draw)
            // 加入绘制
            if (drawingtype == 'hander') {

            } else if (drawingtype == 'point') {
                draw = new SFMap.PointDraw(map)
            } else if (drawingtype == 'circle') {
                draw = new SFMap.CircleDraw(map)
            } else if (drawingtype == 'polyline') {
                draw = new SFMap.PolylineDraw(map)
            } else if (drawingtype == 'polygon') {
                draw = new SFMap.PolygonDraw(map)
            }
            draw.open()
            thisA.siblings("a").each(function () {
                var siblingsA = $(this)
                var siblingsDrawingtype = siblingsA.attr("drawingtype")
                if (siblingsA.hasClass("SFMap_drawtool_" + siblingsDrawingtype + "_hover")) {
                    siblingsA.removeClass("SFMap_drawtool_" + siblingsDrawingtype + "_hover").addClass("SFMap_drawtool_" + siblingsDrawingtype)
                }
            })
        })
    }

    // 点的绘制
    SFMap.PointDraw = function (map, options) {
        options = $.extend({
            styleOptions: {
                image: sourceUrl + 'images/demo/marker.png',
                offset: [0.5, 0.8]
            }
        }, options)

        // 创建layer和source实例
        var features = new ol.Collection()
        var source = new ol.source.Vector({features: features, wrapX: false})
        // 设置绘制成的图片
        var vector_layer = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                image: new SFMap.Icon(options.styleOptions.image, {
						  anchor: options.styleOptions.offset // 设置图标偏移位置
                })
            })
        })
        map.addLayer(vector_layer)
        var draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ ("Point"),
            // 设置绘制草图的样式
            style: new ol.style.Style({
                image: new SFMap.Icon(options.styleOptions.image, {
						  anchor: options.styleOptions.offset // 设置图标偏移位置
                })
            })
        })
        map.addInteraction(draw)
        // 默认不开启
        draw.setActive(false)
        // 绑定事件
        draw.open = function () {
            draw.setActive(true)
        }
        draw.close = function () {
            draw.setActive(false)
        }
        draw.clear = function () {
            source.clear()
        }
        draw.getFeatures = function () {
            return features
        }
        draw.getFeatureSize = function () {
            return features.getArray().length
        }
        return draw
    }

    // 线的绘制
    SFMap.PolylineDraw = function (map, options) {
        var defaultOpt = {
            freehand: false,
            styleOptions: {
                strokeColor: '#f33',
                strokeOpacity: 1,
                strokeWeight: 3
            }
        }
        $.extend(defaultOpt, options || {})

        var features = new ol.Collection()
        // 创建layer和source实例
        var source = new ol.source.Vector({features: features, wrapX: false})
        var	vector_layer = new ol.layer.Vector({
            source: source,
            style: new SFMap.Style({
                strokeColor: defaultOpt.styleOptions.strokeColor,
                strokeOpacity: defaultOpt.styleOptions.strokeOpacity,
                strokeWeight: defaultOpt.styleOptions.strokeWeight
            })
        })
        map.addLayer(vector_layer)
        var draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ ("LineString"),
            freehand: defaultOpt.freehand,
            style: new SFMap.Style({
                strokeColor: defaultOpt.styleOptions.strokeColor,
                strokeOpacity: defaultOpt.styleOptions.strokeOpacity,
                strokeWeight: defaultOpt.styleOptions.strokeWeight
            })
        })
        map.addInteraction(draw)
        // 默认不开启
        draw.setActive(false)
        // 绑定事件
        draw.open = function () {
            draw.setActive(true)
        }
        draw.close = function () {
            draw.setActive(false)
        }
        draw.clear = function () {
            source.clear()
        }
        draw.getSource = function () {
            return source
        }
        draw.getFeatures = function () {
            return features
        }
        draw.getFeatureSize = function () {
            return features.getArray().length
        }
        return draw
    }

    // 圆的绘制
    SFMap.CircleDraw = function (map, options) {
        var defaultOpt = {
            layer: null,
            freehand: false,
            styleOptions: {
                fillColor: '#f33',
                fillOpacity: 0.5,
                strokeColor: '#f33',
                strokeOpacity: 1,
                strokeWeight: 3
            }
        }
        $.extend(defaultOpt, options || {})

        // 创建layer和source实例
        var features = new ol.Collection()
        var	source = new ol.source.Vector({features: features, wrapX: false})
        var	vector_layer = new ol.layer.Vector({
            source: source,
            style: new SFMap.Style({
                strokeColor: defaultOpt.styleOptions.strokeColor,
                strokeOpacity: defaultOpt.styleOptions.strokeOpacity,
                strokeWeight: defaultOpt.styleOptions.strokeWeight,
                fillColor: defaultOpt.styleOptions.fillColor,
                fillOpacity: defaultOpt.styleOptions.fillOpacity
            })
        })
        map.addLayer(vector_layer)
        var draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ ("Circle"),
            freehand: defaultOpt.freehand,
            style: new SFMap.Style({
                strokeColor: defaultOpt.styleOptions.strokeColor,
                strokeOpacity: defaultOpt.styleOptions.strokeOpacity,
                strokeWeight: defaultOpt.styleOptions.strokeWeight,
                fillColor: defaultOpt.styleOptions.fillColor,
                fillOpacity: defaultOpt.styleOptions.fillOpacity
            })
        })
        map.addInteraction(draw)
        // 默认不开启
        draw.setActive(false)
        // 绑定事件
        draw.open = function () {
            draw.setActive(true)
        }
        draw.close = function () {
            draw.setActive(false)
        }
        draw.clear = function () {
            source.clear()
        }
        draw.getSource = function () {
            return source
        }
        draw.getFeatures = function () {
            return features
        }
        draw.getFeatureSize = function () {
            return features.getArray().length
        }
        return draw
    }

    // 多边形的绘制
    SFMap.PolygonDraw = function (map, options) {
        var defaultOpt = {
            freehand: false,
            styleOptions: {
                fillColor: '#f33',
                fillOpacity: 0.6,
                strokeColor: '#f33',
                strokeOpacity: 1,
                strokeWeight: 3
            }
        }
        $.extend(defaultOpt, options || {})

        // 创建layer和source实例
        var features = new ol.Collection()
        var	source = new ol.source.Vector({features: features, wrapX: false})
        var	vector_layer = new ol.layer.Vector({
            source: source,
            style: new SFMap.Style({
                strokeColor: defaultOpt.styleOptions.strokeColor,
                strokeOpacity: defaultOpt.styleOptions.strokeOpacity,
                strokeWeight: defaultOpt.styleOptions.strokeWeight,
                fillColor: defaultOpt.styleOptions.fillColor,
                fillOpacity: defaultOpt.styleOptions.fillOpacity
            })
        })
        map.addLayer(vector_layer)
        var draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ ("Polygon"),
            freehand: defaultOpt.freehand,
            style: new SFMap.Style({
                strokeColor: defaultOpt.styleOptions.strokeColor,
                strokeOpacity: defaultOpt.styleOptions.strokeOpacity,
                strokeWeight: defaultOpt.styleOptions.strokeWeight,
                fillColor: defaultOpt.styleOptions.fillColor,
                fillOpacity: defaultOpt.styleOptions.fillOpacity
            })
        })
        map.addInteraction(draw)
        // 默认不开启
        draw.setActive(false)
        // 绑定事件
        draw.open = function () {
            draw.setActive(true)
        }
        draw.close = function () {
            draw.setActive(false)
        }
        draw.clear = function () {
            source.clear()
        }
        draw.getFeatures = function () {
            return features
        }
        draw.getFeatureSize = function () {
            return features.getArray().length
        }
        return draw
    }

    // 选择功能
    SFMap.Select = function (map, options) {
        options = $.extend({
            removeCondition: undefined,
            type: "singleClick",
            layers: undefined
        }, options)
        var condition
        switch (options.type) {
        case "singleClick":
            condition = ol.events.condition.singleClick
            break
        case "click":
            condition = ol.events.condition.click
            break
        case "hover":
            condition = ol.events.condition.pointerMove
            break
        case "altClick":
            condition = function (mapBrowserEvent) {
		          return ol.events.condition.click(mapBrowserEvent) &&
	              ol.events.condition.altKeyOnly(mapBrowserEvent)
	        }
            break
        default:
            condition = ol.events.condition.singleClick
            break
        }
        var overlayStyle = (function () {
            var defaultStyles = {}
            defaultStyles['Polygon'] = [options.polygonStyle || new SFMap.Style({
                fillColor: [255, 255, 255, 0.5],
                strokeColor: [0, 153, 255, 1],
                strokeWeight: 2

            })]
            defaultStyles['MultiPolygon'] = defaultStyles['Polygon']
            defaultStyles['LineString'] = [
                options.polylineStyle || new ol.style.Style({
	          stroke: new ol.style.Stroke({
	              color: [0, 153, 255, 1],
	              width: 3
	            })
                })
            ]
            defaultStyles['MultiLineString'] = defaultStyles['LineString']
            defaultStyles['Point'] = [
                options.pointStyle || new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 3,
                        fill: new ol.style.Fill({
                            color: [0, 153, 255, 1]
                        }),
                        stroke: new ol.style.Stroke({
                            color: [255, 255, 255, 0.75],
                            width: 1.5
                        })
                    }),
                    zIndex: 10000
                })
            ]
            defaultStyles['MultiPoint'] = defaultStyles['Point']
            defaultStyles['GeometryCollection'] = defaultStyles['Polygon'].concat(defaultStyles['Point'])
            return function (feature) {
                return defaultStyles[feature.getGeometry().getType()]
            }
        })()
        var select = new ol.interaction.Select({
            condition: condition,
            layers: options.layers,
            style: options.style || overlayStyle
		  })
        map.addInteraction(select)
        // 默认不开启
        // select.setActive(false);
        select.open = function () {
            select.setActive(true)
        }
        select.close = function () {
            select.setActive(false)
        }
        select.remove = function () {
            map.removeInteraction(select)
        }
        select.add = function () {
            map.addInteraction(select)
        }
        return select
    }

    // 绘图修改功能
    SFMap.DrawModify = function (map, options) {
        options = $.extend({
            pixelTolerance: 10
        }, options)
        var modify = new ol.interaction.Modify({
            features: options.features,
            source: options.source,
            style: options.style,
            pixelTolerance: options.pixelTolerance,
            deleteCondition: function (event) {
			  return ol.events.condition.shiftKeyOnly(event) &&
				  ol.events.condition.singleClick(event)
            }
		  })
        map.addInteraction(modify)
        // 默认不开启
        modify.setActive(false)
        modify.open = function () {
            modify.setActive(true)
        }
        modify.close = function () {
            modify.setActive(false)
        }
        return modify
    }

    // 吸附
    SFMap.Snap = function (map, options) {
        var snap = new ol.interaction.Snap({
            features: options.features || undefined,
            pixelTolerance: options.pixelTolerance || 10,
            source: options.source || undefined
        })
        map.addInteraction(snap)
        snap.setActive(false)
        snap.open = function () {
            snap.setActive(true)
        }
        snap.close = function () {
            snap.setActive(false)
        }
        return snap
    }

    // 轨迹播放
    SFMap.TrackAnimation = function (map, routeCoords, options) {
        var defaultOpt = {
            autoView: true,		// 是否开启自动视野调整
            speed: 10,				// 调整播放速度，为1时代表1秒走一个坐标点，为60时代表1秒走60个坐标点，由于帧数原因，超过60会导致跳点，故限制范围为[1,60]
            enableRotation: false,	// 是否随轨迹走向进行旋转
            icon: new ol.style.Circle({
                radius: 7,
                snapToPixel: false,
                fill: new ol.style.Fill({color: 'black'}),
                stroke: new ol.style.Stroke({
					  color: 'white', width: 2
                })
				  }),
            showInfoWindow: false,
            contentFn: null,
            endCallback: null,
            zIndex: 1000
        }
        $.extend(defaultOpt, options || {})
        // 增加图层显示移动点
        var markerLayer = new SFMap.VectorLayer({map: map, zIndex: defaultOpt.zIndex})
        var infoWindow = new SFMap.InfoWindow({offset: [0, -5]})		// 信息窗体
        var isShowWindow = defaultOpt.showInfoWindow				// 是否展示
        var icon = defaultOpt.icon
        var routeLength = routeCoords.length
        var animate			// 动画实例
        var playing = false	// 动画状态
        var progress = 0
        if (defaultOpt.speed < 1 || defaultOpt.speed > 60) return
        var speed = parseInt(60 / defaultOpt.speed)
        // 动画开始
        var startAnimate = function () {
            if (!playing) {
                playing = true
            }
            progress += 1
            animate = requestAnimationFrame(startAnimate)
            moveFeature()
        }
        // 动画每一帧
        var moveFeature = function () {
            if (!playing) {
                return false
            }
            var currentCoord, currentPoint, dx, dy
            if (progress % speed == 0) {
                currentCoord = routeCoords[progress / speed]
                dx = routeCoords[progress / speed][0] - routeCoords[progress / speed - 1][0]
                dy = routeCoords[progress / speed][1] - routeCoords[progress / speed - 1][1]

                $.isFunction(defaultOpt.passCallback) && defaultOpt.passCallback(progress / speed)
            } else {
                var lastCoord = routeCoords[Math.floor(progress / speed)]
                var nextCoord = routeCoords[Math.floor(progress / speed + 1)]
                // 坐标位置不变时，直接跳过
                if (lastCoord[0] == nextCoord[0] && lastCoord[1] == nextCoord[1]) {
                    if (progress / speed == routeLength - 1) {
                        cancelAnimationFrame(animate)
                    }
                    return
                }
                var scale = (progress % speed) / speed
                currentCoord = getBetweenPointByScale(lastCoord, nextCoord, scale)
                dx = nextCoord[0] - lastCoord[0]
                dy = nextCoord[1] - lastCoord[1]
            }
            currentPoint = new ol.geom.Point(currentCoord)
            var rotation = Math.atan2(dy, dx)
            var styleGeomarker = new ol.style.Style({
                image: icon
            })
            // 结束标识
            if ($.isFunction(defaultOpt.endCallback)) {
                var endCoord = routeCoords[routeLength - 1]
                if (currentCoord[0] == endCoord[0] && currentCoord[1] == endCoord[1]) {
                    defaultOpt.endCallback()
                }
            }
            if (defaultOpt.enableRotation) {
                icon.setRotation(-rotation)
            }
            // 是否开启自动视野调整
            if (defaultOpt.autoView) {
                moveCenterByRange(currentCoord)
            }
            // 是否展示信息窗体
            if (isShowWindow) {
                infoWindow.setContent($.isFunction(defaultOpt.contentFn) && defaultOpt.contentFn(Math.floor(progress / speed)))
                infoWindow.open(map, currentCoord)
            }
            var feature = new ol.Feature(currentPoint)
            markerLayer.setStyle(styleGeomarker)
            markerLayer.getSource().clear()
            markerLayer.getSource().addFeature(feature)
            if (progress / speed == routeLength - 1) {
                playing = false
                cancelAnimationFrame(animate)
            }
        }
        // 根据当前点与中心点的位置重新确立中心点
        var moveCenterByRange = function (point) {
            var view = map.getView()
            var center = view.getCenter()
            var mapHeight = $(map.getTargetElement()).innerHeight()
            var mapWidth = $(map.getTargetElement()).innerWidth()
            var resoByMe = view.getResolution()
            // 偏移中心高度和宽度坐标范围，宽度减去左侧浮动框宽度
            var devWidthCoor = resoByMe * mapWidth / 2
            var devHeightCoor = resoByMe * mapHeight / 2
            // 实际坐标点的横坐标和纵坐标偏移量
            var realDevWidth = Math.abs(point[0] - center[0])
            var realDevHeight = Math.abs(point[1] - center[1])
            // 超出屏幕范围则重新设中心点
            if (realDevWidth >= devWidthCoor || realDevHeight >= devHeightCoor) {
                view.setCenter([point[0], point[1]])
            }
        }
        // 按百分比取两个点之间的点
        var getBetweenPointByScale = function (startPoint, endPoint, scale) {
            var x = startPoint[0] + (scale * (endPoint[0] - startPoint[0]))
            var y = startPoint[1] + (scale * (endPoint[1] - startPoint[1]))
            return [ x, y ]
        }
        moveFeature.start = function () {
            if (playing) {
                return false
            }
            if (progress / speed == routeLength - 1) {
                progress = 0
            }
            startAnimate()
        }
        moveFeature.stop = function (ended) {
            progress = 0
            playing = false
            cancelAnimationFrame(animate)
        }
        moveFeature.pause = function () {
            playing = false
            cancelAnimationFrame(animate)
        }
        moveFeature.showInfoWindow = function () {
            isShowWindow = true
        }
        moveFeature.hideInfoWindow = function () {
            infoWindow.hide()
            isShowWindow = false
        }
        moveFeature.getMarkerLayer = function () {
            return markerLayer
        }
        return moveFeature
    }

    // 十六进制转rgba
    SFMap.getRGBA = function (hex, opacity) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
        var sColor = hex.toLowerCase()
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#"
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
                }
                sColor = sColorNew
            }
            // 处理六位的颜色值
            var sColorChange = []
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)))
            }
            return "rgba(" + sColorChange.join(",") + "," + opacity + ")"
        } else {
            return sColor
        }
    }

    // SF logo
    SFMap.getLogo = function () {
		  var logoElement = document.createElement('a')
		  logoElement.href = 'http://www.sf-express.com/'
		  logoElement.target = '_blank'

		  var logoImage = document.createElement('img')
		  logoImage.src = sourceUrl + 'images/demo/sf_logo.png'
		  logoImage.style = "float: left;"

		  logoElement.appendChild(logoImage)

		  var label = document.createElement('label')
		  label.innerHTML = "©2017 顺丰科技"
		  label.style = "margin:7px;float: left;"
		 // label.style = "color:white;font-family: STXihei, 'Microsoft YaHei';font-size: 0.7rem;";
		  logoElement.style = "color:black;text-decoration: none;margin: 6px;"
		  logoElement.appendChild(label)
		  return logoElement
    }

    // 路线显示方向箭头
    SFMap.showArrow = function (map, lineString, options) {
        options = $.extend({
            icon: sourceUrl + "images/demo/arrow.png"
        }, options)
        var arrowLayer = new SFMap.VectorLayer({map: map, zIndex: 1000})
        var segments = []			// 线段节点
        var rotations = []
        // 遍历线段的所有分段，将各两端端点存放起来
        lineString.forEachSegment(function (start, end) {
		  var dx = end[0] - start[0]
		  var dy = end[1] - start[1]
		  var rotation = Math.atan2(dy, dx)
		  var segment = {
                x1: start[0],
                y1: start[1],
                x2: end[0],
                y2: end[1]
		  }
		  segments.push(segment)
		  rotations.push(rotation)
        })
        createArrow()
        function createArrow () {
            if (!arrowLayer.getVisible()) {
                return
            }
            arrowLayer.clear()
            var segmentSize = segments.length		// 线段数量
            var sectionPixel = 50					// 分段像素
            var surplusPixel = 0					// 每段分段后剩余像素
            var needArrowArray = []					// 需要箭头的点
            var resoByMe = map.getView().getResolution()	// 分辨率，随地图缩放级别变化
            for (var i = 0; i < segmentSize; i++) {
                var seg = segments[i]
                // 计算线段像素长
                var pixelLength = (getSegmentLength(seg) / resoByMe).toFixed(6)
                var totalPixelLength = parseFloat(pixelLength) + surplusPixel
                if (totalPixelLength >= sectionPixel) {
                    // 将上一段剩余像素累积到此段
                    var sectionSize = Math.floor(totalPixelLength / sectionPixel)	// 分节数

                    getNeedArrowFromSection(seg, sectionSize, i)
                    surplusPixel = totalPixelLength % sectionPixel
                } else {
                    surplusPixel = totalPixelLength
                }
            }
            // 为节省资源，按线段数生成图标样式
            var imageStyle = []
            for (var k = 0; k < segmentSize; k++) {
                var icon = new SFMap.Icon(options.icon, {
                    anchor: [0.5, 0.5],
                    size: options.size,
                    scale: options.scale,
                    imgSize: options.imgSize,
                    rotation: -rotations[k]
                })
                imageStyle.push(new SFMap.Style({icon: icon}))
            }
            // 遍历所需箭头位置，添加箭头矢量图标
            for (var m = 0; m < needArrowArray.length; m++) {
                var point = new SFMap.Point([needArrowArray[m].x, needArrowArray[m].y])
                var feature = new SFMap.Feature(point)
                feature.setStyle(imageStyle[needArrowArray[m].segNo])
                arrowLayer.addFeature(feature)
            }

            function getSegmentLength (seg) {
                return Math.sqrt(Math.pow((seg.x2 - seg.x1), 2) + Math.pow((seg.y2 - seg.y1), 2))
            }
            function getNeedArrowFromSection (seg, sectionSize) {
                if (!sectionSize) return
                for (var j = 0; j < sectionSize; j++) {
                    // 第一节需要去掉上段剩余像素 即与起始端点坐标的像素差
                    var firstDifPixel = (sectionPixel - surplusPixel).toFixed(6)
                    // 其它节点在此基础上加分段像素
                    var difPixel = parseFloat(firstDifPixel) + sectionPixel * j
                    // 像素差乘以分辨率可得坐标的差
                    var difGeo = difPixel * resoByMe
                    var difX = difGeo * Math.cos(rotations[i])
                    var difY = difGeo * Math.sin(rotations[i])
                    var x = seg.x1 + parseFloat(difX.toFixed(6))
                    var y = seg.y1 + parseFloat(difY.toFixed(6))
                    // 箭头坐标位置和角度
                    var needArrow = {
                        x: x,
                        y: y,
                        segNo: i
                    }
                    needArrowArray.push(needArrow)
                }
            }
        }
        // 绑定分辨率变化事件，地图缩放时重新刷新箭头
		 map.getView().on("change:resolution", function () {
            var zoom = map.getZoom()
            // if(Number.isInteger(zoom)){
            if ((zoom | 0) === zoom) {
                createArrow()
            }
		 })
		 arrowLayer.destory = function () {
			 arrowLayer.setVisible(false)
			 arrowLayer.setMap(null)
            //			 map.getView().un("change:resolution.test");
		 }
		 return arrowLayer
    }

    SFMap.WindowContent = function (options) {
        var html = "<div class='infowindow_body'>"
        if (options.header) {
            html += "<div class='infowindow_header'>" + options.header + "</div>"
        }
        if (options.content) {
            var content = options.content
            for (var key in content) {
                html += "<div class='infowindow_item'><div class='infowindow_title'>" + key +
					"</div><div class='infowindow_content'>" + content[key] + "</div></div>"
            }
        }
        html += "</div>"
        return html
    }
    SFMap.CustomMarker = function (options) {
        options = $.extend({
          map: null,
          image: '',
          text: '',
          position: null,
          positioning: 'center-center',
          aclass: ''
        }, options);
        const aclass = options.aclass;
        var html = `<a href="javascript:void(0)" class="${aclass}" style="color: ${options.color}"></a>`;
        var element = $(html)[0];
        var marker = new ol.Overlay({
          element: element,
          id: options.id || undefined,
          position: options.position,
          positioning: options.positioning,
          offset: options.offset,
          stopEvent: false
        });
        if (options.map) {
          options.map.addOverlay(marker);
        }
    
        return marker;
      }
})(jQuery)
export {SFMap} 
