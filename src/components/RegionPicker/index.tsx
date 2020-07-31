import Taro, { useState, useEffect } from "@tarojs/taro"
import { View, Picker } from "@tarojs/components"
import { citiesJson, provinceCityJson } from '../../utils/code_city'

import './index.less'

interface IProps {
  defaultSelectedCode?: string[], // 默认选中的城市列表code array
  onComfirm: Function,
  onCancel: Function,
}

const PagePicker: Taro.FC<IProps> = props => {
  const { defaultSelectedCode } = props
  const [cityColumn, setCityColum] = useState<any[]>([])
  const [defalutValue, setDefaultValue] = useState<number[]>([0, 0, 0]) // picker选中的列数下标索引
  const [selectedName, setSelectedName] = useState<string[]>([]) // 用户选择省市区的code array
  const [selectedCode, setSelectedCode] = useState<string[]>([]) // 用户选择省市区的code array
  const [selectCode, setSelectCode] = useState<string[]>(defaultSelectedCode || ['110000', '110100']) // 用户当前选择省市区的code array

  useEffect(() => {
    // 当选中的省改变，市列表改变为当前选中省的市列表
    const provinceCode = `0,${selectCode.slice(0, 1).join(',')}`
    const cityJson = citiesJson[provinceCode] || []
    const cityData: any[] = Array.isArray(citiesJson) ? [] : Object.entries(cityJson).map(([key, value]) => {
      return { code: key, name: value }
    })
    // 当改变市的列表，区默认选中第一个市的所有县/区
    const cityCode = selectCode[1] ? `0,${selectCode.slice(0, 2).join(',')}` : `0,${selectCode[0]},${cityData[0].code}`
    const countyJson = citiesJson[cityCode] || []
    const countyData: any[] = Array.isArray(citiesJson) ? [] : Object.entries(countyJson).map(([key, value]) => {
      return { code: key, name: value }
    })
    setCityColum([provinceCityJson, cityData, countyData])
  }, [selectCode])

  /**
   * 列改变时触发
   * @param e 
   */
  const changeCityData = (e) => {
    const { column, value } = e.detail
    const codeArr = JSON.parse(JSON.stringify(selectCode))
    codeArr[column] = cityColumn[column][value].code
    // 选中的省改变，则置空市选中的code，方便useEffect中判断并初始化
    if (column === 0) {
      codeArr[1] = ''
    }
    setSelectCode(codeArr)
  }

  /**
   * 取消选择，初始化列表选择项
   */
  const cancelSelect = () => {
    setSelectCode(selectedCode)
    if (props.onCancel && typeof props.onCancel === 'function') {
      props.onCancel()
    }
  }

  /**
   * 点击确定触发
   * @param e 
   */
  const onRegionChange = (e) => {
    const { value } = e.detail
    let codeArr: string[] = [], nameArr: string[] = []
    cityColumn.forEach((item, key) => {
      if (item.length) {
        codeArr[key] = item[value[key]].code
        nameArr[key] = item[value[key]].name
      }
    })
    setDefaultValue(value)
    setSelectedName(nameArr)
    setSelectedCode(codeArr)
    if (props.onComfirm && typeof props.onComfirm === 'function') {
      props.onComfirm(value, nameArr, codeArr)
    }
  }

  return (
    <View className='container'>
      <Picker
        className='pick-control'
        mode='multiSelector'
        range={cityColumn}
        value={defalutValue}
        rangeKey='name'
        onColumnChange={changeCityData}
        onChange={onRegionChange.bind(this)}
        onCancel={cancelSelect}
      >
        <View className="picker">
          当前选择：{selectedName.filter(data => data).join(',')}
        </View>
      </Picker>
    </View>
  )
}

PagePicker.defaultProps = {
  defaultSelectedCode: ['110000', '110100'],
  onCancel: () => { },
  onComfirm: () => { }
}

export default PagePicker
