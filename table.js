import { tableLabel } from "./schema.config.js";
import './plural.js';

export class Table {

  constructor(tableName) {
    this.tableLabel = tableLabel;
    this.tableName = tableName;
    this.tableData = [{
      tableName: this.tableName + ' id',
      type: 'UUID',
      primaryKey: true,
      allowNull: false,
    },
    {
      type: 'STRING'
    },
    {
      tableName: 'created at',
      type: 'DATE',
      allowNull: false
    },
    {
      tableName: 'updated at',
      type: 'DATE',
      allowNull: false
    }];
    this.attribute = {};
    this.index = [];
    this.div = document.createElement('div');
    this.code = "";
    this.foreignKeyList = [];
    this.columnNameList = {};
  }

  createTable() {
    if (this.div) {
      while (this.div.firstChild) {
        this.div.removeChild(this.div.firstChild);
      }
    }
    const table = document.createElement('table');
    const thead = document.createElement('tHead');
    const tbody = document.createElement('tBody');
    this.div.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
    // thead を作る

    let label = this.tableLabel.map(value => value.title);
    let createData = [...this.tableLabel];
    for (let i = 0; i < this.tableData.lehgth; i++) {
      for (const data in this.tableData[i]) {
        createData[data] = this.tableData[i][data];
      }
    }
    let tr = document.createElement('tr');
    for (let i = 0; i < label.length; i++) {
      const th = document.createElement('th');
      th.innerText = label[i];
      tr.appendChild(th);
    }
    tr.appendChild(document.createElement('th'));
    tr.appendChild(document.createElement('th'));
    thead.appendChild(tr);

    // tbody を作る
    // tableData の数でループ
    for (let i = 0; i < this.tableData.length; i++) {
      // trタグを作る
      tr = document.createElement('tr');
      let td = document.createElement('td');
      // tableLabelのシャローコピーを作って
      const rowData = JSON.parse(JSON.stringify(tableLabel));
      const tData = this.tableData[i];
      // tableLabel のセルを作るループ
      for (let j = 0; j < rowData.length; j++) {
        td = document.createElement('td');
        let input = document.createElement('input');
        const label = rowData[j].label;
        if (tData[label] !== undefined) {
          rowData[j].defaultValue = tData[label];
        }

        // rowData の type によって処理を変えてセルを作る
        switch (rowData[j].type) {
          case 'text':
            input.setAttribute('type', 'text');
            input.value = rowData[j].defaultValue;
            input.addEventListener('change', event => {

              if (event.target.value === "") {
                delete this.tableData[i][label];
              } else {
                this.tableData[i][label] = event.target.value;
              }
            });
            break;
          case 'checkbox':
            input.setAttribute('type', 'checkbox');
            input.checked = rowData[j].defaultValue;
            input.addEventListener('change', () => {
              // TODO label が allowNull なら false 側を設定
              if (input.checked === false) {
                if (label === 'allowNull') {
                  this.tableData[i][label] = false;
                } else {
                  delete this.tableData[i][label];
                }
              } else {
                if (label === 'allowNull') {
                  console.log(this.tableData[i]);
                  delete this.tableData[i][label];
                } else {
                  this.tableData[i][label] = input.checked;
                }
              }
            });
            break;
          case 'select':
            input = document.createElement('select');
            const item = rowData[j].item;
            for (let k = 0; k < item.length; k++) {
              const option = document.createElement('option');
              option.value = item[k].value;
              option.innerText = item[k].item;
              if (item[k].value === rowData[j].defaultValue) {
                option.selected = true;
              }
              input.appendChild(option);
              input.addEventListener('change', event => {
                this.tableData[i][label] = event.target.value;
              });
            }
            break;
          default:
            break;
        }
        td.appendChild(input);
        tr.appendChild(td);

      }
      // 行を生やしたり消したりするやつ
      td = document.createElement('td');
      const plusButton = document.createElement('button');
      plusButton.innerText = '+';
      plusButton.addEventListener('click', () => {
        this.tableData.splice(i + 1, 0, { type: 'STRING', allowNull: true });
        this.createTable();
      });
      td.appendChild(plusButton);
      tr.appendChild(td);

      td = document.createElement('td');
      const minusButton = document.createElement('button');
      minusButton.innerText = ' -';
      minusButton.addEventListener('click', () => {
        if (this.tableData.length > 1) {
          this.tableData.splice(i, 1);
          this.createTable();
        }
      });
      td.appendChild(minusButton);
      tr.appendChild(td);


      tbody.appendChild(tr);
    }

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.setAttribute('class','code');
    const pre = document.createElement('pre');
    const create = document.createElement('button');
    const resolve = document.createElement('code');
    pre.appendChild(resolve);
    create.innerText = 'コードをコピー';
    details.appendChild(summary);
    details.appendChild(pre);
    summary.appendChild(create);
    create.addEventListener('click', () => {
      resolve.innerText = this.createCode();
      navigator.clipboard.writeText(this.code)
        .then(() => {
          create.innerText = '更新'
        })
        .catch(err => {
          create.innerText = 'コピー失敗'
        });
    })

    this.div.appendChild(details);
    this.columnList();

    return this.div;
  }


  //コードを作るよ
  createCode() {
    const tablePlural = this.tableName.plural();
    const upper = this.upperCamelCase(this.tableName);
    this.separateData();
    this.code = `'use strict';
    const {sequelize, DataTypes} = require('./sequelize-loader');
    const {${tableLabel[3].item.map(value => value.value).join(', ')}} = DataTypes;
    
    const ${upper} = sequelize.define(
      '${tablePlural}',
      ${this.codingAttribute()},
      ${this.codingOption()}
    );
    
    module.exports = ${upper};`;
    return this.code;
  }

  // キャメルケースに変換
  camelCase(text) {
    return this.upperCamelCase(text).charAt(0).toLowerCase()
      + this.upperCamelCase(text).slice(1)
  }

  // アッパーキャメルケースに変換
  upperCamelCase(text) {
    if (!text) {
      return "";
    } else {
      const strs = text.split(/[-_ ]+/);
      const result = strs.map(
        str => str.charAt(0).toUpperCase() + str.slice(1)
      ).join('');
      return result;
    }
  }

  // 要素のコーディング
  codingAttribute() {
    return '  ' + JSON.stringify(this.attribute, null, 2).replace(/"/g, '').replace(/\n/g, '\n  ')
  }
  
  // オプションのコーディング
  codingOption(){
    return '  ' + JSON.stringify(this.index,function(key,val){
      if (typeof val === 'string'){
        return `'${val}'`;
      } else {
        return val;
      }
    }, 2).replace(/"/g,'').replace(/\n/g,'\n  ') 
  }

  // 要素とインデックスを分けたい
  separateData() {
    const att = JSON.parse(JSON.stringify(this.tableData));
    const obj = {};
    const ind = [];
    const fKey = [];
    for (let i = 0; i < att.length; i++) {
      // tableName がなければ削除
      if (!att[i].tableName) {
        att.splice(i, 0);
      } else {

        // tableName をキャメルケースに
        att[i].tableName = this.camelCase(att[i].tableName);

        // index を分解
        if (att[i].index) {
          ind.push(att[i].tableName);
          delete att[i].index;
        }

        //foreignKey を分解
        if (att[i].foreignKey) {
          fKey.push(this.camelCase(att[i].tableName));
          delete att[i].foreignKey;
        }

        // 初期値が文字列なら"'文字列'"にするよ
        if (att[i].defaultValue && !/^[-]?([1-9]\d*|0|true|false)(\.\d+)?$/.test(att[i].defaultValue)){
          att[i].defaultValue = "'" + att[i].defaultValue + "'";
        }


        // obj に作っていくよ
        const key = att[i].tableName;
        delete att[i].tableName;
        obj[key] = att[i];

      }
    }
    this.attribute = obj;

    const opt = {
      freezeTableName: true,
      timestamps: false
    };

    if (ind.length) {
      const indexes = [{ fields: ind }];
      opt.indexes = indexes;
    }

    this.foreignKeyList = fKey;
    this.index = opt;
  }

  //カラムのリストを返すよ
  columnList(){
    const list = this.tableData.map(val => this.camelCase(val.tableName)).filter(s => s !== '');
    return list;
  }

}
