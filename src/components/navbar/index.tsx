
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import search_icon from '@/assets/image/navbar/search.png';
import back_icon from '@/assets/image/navbar/return.png';

import './index.less';

interface IProps {
  showSearch?: boolean,
  title?: true,
}

class Index extends Taro.Component<IProps>{
  static defaultProps = {
    showSearch: true,
    title: 'WeChatWeChatWeChatWeChatWeChatWeChatWeChatWeChatWeChatWeChatWeChatWeChatWeChat',
  }

  state = {
    navHeight: 0, // navbar高度
    paddingRight: 0, // 胶囊距离右边的距离
    top: 0, // 胶囊距离顶部的距离
    showBack: false, // 返回上一页
    maxWidth: 0, // 自定义的最大宽度
  }

  componentWillMount() {
    const menuInfo = Taro.getMenuButtonBoundingClientRect();
    const sysInfo = Taro.getSystemInfoSync();
    const { height, top, right, left } = menuInfo;
    const { statusBarHeight, windowWidth } = sysInfo;
    const navHeight = statusBarHeight + height + (top - statusBarHeight) * 2;
    const paddingRight = windowWidth - right;
    const { path = '' } = this.$router;
    this.setState({ navHeight, paddingRight, top, maxWidth: left, showBack: !!path });
  }

  goPrevPage = () => {
    Taro.navigateBack({ delta: 1 });
  }

  render() {
    const { showSearch, title } = this.props;
    const { navHeight, top, showBack, maxWidth, paddingRight } = this.state;
    const titleWidth = showBack ? maxWidth - paddingRight - 32 : maxWidth - paddingRight

    return <View className='container' style={{ height: `${navHeight}px`, padding: `${top}px ${paddingRight}px 0` }}>
      {showBack ? <View className='flex' style={{ height: `${navHeight - top}px` }} onClick={this.goPrevPage}>
        <Image className='icon back' src={back_icon} mode='aspectFill' />
      </View> : null}
      <View className='nav' style={{ width: `${titleWidth}px` }}>
        {showSearch ? <View className='search_box'>
          <Image className='icon search' src={search_icon} mode='aspectFill' />
          <Text>搜索默认数据</Text>
        </View> : <View className='title'>
            {title}
          </View>}
      </View>
    </View>
  }
}

export default Index;