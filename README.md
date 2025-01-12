# 金太阳电源产品展示网站

## 功能说明
本网站用于展示浙江长兴金太阳电源有限公司的产品信息。

### URL参数使用说明
- 访问特定产品：在URL后添加 `?id=产品ID` 
- 例如：
  - 查看锂电池系列：https://gujhhhh.github.io/jintaiyang/?id=12345
  - 查看磷酸铁锂电池：https://gujhhhh.github.io/jintaiyang/?id=12346
- 不带参数访问：显示所有产品信息

## 产品ID对照表
- 12345: 锂电池系列
- 12346: 磷酸铁锂电池

## 维护说明
如需添加新产品，请在index.html中的batteryContainer内添加新的battery-info div，并设置对应的data-id属性。 