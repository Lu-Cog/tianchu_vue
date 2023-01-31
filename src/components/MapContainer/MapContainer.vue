<template>
  <div id="container"></div>
</template>

<script>
  // import AMapLoader from '@amap/amap-jsapi-loader';
  export default {
    props: ['data'],
    data() {
      return {
        map: null,
        lineArr: [],
      }
    },
    mounted() {
      //DOM初始化完成进行地图初始化
      this.initMap();
    },
    watch: {
      data: {
        handler(newValue, oldValue) {
          this.lineArr = [];
          if (newValue.length) {
            newValue.map((item, index) => {
              if (item.lon != null && item.lat != null) {
                this.lineArr.push(new AMap.LngLat(item.lon, item.lat));
              }
            });
            this.map.clearMap()
            if (this.lineArr.length <= 1) {
              this.drawMarker()
            } else {
              this.drawLine();
              // this.walking()
            }
          }
        },
        immediate: true
      },
    },
    methods: {
      initMap() {
        this.$nextTick(() => {
          this.map = new AMap.Map('container', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 8, //初始化地图层级
            center: [111.487482, 30.551247], //初始化地图中心点位置
            animateEnable: true, // 地图平移过程中是否使用动画
          });

          if (this.lineArr.length) {
            if (this.lineArr.length <= 1) {
              this.drawMarker()
            } else {
              this.drawLine() //绘制路线
              // this.walking()
            }
          }
        });

      },
      walking() {
        var driving = new AMap.Walking({
          map: this.map
        })
        var startLngLat = [this.data[0].lon, this.data[0].lat]
        var endLngLat = [this.data[this.data.length - 1].lon, this.data[this.data.length - 1].lat]
        driving.search(startLngLat, endLngLat)
      },
      drawMarker() {
        this.Marker = new AMap.Marker({
          map: this.map,
          position: this.lineArr[0], //经纬度
          icon: new AMap.Icon({
            image: require('@/assets/icons/zhongdian.png'),
            size: new AMap.Size(50, 50), //图标所处区域大小
            imageSize: new AMap.Size(50, 50) //图标大小
          }), //终点ico
          offset: new AMap.Pixel(-25, -25),
          autoRotation: true,
          // angle:-90,
        });
        this.map.setFitView(); //自适应缩放级别
      },
      drawLine() {
        this.startMarker = new AMap.Marker({
          map: this.map,
          position: this.lineArr[0], //起点经纬度
          icon: new AMap.Icon({
            image: require('@/assets/icons/qidian.png'),
            size: new AMap.Size(50, 50), //图标所处区域大小
            imageSize: new AMap.Size(50, 50) //图标大小
          }), //起点ico
          offset: new AMap.Pixel(-25, -25),
          autoRotation: true,
          // angle:-90,
        });
        this.endMarker = new AMap.Marker({
          map: this.map,
          position: this.lineArr[this.lineArr.length - 1], //终点经纬度
          icon: new AMap.Icon({
            image: require('@/assets/icons/zhongdian.png'),
            size: new AMap.Size(50, 50), //图标所处区域大小
            imageSize: new AMap.Size(50, 50) //图标大小
          }), //终点ico
          offset: new AMap.Pixel(-25, -25),
          autoRotation: true,
        });
        // 绘制轨迹
        var polyline = new AMap.Polyline({
          map: this.map,
          path: this.lineArr,
          showDir: true,
          strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
          strokeOpacity: 1, //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          strokeWeight: 6, //线条宽度，单位：像素
          // 折线样式还支持 'dashed'
          lineJoin: 'round', //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
          lineCap: 'round', //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
        });
        // this.map.add([this.startMarker, this.endMarker]);
        this.map.setFitView(); //自适应缩放级别
      }
    },
  }
</script>
<style scoped>
  #container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 400px;
  }
</style>
