
const selectItem = [
  {
    item: '文字',
    value: 'STRING'
  },
  {
    item: '文章',
    value: 'TEXT'
  },
  {
    item: '数値',
    value: 'INTEGER'
  },
  {
    item: 'UUID',
    value: 'UUID'
  },
  {
    item: '日時',
    value: 'DATE'
  },
  {
    item: '真偽値',
    value:'BOOLEAN'
  }
];

export let tableLabel = [{
  title: '主キー',
  label: 'primaryKey',
  type: 'checkbox',
  defaultValue: false
},
{
  title: '外部キー',
  label: 'foreignKey',
  type: 'checkbox',
  defaultValue: false
},
{
  title: '要素名',
  label: 'tableName',
  type: 'text',
  defaultValue: ''
},
{
  title: 'データ属性',
  label: 'type',
  type: 'select',
  defaultValue: 'STRING',
  item: selectItem
},
{
  title: '初期値',
  label: 'defaultValue',
  type: 'text',
  defaultValue: ''
},
{
  title: '空欄を許可',
  label: 'allowNull',
  type: 'checkbox',
  defaultValue: true
},
{
  title: '自動採番',
  label: 'autoIncrement',
  type: 'checkbox',
  defaultValue: false
},
{
  title: '重複不可',
  label: 'unique',
  type: 'checkbox',
  defaultValue: false
},
{
  title: 'インデックス',
  label: 'index',
  type: 'checkbox',
  defaultValue: false
}];

