import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";

import './index.less';

interface IProps {
  visible: boolean,
  title?: string,
  closeOnClickOverlay?: boolean,
  cancelText?: string,
  confirmText?: string,
  footer?: any,
  onClose: Function, // 触发关闭时的事件
  onCancel: Function, // 点击取消按钮触发的事件
  onConfirm: Function, // 点击确认按钮触发的事件	
}

class Index extends Taro.Component<IProps>{
  static defaultProps = {
    visible: false,
    title: '',
    footer: '',
    cancelText: '取消',
    confirmText: '确定',
    closeOnClickOverlay: true,
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  clickMask = (e) => {
    e.stopPropagation();
    if (this.props.closeOnClickOverlay) {
      this.props.onCancel();
    }
  }

  cancle = (e) => {
    e.stopPropagation();
    this.props.onCancel();
  }

  comfirm = (e) => {
    e.stopPropagation();
    this.props.onConfirm();
  }

  render() {
    const { visible, cancelText, confirmText, title } = this.props;
    return <View className={`modal_container ${visible ? 'modal_container--active' : ''}`}>
      <View className='modal_overlay' onClick={this.clickMask}></View>
      <View className="modal_content">
        {title ? <View className="modal_header">{this.props.title}</View> : null}
        <ScrollView scrollY className="modal_body">
          {this.props.children}
        </ScrollView>
        <View className="modal_footer">
          <View onClick={this.cancle} className='btn cancel'>{cancelText}</View>
          <View onClick={this.comfirm} className='btn comfirm'>{confirmText}</View>
        </View>
      </View>
    </View>
  }
}

export default Index;