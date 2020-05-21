
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import search_icon from '@/assets/image/navbar/search.png';
import back_icon from '@/assets/image/navbar/return.png';

import './index.less';

interface IProps {
  showSearch?: boolean,
  title?: string,
  showBack?: boolean,
  searchPlaceholder?: string,
  onSearchCLick?: Function,
}

class Index extends Taro.Component<IProps>{
  static defaultProps = {
    showSearch: true,
    title: 'WeChat',
    showBack: true,
    searchPlaceholder: '搜索',
    onSearchCLick: () => { },
  }

  state = {
    navHeight: 0, // navbar高度
    paddingRight: 0, // 胶囊距离右边的距离
    top: 0, // 胶囊距离顶部的距离
  }

  componentWillMount() {
    const menuInfo = Taro.getMenuButtonBoundingClientRect();
    const sysInfo = Taro.getSystemInfoSync();
    const { height, top, right } = menuInfo;
    const { statusBarHeight, windowWidth } = sysInfo;
    const navHeight = statusBarHeight + height + (top - statusBarHeight) * 2;
    const paddingRight = windowWidth - right;
    this.setState({ navHeight, paddingRight, top });
  }

  goPrevPage = () => {
    Taro.navigateBack({ delta: 1 });
  }

  /** 跳转至搜搜页面 */
  jumpPage = (e) => {
    e.stopPropagation();
    if (this.props.onSearchCLick)
      this.props.onSearchCLick();
  }

  render() {
    const { showSearch, title, showBack, searchPlaceholder = '搜索' } = this.props;
    const { navHeight, top, paddingRight } = this.state;

    return <View className='container' style={{ height: `${navHeight}px`, padding: `${top}px ${paddingRight}px 0` }}>
      {showBack ? <View className='flex' style={{ height: `${navHeight - top}px` }} onClick={this.goPrevPage}>
        <Image className='icon back' src={back_icon} mode='aspectFill' />
      </View> : null}
      <View className='nav'>
        {showSearch ? <View className='search_box' onClick={this.jumpPage.bind(this)}>
          <Image className='icon search' src={search_icon} mode='aspectFill' />
          <Text>{searchPlaceholder}</Text>
        </View> : <View className='title'>
            {title}
          </View>}
      </View>
    </View>
  }
}

export default Index;