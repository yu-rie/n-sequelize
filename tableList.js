import { Table } from "./table.js";

export class TableList {
  constructor(schemaName = 'none') {
    this.schemaName = schemaName;
    this.list = [
      {
        tableName: 'user',
        open: true,
        tableObj: new Table('user').createTable()
      },
      {
        tableName: '',
        open: false      }
    ];
    this.relation = [{}];
    this.div = document.createElement('div');
    this.relation = document.createElement('div');
  }

  createList() {
    if (this.div){
      while (this.div.firstChild) {
        this.div.removeChild(this.div.firstChild);
      }
    }
    for (let i = 0; i < this.list.length; i++) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const input = document.createElement('input');
      summary.innerText = 'テーブル ' + ('00' + (i + 1)).slice(-2) + ': ';
      input.setAttribute('type','text');
      input.value = this.list[i].tableName;
      summary.appendChild(input);
      details.open = this.list[i].open;
      details.addEventListener('toggle', () => {
        this.list[i].open = details.open;
      });
      details.appendChild(summary);

      if (this.list[i].tableObj){
      details.appendChild(this.list[i].tableObj);

      // プラスボタン
      const plusButton = document.createElement('button');
      plusButton.innerText = '+';
      plusButton.addEventListener('click',()=>{
        this.list.splice(i + 1, 0 ,{tableName:'', open:false });
        this.createList();
      });
      summary.appendChild(plusButton);

      // マイナスボタン
      const minusButton = document.createElement('button');
      minusButton.innerText = '-';
      minusButton.addEventListener('click',() => {
        if(this.list.length > 1){
          this.list.splice(i,1);
          this.createList();
        }
      })
      summary.appendChild(minusButton);
      } else {
        // まだテーブルが無いとき
        // 作成ボタン
        const createButton = document.createElement('button');
        createButton.innerText = '作成';
        createButton.addEventListener('click', () => {
          const tName = createButton.previousElementSibling.value;
          this.list[i].tableName = tName;
          this.list[i].open = true;
          this.list[i].tableObj = new Table(tName).createTable();
          this.createList();
        })
        summary.appendChild(createButton);

              // プラスボタン
      const plusButton = document.createElement('button');
      plusButton.innerText = '+';
      plusButton.addEventListener('click',()=>{
        this.list.splice(i + 1, 0 ,{tableName:'', open:false });
        this.createList();
      });
      summary.appendChild(plusButton);


              // マイナスボタン
      const minusButton = document.createElement('button');
      minusButton.innerText = '-';
      minusButton.addEventListener('click',() => {
        if(this.list.length > 1){
          this.list.splice(i,1);
          this.createList();
        }
      })
      summary.appendChild(minusButton);
      }
      this.div.appendChild(details);
    }
    return this.div;
  }

  createRelation(){
    const relationTableList = new Map();
  }
}