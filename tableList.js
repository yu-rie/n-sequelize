import { Table } from "./table.js";

export class TableList {
  constructor(schemaName = 'none') {
    this.schemaName = schemaName;
    this.list = [
      {
        tableName: 'user',
        open: true,
        tableObj: new Table('user')
      },
      {
        tableName: '',
        open: false
      }
    ];
    this.relation = [{}];
    this.div = document.createElement('div');
    this.relation = document.createElement('div');
    this.relationList = [];
    this.relationData = [];
  }

  createList() {
    if (this.div) {
      while (this.div.firstChild) {
        this.div.removeChild(this.div.firstChild);
      }
    }
    for (let i = 0; i < this.list.length; i++) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const input = document.createElement('input');
      summary.innerText = 'テーブル ' + ('00' + (i + 1)).slice(-2) + ': ';
      input.setAttribute('type', 'text');
      input.value = this.list[i].tableName;
      input.addEventListener('input', (event) => {
        this.list[i].tableName = event.target.value;
      })
      summary.appendChild(input);
      details.open = this.list[i].open;
      details.addEventListener('toggle', () => {
        this.list[i].open = details.open;
      });
      details.appendChild(summary);

      if (this.list[i].tableObj) {
        details.appendChild(this.list[i].tableObj.createTable());

        // プラスボタン
        const plusButton = document.createElement('button');
        plusButton.innerText = '+';
        plusButton.addEventListener('click', () => {
          this.list.splice(i + 1, 0, { tableName: '', open: false });
          this.createList();
        });
        summary.appendChild(plusButton);

        // マイナスボタン
        const minusButton = document.createElement('button');
        minusButton.innerText = '-';
        minusButton.addEventListener('click', () => {
          if (this.list.length > 1) {
            this.list.splice(i, 1);
            this.createList();
          }
        })
        summary.appendChild(minusButton);
      } else {
        // まだテーブルが無いとき
        // 作成ボタン
        const createButton = document.createElement('button');
        createButton.innerText = 'テーブル作成';
        createButton.addEventListener('click', () => {
          const tName = createButton.previousElementSibling.value;
          this.list[i].tableName = tName;
          this.list[i].open = true;
          this.list[i].tableObj = new Table(tName);
          this.createList();
        })
        summary.appendChild(createButton);

        // プラスボタン
        const plusButton = document.createElement('button');
        plusButton.innerText = '+';
        plusButton.addEventListener('click', () => {
          this.list.splice(i + 1, 0, { tableName: '', open: false });
          this.createList();
        });
        summary.appendChild(plusButton);


        // マイナスボタン
        const minusButton = document.createElement('button');
        minusButton.innerText = '-';
        minusButton.addEventListener('click', () => {
          if (this.list.length > 1) {
            this.list.splice(i, 1);
            this.createList();
          }
        })
        summary.appendChild(minusButton);
      }
      this.div.appendChild(details);
    }
    return this.div;
  }

  // リレーション用のリストを作る
  createRelation() {
    const tableNameList = this.list.map(value => this.upperCamelCase(value.tableName)).filter(s => s !== '');
    const relationList = [];

    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].tableName) {
        relationList.push({
          title: this.upperCamelCase(this.list[i].tableName),
          foreignKey: this.list[i].tableObj.foreignKeyList,
          column: this.list[i].tableObj.columnList()
        })
      }
    }
    this.relationList = relationList;

    // タグを作っていくよー
    while (this.div.firstChild) {
      this.div.removeChild(this.div.firstChild);
    }
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const table = document.createElement('table');
    

    return this.relation;
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
}