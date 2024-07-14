let createTable = (data, idTable) => {
    let table = document.getElementById(idTable);
    let tr = document.createElement("tr");

    for (key in data[0]) {
        let th = document.createElement("th");
        th.innerHTML = key;
        tr.append(th);
    }
    table.append(tr);

    data.forEach((item) => {
        tr = document.createElement("tr");
        for (value in item) {
            let td = document.createElement("td");
            td.innerHTML = item[value];
            tr.append(td);
        }
        table.append(tr);
    });
};

document.addEventListener("DOMContentLoaded", function () {
    createTable(items, "list");
    setSortSelects(items[0], document.getElementById("sort"));

    let searchButton = document.getElementById("search_button");
    searchButton.addEventListener("click", function () {
        let dataForm = document.getElementById("filter");
        filterTable(items, "list", dataForm);
    });

    let clearButton = document.getElementById("clearsearch_button");
    clearButton.addEventListener("click", function(){clearFilter()});

    let SortButton = document.getElementById("sort_button");
    SortButton.addEventListener("click", function () {
        let dataForm = document.getElementById("sort");
        sortTable("list",dataForm)
    });

    let First_Set = document.getElementById("fieldsFirst");
    First_Set.addEventListener("change", function () {
        changeNextSelect("fieldsSecond", First_Set);
    });

    let Second_Set = document.getElementById("fieldsSecond");
    Second_Set.addEventListener("change", function () {
        changeNextSelect("fieldsThird", Second_Set);
    });

    let clearsort = document.getElementById("clearsort_button")
    clearsort.addEventListener("click", function(){
        resetSort("list")
        clearTable("list");
        createTable(items, "list");
    })

});

let dataFilter = (dataForm) => {
    let dictFilter = {};
    for (let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        let valInput = item.value;

        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type == "number") {
            if (valInput !== "") {
                valInput = parseFloat(valInput);
            } else {
                if (item.id.includes("from")) {
                    valInput = Number.NEGATIVE_INFINITY;
                } else if (item.id.includes("to")) {
                    valInput = Number.POSITIVE_INFINITY;
                }
            }
        }
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
};

let filterTable = (data, idTable, dataForm) => {

    let datafilter = dataFilter(dataForm);
    let tableFilter = data.filter((item) => {
        let result = true;
        for (let key in item) {
            let val = item[key];

            if (typeof val == "string") {
                if (key in correspond) {
                    val = item[key].toLowerCase();
                    result &&= val.includes(datafilter[correspond[key]]);
                }
            } else if (typeof val === "number") {
                if (key in correspond)
                    result &&= datafilter[correspond[key][0]] <= val && val <= datafilter[correspond[key][1]];
            }
        }
        return result;
    });
    clearTable(idTable);
    createTable(tableFilter, idTable);
};

let clearFilter = () => {
    document.getElementById("filter").reset();
    clearTable("list");
    createTable(items, "list");
};
function clearTable(idTable) {
    let table = document.getElementById(idTable);
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
}

let createOption = (str, val) => {
    let item = document.createElement("option");
    item.text = str;
    item.value = val;
    return item;
};

let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption("Нет", 0));
    for (let i in head) {
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
};
let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName("select");
    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j != 0) {
            allSelect[j].setAttribute("disabled", "disabled");
        }
    }
};

let changeNextSelect = (nextSelectId, curSelect) => {

    let nextSelect = document.getElementById(nextSelectId);
    if (!parseFloat(curSelect.value)) {
        let allselect = document.getElementsByTagName('select')
        let foundCurrent = false;
        for (let i = 0; i < allselect.length; i++) {
            if (foundCurrent) {
                allselect[i].disabled = true;
            } else if (allselect[i] === curSelect) {
                foundCurrent = true;
            }
        }
    } else {
        nextSelect.disabled = false;
        nextSelect.innerHTML = curSelect.innerHTML;
        let selectedOption = curSelect.options[curSelect.selectedIndex];
        for (let i = 0; i < nextSelect.options.length; i++) {
            if (nextSelect.options[i].value === selectedOption.value) {
                nextSelect.remove(i);
                break;
            }
        }
    }
};

let createSortArr = (data) => {

    let sortArr = [];
    let sortSelects = data.getElementsByTagName("select");
    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) {
            break;
        }
        let desc = document.getElementById(sortSelects[i].id + "Desc").checked;
        if(desc==true) sortArr.push({ column: keySort - 1, order: true });
        else sortArr.push({ column: keySort - 1, order: false });
    }
    return sortArr;
};

let sortTable = (idTable, data) => {

    let sortArr = createSortArr(data);
    if (sortArr.length === 0) {
        return false;
    }
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    rowData.shift();

    rowData.sort((first, second) => {

        for (let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order ? -1 : 1;
            let a = first.cells[key].innerHTML;
            let b = second.cells[key].innerHTML;
            if (parseFloat(a) && parseFloat(b)){
                a = parseFloat(a);
                b = parseFloat(b);
            }
            if (a > b)
                return 1 * order;
            else if (a < b)
                return -1 * order;
        }
        return 0;
    });

    table.innerHTML = table.rows[0].innerHTML;
    rowData.forEach((item) => {
        table.append(item);
    });
};

let resetSort = (tableid) => {

    let table = document.getElementById(tableid)
    document.getElementById("sort").reset();
    document.getElementById("fieldsSecond").disabled = true;
    document.getElementById("fieldsThird").disabled = true;
}

function What_is(data){
    if(data.oy[0].checked ) return 0;
    if(data.oy[1].checked ) return 0;
    if(data.oy[2].checked ) return 1;
    if(data.oy[3].checked ) return 1;
}

function createArrGraph(data, key,number) {
    let what = number==0?'basechance':'maxunluck';
    groupObj = d3.group(data, (d) => d[key]);

    return Array.from(groupObj, ([labelX, values]) => ({
        labelX,
        values: d3.extent(values, d => d[what])

    }));
}

const marginX = 50;
const marginY = 50;
const height = 500;
const width = 800;
let svg = d3.select("svg").attr("height", height).attr("width", width);

function drawGraph(data) {
    const keyX = data.ox.value;

    const number = What_is(data)
    const isMin = data.oy[0].checked || data.oy[2].checked;
    const isMax = data.oy[1].checked || data.oy[3].checked;


    if (!isMin && !isMax) {
        alert("Выберите значение для OY");
    } else {
        const arrGraph = createArrGraph(items, keyX, number);

        svg.selectAll("*").remove();
        const [scX, scY] = createAxis(arrGraph, isMin, isMax);

        const chartType = document.querySelector('input[name="chartType"]:checked').value; // Получаем выбранный тип диаграммы

        if (chartType === "bar") {
            if (isMax) {
                createChart(arrGraph, scX, scY, 1, "red", 0); // столбчатая диаграмма для макс. значений
            }
            if (isMin) {
                createChart(arrGraph, scX, scY, 0, "blue", scX.bandwidth() / 2); // столбчатая диаграмма для мин. значений
            }
        } else if (chartType === "line") {
            if (isMax) {
                createLineChart(arrGraph, scX, scY, 1, "red"); // линейная диаграмма для макс. значений
            }
            if (isMin) {
                createLineChart(arrGraph, scX, scY, 0, "blue"); // линейная диаграмма для мин. значений
            }
        }
    }
}

function createAxis(data, isFirst, isSecond) {

    let firstRange = d3.extent(data.map((d) => d.values[0]));
    let secondRange = d3.extent(data.map((d) => d.values[1]));
    let min = firstRange[0];
    let max = secondRange[1];

    if (!isFirst && isSecond) {
        min = secondRange[0];
        max = secondRange[1];
    } else if (isFirst && !isSecond) {
        min = firstRange[0];
        max = firstRange[1];
    }
    let scaleX = d3
        .scaleBand()
        .domain(data.map((d) => d.labelX))
        .range([0, width - 2 * marginX]);
    let scaleY = d3
        .scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([height - 2 * marginY, 0]);
    // создание осей
    let axisX = d3.axisBottom(scaleX);
    // горизонтальная
    let axisY = d3.axisLeft(scaleY);
    svg
        .append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .selectAll("text")
        // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "0em")
        .attr("dy", ".25em")
    svg
        .append("g")

        .attr("transform", `translate(${marginX}, ${marginY})`)
        .call(axisY);
    return [scaleX, scaleY];
}

function createLineChart(data, scaleX, scaleY, index, color) {
    const line = d3.line()
        .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .y(d => scaleY(d.values[index]));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("transform", `translate(${marginX}, ${marginY})`);
}

function createChart(data, scaleX, scaleY, index, color, offset) {
    const r = 4;
    const barWidth = scaleX.bandwidth() / 2; // делим ширину группы на количество типов данных (в данном случае 2)

    svg.selectAll(`.rect-${index}`)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", `rect-${index}`)
        .attr("x", d => scaleX(d.labelX) + offset)
        .attr("y", d => scaleY(d.values[index]) - marginY)
        .attr("width", barWidth - 5)
        .attr("height", d => height - scaleY(d.values[index]) - marginY)
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .style("fill", color);
}




function changeState(form, value){
    // alert(form.oy[0].value)
    for(let i=0;i<4;++i){

        if(!form.oy[i].value.includes(value)) form.oy[i].checked=false
    }
}