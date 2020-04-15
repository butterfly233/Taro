# 预发布环境更改配置
1、修改src/utils/baseConfig.ts文件
（1）修改服务接口地址：https://pre-trip-api.schtwz.cn
（2）修改regionId
（3）修改百度api调用ak（注：需要修改appid的情况下）：登录百度地图应用管理更改或新增
2、修改projec.config.json文件中的appid
3、修改小程序title[^全局搜索更改]
4、修改景区导览BaseUrl为<a>https://pre-navigation.schtwz.cn</a>

正式环境
1、修改src/utils/baseConfig.ts文件
（1）修改服务接口地址：https://trip-api.schtwz.cn
（2）修改regionId
（3）修改百度api调用ak（注：需要修改appid的情况下）：登录百度地图应用管理更改或新增
 (4)修改景区导览BaseUrl为<a>https://navigation.schtwz.cn</a>
2、修改projec.config.json文件中的appid
3、修改小程序title[^全局搜索更改]

版本説明
v2.0.0: 迭代版本（内含酒店模块）