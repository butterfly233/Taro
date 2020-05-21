import Taro from "@tarojs/taro";
import { View, Image, Input } from "@tarojs/components";
import IndexList from "@/components/indexList";
import NavBar from "@/components/navbar";
import { CityList } from "@/utils/city";
import searchIcon from "@/assets/image/icon/search.png";
import deleteIcon from "@/assets/image/icon/delete.png";
import { observer, inject } from "@tarojs/mobx";
import { ColorUtil } from "@/utils/util";
import "./index.less";

@inject('globalStore')
@observer
class Index extends Taro.Component<any> {
  state = {
    listData: [],
    searchValue: "",
    emptyShow: false,
    topSize: 100,
    list: [],
  };

  componentWillMount() {
    // 模拟异步获取数据场景
    setTimeout(() => {
      this.setList(this.formatList(CityList));
    }, 100);
  }

  config: Taro.Config = {
    disableScroll: true,
  };

  formatList(list) {
    let tempArr: any[] = [];
    [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "W",
      "X",
      "Y",
      "Z",
    ].forEach((initial) => {
      let tempObj: any = {};
      tempObj.key = initial;
      tempObj.data = list
        .filter((item) => item.initial == initial)
        .map((item) => {
          return { name: item.city, code: item.code, short: item.short };
        });

      if (tempObj.data && tempObj.data.length > 0) {
        tempArr.push(tempObj);
      }
    });
    return tempArr;
  }

  search(e) {
    let value = e.detail.value;
    this.setState({
      searchValue: value,
    });
    let cityList = CityList.filter(
      (item) => item.city.indexOf(value) > -1 || item.short.indexOf(value) > -1
    );
    this.setList(this.formatList(cityList));
  }

  clear() {
    this.setState({
      searchValue: "",
    });
    this.setList(this.formatList(CityList));
  }

  setList(listData) {
    let emptyShow: boolean = listData.length == 0 ? true : false;
    let list: any[] = listData.map((item: any) => {
      item.data = item.data.map((chItem: any) => {
        return {
          firstChar: chItem.name.slice(0, 1),
          color: ColorUtil.generateColor(),
          ...chItem,
        };
      });
      return item;
    });

    this.setState({
      list,
      listData,
      emptyShow: emptyShow,
    });
  }

  itemClick(e) {
    console.log(e);
  }

  render() {
    const {navHeight} = this.props.globalStore;
    const { searchValue, emptyShow, topSize, listData, list } = this.state;

    return (
      <View id="container" style={{paddingTop:`${navHeight}px`}}>
        <NavBar showBack={true} showSearch={false} title='城市索引' />
        <View className="search">
          <View className="hd">
            <Image src={searchIcon}></Image>
          </View>
          <View className="bd">
            <Input
              onInput={this.search}
              value={searchValue}
              placeholder="搜索"
            />
          </View>
          {searchValue != "" ? (
            <View onClick={this.clear} className="ft">
              <Image src={deleteIcon}></Image>
            </View>
          ) : null}
        </View>
        <IndexList
          click={this.itemClick}
          emptyShow={emptyShow}
          topSize={topSize}
          listData={listData}
          list={list}
          color="#3F82FD"
        />
      </View>
    );
  }
}

export default Index;
