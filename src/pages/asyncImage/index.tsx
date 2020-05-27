import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import AsyncImage from "@/components/AsyncImage";
import './index.less'

class Index extends Taro.Component {

  render() {
    return <View className="container">
      <View className='img1'>
        <AsyncImage src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590495924013&di=eeb7765a39a87d210cf6f8f2554eae5a&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F1b92862829cb9c99aa5e68605cf1e3cee2fc72dd.jpg" width='694rpx' height='347rpx' />
      </View>
    </View>
  }
}

export default Index;