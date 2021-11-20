import { Table } from "./table.js";
import { TableList } from "./tableList.js";

const tableList = document.getElementById('table');


tableList.appendChild(new TableList().createList());